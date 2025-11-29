/**
 * SFS Embed SDK - Configuration
 */

import type { SFSEmbedConfig, SecurityConfig } from '../types';

const DEFAULT_API_URL = 'https://api.sfs.dev';
const DEFAULT_WS_URL = 'wss://ws.sfs.dev';
const DEFAULT_CDN_URL = 'https://cdn.sfs.dev';

export class SDKConfig {
  private config: SFSEmbedConfig;
  private securityConfig: SecurityConfig;

  constructor(config: SFSEmbedConfig) {
    this.config = this.validateConfig(config);
    this.securityConfig = {
      corsEnabled: true,
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000, // 1 minute
      },
    };
  }

  private validateConfig(config: SFSEmbedConfig): SFSEmbedConfig {
    if (!config.workspace) {
      throw new Error('SFS Embed SDK: workspace ID is required');
    }

    return {
      ...config,
      domain: config.domain || window.location.hostname,
      widgets: config.widgets || [],
      theme: {
        primaryColor: '#2563eb',
        position: { bottom: '20px', right: '20px' },
        borderRadius: '12px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        ...config.theme,
      },
    };
  }

  public getConfig(): SFSEmbedConfig {
    return this.config;
  }

  public getWorkspaceId(): string {
    return this.config.workspace;
  }

  public getApiKey(): string | undefined {
    return this.config.apiKey;
  }

  public getApiUrl(): string {
    return DEFAULT_API_URL;
  }

  public getWsUrl(): string {
    return DEFAULT_WS_URL;
  }

  public getTheme() {
    return this.config.theme;
  }

  public getWidgets() {
    return this.config.widgets || [];
  }

  public getSecurityConfig(): SecurityConfig {
    return this.securityConfig;
  }

  public isWidgetEnabled(type: string): boolean {
    const widget = this.config.widgets?.find((w) => w.type === type);
    return widget?.enabled ?? false;
  }
}
