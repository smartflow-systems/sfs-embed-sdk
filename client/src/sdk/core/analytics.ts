/**
 * SFS Embed SDK - Analytics & Event Tracking
 * Track widget performance, conversions, and user behavior
 */

export interface AnalyticsEvent {
  event: string;
  widget: string;
  workspaceId: string;
  timestamp: number;
  properties?: Record<string, any>;
  sessionId: string;
  userId?: string;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  pageUrl: string;
  referrer: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browserName: string;
}

export interface AnalyticsConfig {
  workspaceId: string;
  apiUrl?: string;
  apiKey?: string;
  trackPageViews?: boolean;
  trackClicks?: boolean;
  trackConversions?: boolean;
  debug?: boolean;
}

export class Analytics {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private sessionData: SessionData;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor(config: AnalyticsConfig) {
    this.config = {
      apiUrl: 'https://api.sfs.dev/analytics',
      trackPageViews: true,
      trackClicks: true,
      trackConversions: true,
      debug: false,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();

    this.sessionData = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      events: [],
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(),
      browserName: this.getBrowserName(),
    };

    this.startFlushTimer();
    this.setupEventListeners();

    if (this.config.debug) {
      console.log('[SFS Analytics] Initialized', {
        sessionId: this.sessionId,
        userId: this.userId,
      });
    }
  }

  /**
   * Track a custom event
   */
  public track(event: string, widget: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      widget,
      workspaceId: this.config.workspaceId,
      timestamp: Date.now(),
      properties,
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.events.push(analyticsEvent);
    this.sessionData.events.push(analyticsEvent);

    if (this.config.debug) {
      console.log('[SFS Analytics] Event tracked:', analyticsEvent);
    }

    // Flush immediately for critical events
    if (this.isCriticalEvent(event)) {
      this.flush();
    }
  }

  /**
   * Track widget loaded
   */
  public trackWidgetLoaded(widget: string, loadTime: number): void {
    this.track('widget_loaded', widget, {
      loadTime,
      timestamp: Date.now(),
    });
  }

  /**
   * Track widget opened
   */
  public trackWidgetOpened(widget: string): void {
    this.track('widget_opened', widget, {
      timestamp: Date.now(),
    });
  }

  /**
   * Track widget closed
   */
  public trackWidgetClosed(widget: string, timeSpent: number): void {
    this.track('widget_closed', widget, {
      timeSpent,
      timestamp: Date.now(),
    });
  }

  /**
   * Track form submission
   */
  public trackFormSubmit(formId: string, fields: string[], success: boolean): void {
    this.track('form_submit', 'form', {
      formId,
      fields,
      success,
      timestamp: Date.now(),
    });

    if (success) {
      this.trackConversion('form_submission', formId);
    }
  }

  /**
   * Track chat message sent
   */
  public trackChatMessage(sender: 'user' | 'agent' | 'bot', messageLength: number): void {
    this.track('chat_message', 'chat', {
      sender,
      messageLength,
      timestamp: Date.now(),
    });
  }

  /**
   * Track chat started
   */
  public trackChatStarted(): void {
    this.track('chat_started', 'chat', {
      timestamp: Date.now(),
    });
  }

  /**
   * Track chat ended
   */
  public trackChatEnded(duration: number, messageCount: number): void {
    this.track('chat_ended', 'chat', {
      duration,
      messageCount,
      timestamp: Date.now(),
    });
  }

  /**
   * Track calculator result
   */
  public trackCalculatorResult(calculatorId: string, result: number, inputs: Record<string, number>): void {
    this.track('calculator_result', 'calculator', {
      calculatorId,
      result,
      inputs,
      timestamp: Date.now(),
    });
  }

  /**
   * Track changelog viewed
   */
  public trackChangelogViewed(entryCount: number, unreadCount: number): void {
    this.track('changelog_viewed', 'changelog', {
      entryCount,
      unreadCount,
      timestamp: Date.now(),
    });
  }

  /**
   * Track conversion
   */
  public trackConversion(conversionType: string, value?: string | number): void {
    if (!this.config.trackConversions) return;

    this.track('conversion', 'conversion', {
      conversionType,
      value,
      timestamp: Date.now(),
    });

    // Send conversion to Google Analytics if available
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        event_category: 'SFS Widget',
        event_label: conversionType,
        value: value || 1,
      });
    }

    // Send to Facebook Pixel if available
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead', {
        content_name: conversionType,
        value: value || 1,
      });
    }
  }

  /**
   * Track page view
   */
  public trackPageView(url?: string): void {
    if (!this.config.trackPageViews) return;

    this.track('page_view', 'global', {
      url: url || window.location.href,
      title: document.title,
      timestamp: Date.now(),
    });
  }

  /**
   * Track click
   */
  public trackClick(element: string, widget: string): void {
    if (!this.config.trackClicks) return;

    this.track('click', widget, {
      element,
      timestamp: Date.now(),
    });
  }

  /**
   * Track error
   */
  public trackError(error: Error, widget: string, context?: string): void {
    this.track('error', widget, {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    });
  }

  /**
   * Set user ID
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('sfs_user_id', userId);

    if (this.config.debug) {
      console.log('[SFS Analytics] User ID set:', userId);
    }
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: Record<string, any>): void {
    localStorage.setItem('sfs_user_properties', JSON.stringify(properties));

    this.track('user_properties', 'global', properties);
  }

  /**
   * Flush events to server
   */
  public async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const response = await fetch(`${this.config.apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'X-SFS-API-Key': this.config.apiKey }),
        },
        body: JSON.stringify({
          workspaceId: this.config.workspaceId,
          sessionId: this.sessionId,
          events: eventsToSend,
          sessionData: this.sessionData,
        }),
        keepalive: true, // Important for beforeunload
      });

      if (!response.ok) {
        // Put events back in queue if failed
        this.events.unshift(...eventsToSend);
        throw new Error(`Analytics API error: ${response.status}`);
      }

      if (this.config.debug) {
        console.log('[SFS Analytics] Events flushed:', eventsToSend.length);
      }
    } catch (error) {
      console.error('[SFS Analytics] Flush error:', error);
      // Put events back in queue
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * End session
   */
  public endSession(): void {
    this.sessionData.endTime = Date.now();
    this.flush();

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  /**
   * Get session summary
   */
  public getSessionSummary(): SessionData {
    return {
      ...this.sessionData,
      events: [...this.sessionData.events],
    };
  }

  /**
   * Export analytics data (for debugging)
   */
  public exportData(): {
    session: SessionData;
    pendingEvents: AnalyticsEvent[];
  } {
    return {
      session: this.getSessionSummary(),
      pendingEvents: [...this.events],
    };
  }

  // Private methods

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('sfs_user_id') || undefined;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
    return 'Unknown';
  }

  private isCriticalEvent(event: string): boolean {
    return ['conversion', 'form_submit', 'error'].includes(event);
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private setupEventListeners(): void {
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flush();
      }
    });

    // Track page views on navigation (for SPAs)
    if (this.config.trackPageViews) {
      let lastUrl = window.location.href;
      new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          this.trackPageView(currentUrl);
        }
      }).observe(document.body, { subtree: true, childList: true });
    }
  }
}

/**
 * Create global analytics instance
 */
let analyticsInstance: Analytics | null = null;

export function initAnalytics(config: AnalyticsConfig): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config);
  }
  return analyticsInstance;
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}
