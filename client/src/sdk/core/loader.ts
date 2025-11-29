/**
 * SFS Embed SDK - Core Loader
 * Main initialization and widget mounting logic
 */

import { SDKConfig } from './config';
import { SecurityManager } from './security';
import type { SFSEmbedConfig, WidgetType } from '../types';

export class SFSEmbedSDK {
  private config: SDKConfig;
  private security: SecurityManager;
  private mountedWidgets: Map<WidgetType, HTMLElement>;
  private initialized: boolean = false;

  constructor(config: SFSEmbedConfig) {
    this.config = new SDKConfig(config);
    this.security = new SecurityManager(this.config.getSecurityConfig());
    this.mountedWidgets = new Map();

    // Validate domain before proceeding
    if (!this.security.validateDomain()) {
      throw new Error(
        'SFS Embed SDK: This domain is not authorized to embed widgets'
      );
    }
  }

  /**
   * Initialize the SDK and mount all enabled widgets
   */
  public async init(): Promise<void> {
    if (this.initialized) {
      console.warn('SFS Embed SDK: Already initialized');
      return;
    }

    try {
      // Inject widget styles
      this.injectStyles();

      // Mount enabled widgets
      const widgets = this.config.getWidgets();
      for (const widget of widgets) {
        if (widget.enabled) {
          await this.mountWidget(widget.type, widget.config);
        }
      }

      // Set up cleanup interval
      setInterval(() => this.security.cleanup(), 60000);

      this.initialized = true;
      console.log('SFS Embed SDK: Initialized successfully');
    } catch (error) {
      console.error('SFS Embed SDK: Initialization failed', error);
      throw error;
    }
  }

  /**
   * Mount a specific widget
   */
  private async mountWidget(
    type: WidgetType,
    config?: Record<string, any>
  ): Promise<void> {
    if (this.mountedWidgets.has(type)) {
      console.warn(`SFS Embed SDK: Widget ${type} already mounted`);
      return;
    }

    // Create container for the widget
    const container = document.createElement('div');
    container.id = `sfs-widget-${type}`;
    container.className = 'sfs-widget-container';
    document.body.appendChild(container);

    // Store reference
    this.mountedWidgets.set(type, container);

    // Widget-specific mounting will be handled by React components
    // This is just the DOM container setup
  }

  /**
   * Unmount a specific widget
   */
  public unmountWidget(type: WidgetType): void {
    const container = this.mountedWidgets.get(type);
    if (container) {
      container.remove();
      this.mountedWidgets.delete(type);
    }
  }

  /**
   * Unmount all widgets and cleanup
   */
  public destroy(): void {
    for (const [type] of this.mountedWidgets) {
      this.unmountWidget(type);
    }
    this.initialized = false;
    console.log('SFS Embed SDK: Destroyed');
  }

  /**
   * Inject widget styles into the page
   */
  private injectStyles(): void {
    const styleId = 'sfs-embed-styles';

    // Don't inject if already present
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .sfs-widget-container {
        position: fixed;
        z-index: 999999;
        font-family: ${this.config.getTheme()?.fontFamily};
      }

      .sfs-widget-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999998;
        animation: sfs-fade-in 0.2s ease-out;
      }

      @keyframes sfs-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes sfs-slide-in {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .sfs-widget-card {
        background: white;
        border-radius: ${this.config.getTheme()?.borderRadius || '12px'};
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        animation: sfs-slide-in 0.3s ease-out;
      }

      .sfs-widget-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${this.config.getTheme()?.primaryColor || '#2563eb'};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .sfs-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .sfs-widget-button:active {
        transform: scale(0.95);
      }

      @media (prefers-color-scheme: dark) {
        .sfs-widget-card {
          background: #1a1a1a;
          color: #f5f5f5;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Get config instance
   */
  public getConfig(): SDKConfig {
    return this.config;
  }

  /**
   * Get security manager instance
   */
  public getSecurity(): SecurityManager {
    return this.security;
  }

  /**
   * Check if a widget is mounted
   */
  public isWidgetMounted(type: WidgetType): boolean {
    return this.mountedWidgets.has(type);
  }

  /**
   * Get container element for a widget
   */
  public getWidgetContainer(type: WidgetType): HTMLElement | undefined {
    return this.mountedWidgets.get(type);
  }
}

/**
 * Global SDK instance
 */
let sdkInstance: SFSEmbedSDK | null = null;

/**
 * Initialize the SDK from window object
 */
export function initFromWindow(): SFSEmbedSDK | null {
  // Look for config in script tag data attributes
  const script = document.currentScript as HTMLScriptElement;

  if (!script) {
    console.error('SFS Embed SDK: Could not find script tag');
    return null;
  }

  const workspace = script.dataset.workspace;
  const apiKey = script.dataset.apiKey;

  if (!workspace) {
    console.error('SFS Embed SDK: data-workspace attribute is required');
    return null;
  }

  const config: SFSEmbedConfig = {
    workspace,
    apiKey,
  };

  // Check for widgets configuration
  const widgetsAttr = script.dataset.widgets;
  if (widgetsAttr) {
    try {
      config.widgets = JSON.parse(widgetsAttr);
    } catch (e) {
      console.error('SFS Embed SDK: Invalid widgets configuration', e);
    }
  }

  // Check for theme configuration
  const themeAttr = script.dataset.theme;
  if (themeAttr) {
    try {
      config.theme = JSON.parse(themeAttr);
    } catch (e) {
      console.error('SFS Embed SDK: Invalid theme configuration', e);
    }
  }

  sdkInstance = new SFSEmbedSDK(config);
  return sdkInstance;
}

/**
 * Get the current SDK instance
 */
export function getSDKInstance(): SFSEmbedSDK | null {
  return sdkInstance;
}
