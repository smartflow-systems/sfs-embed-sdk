/**
 * SFS Embed SDK - Main Entry Point
 * Drop-in widgets for customer websites
 *
 * Usage:
 * <script src="https://cdn.sfs.dev/embed.js" data-workspace="abc123"></script>
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { SFSEmbedSDK, initFromWindow } from './core/loader';
import { FormWidget } from './widgets/FormWidget';
import { LiveChatWidget } from './widgets/LiveChatWidget';
import { CalculatorWidget } from './widgets/CalculatorWidget';
import { ChangelogWidget } from './widgets/ChangelogWidget';

export * from './types';
export * from './core/config';
export * from './core/security';
export * from './core/loader';
export * from './core/analytics';
export * from './core/ai';
export * from './widgets';

/**
 * Initialize SDK and render widgets
 */
export async function initSDK(sdk: SFSEmbedSDK) {
  await sdk.init();

  const config = sdk.getConfig().getConfig();
  const workspaceId = sdk.getConfig().getWorkspaceId();
  const apiKey = sdk.getConfig().getApiKey();

  // Render each enabled widget
  config.widgets?.forEach((widget) => {
    if (!widget.enabled) return;

    const container = sdk.getWidgetContainer(widget.type);
    if (!container) return;

    const root = createRoot(container);

    switch (widget.type) {
      case 'form':
        root.render(
          <FormWidget
            config={widget.config}
            workspaceId={workspaceId}
            apiKey={apiKey}
          />
        );
        break;

      case 'chat':
        root.render(
          <LiveChatWidget
            config={widget.config}
            workspaceId={workspaceId}
            apiKey={apiKey}
          />
        );
        break;

      case 'calculator':
        root.render(
          <CalculatorWidget
            config={widget.config}
            workspaceId={workspaceId}
          />
        );
        break;

      case 'changelog':
        root.render(
          <ChangelogWidget
            config={widget.config}
            workspaceId={workspaceId}
            apiKey={apiKey}
          />
        );
        break;
    }
  });
}

/**
 * Auto-initialize when script loads
 */
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const sdk = initFromWindow();
      if (sdk) {
        initSDK(sdk).catch(console.error);
      }
    });
  } else {
    const sdk = initFromWindow();
    if (sdk) {
      initSDK(sdk).catch(console.error);
    }
  }

  // Expose SDK to window for programmatic access
  (window as any).SFSEmbed = {
    SDK: SFSEmbedSDK,
    init: initSDK,
    FormWidget,
    LiveChatWidget,
    CalculatorWidget,
    ChangelogWidget,
  };
}

export default SFSEmbedSDK;
