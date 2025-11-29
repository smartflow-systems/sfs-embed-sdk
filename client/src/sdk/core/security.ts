/**
 * SFS Embed SDK - Security
 * CORS validation, API key verification, and rate limiting
 */

import type { SecurityConfig } from '../types';

export class SecurityManager {
  private config: SecurityConfig;
  private requestCounts: Map<string, { count: number; resetTime: number }>;

  constructor(config: SecurityConfig) {
    this.config = config;
    this.requestCounts = new Map();
  }

  /**
   * Validate if the current domain is allowed to embed widgets
   */
  public validateDomain(): boolean {
    if (!this.config.corsEnabled) {
      return true;
    }

    const currentDomain = window.location.hostname;
    const allowedDomains = this.config.allowedDomains || [];

    // If no domains specified, allow all
    if (allowedDomains.length === 0) {
      return true;
    }

    // Check if current domain is in the allowed list
    return allowedDomains.some((domain) => {
      // Support wildcard subdomains (e.g., *.example.com)
      if (domain.startsWith('*.')) {
        const baseDomain = domain.slice(2);
        return currentDomain.endsWith(baseDomain);
      }
      return currentDomain === domain;
    });
  }

  /**
   * Check if request is within rate limit
   */
  public checkRateLimit(identifier: string = 'global'): boolean {
    if (!this.config.rateLimit) {
      return true;
    }

    const now = Date.now();
    const { maxRequests, windowMs } = this.config.rateLimit;

    const record = this.requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      // Create new window
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxRequests) {
      console.warn(`SFS Embed SDK: Rate limit exceeded for ${identifier}`);
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Validate API key format
   */
  public validateApiKey(apiKey?: string): boolean {
    if (!apiKey) {
      return false;
    }

    // Basic format validation (you can customize this)
    const apiKeyRegex = /^[a-zA-Z0-9_-]{32,}$/;
    return apiKeyRegex.test(apiKey);
  }

  /**
   * Create authenticated request headers
   */
  public getAuthHeaders(apiKey?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['X-SFS-API-Key'] = apiKey;
    }

    return headers;
  }

  /**
   * Clean up old rate limit records
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requestCounts.entries()) {
      if (now > record.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }
}
