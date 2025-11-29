# SFS Embed SDK Documentation

Drop-in widgets for customer websites (Typeform/Intercom style).

## Quick Start

Add one line to your website:

```html
<script src="https://cdn.sfs.dev/embed.js" data-workspace="your-workspace-id"></script>
```

## Installation Options

### 1. CDN (Recommended)

```html
<!-- Basic Installation -->
<script src="https://cdn.sfs.dev/embed.js" data-workspace="abc123"></script>

<!-- With API Key -->
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-api-key="your-api-key">
</script>

<!-- With Custom Configuration -->
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[{"type":"chat","enabled":true},{"type":"changelog","enabled":true}]'
  data-theme='{"primaryColor":"#2563eb"}'>
</script>
```

### 2. NPM Package

```bash
npm install @sfs/embed-sdk
```

```typescript
import { SFSEmbedSDK } from '@sfs/embed-sdk';

const sdk = new SFSEmbedSDK({
  workspace: 'your-workspace-id',
  apiKey: 'your-api-key',
  widgets: [
    { type: 'chat', enabled: true },
    { type: 'changelog', enabled: true },
  ],
});

await sdk.init();
```

## Available Widgets

### 1. Form Widget

Renders embeddable forms with lead capture.

**Configuration:**

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[{
    "type": "form",
    "enabled": true,
    "config": {
      "formId": "contact-form",
      "title": "Get in Touch",
      "description": "We'll get back to you within 24 hours",
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true,
          "placeholder": "John Doe"
        },
        {
          "name": "email",
          "label": "Email Address",
          "type": "email",
          "required": true,
          "placeholder": "john@example.com"
        },
        {
          "name": "message",
          "label": "Message",
          "type": "textarea",
          "required": true,
          "placeholder": "Tell us about your project..."
        }
      ]
    }
  }]'>
</script>
```

**Features:**
- Custom fields (text, email, tel, textarea, select, checkbox)
- Form validation
- Lead capture to SFS API
- PostMessage API for parent site integration
- Success/error states
- Fully customizable styling

**Events:**

```javascript
// Listen for form submission
window.addEventListener('message', (event) => {
  if (event.data.type === 'sfs_form_submitted') {
    console.log('Form submitted:', event.data);
    // Redirect user, show thank you message, etc.
  }
});
```

### 2. Live Chat Widget

Real-time chat with WebSocket support.

**Configuration:**

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[{
    "type": "chat",
    "enabled": true,
    "config": {
      "workspaceId": "abc123",
      "offlineMessage": "We're currently offline. Leave us a message!",
      "position": {
        "bottom": "20px",
        "right": "20px"
      }
    }
  }]'>
</script>
```

**Features:**
- Real-time WebSocket connection
- Typing indicators
- Read receipts
- Offline mode with message form
- Unread message badge
- File upload support (coming soon)
- Chat history persistence

**WebSocket Events:**

```typescript
// Messages sent to server
{
  type: 'auth' | 'message' | 'typing',
  workspaceId: string,
  content?: string,
  apiKey?: string
}

// Messages received from server
{
  type: 'message' | 'typing' | 'error',
  id: string,
  content: string,
  sender: 'user' | 'agent' | 'bot',
  timestamp: string
}
```

### 3. Calculator Widget

Custom formulas with dynamic inputs.

**Configuration:**

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[{
    "type": "calculator",
    "enabled": true,
    "config": {
      "calculatorId": "savings-calc",
      "title": "Savings Calculator",
      "formula": "(monthlyInvestment * 12 * years) + (monthlyInvestment * 12 * years * interestRate / 100)",
      "inputs": [
        {
          "name": "monthlyInvestment",
          "label": "Monthly Investment",
          "type": "slider",
          "min": 100,
          "max": 10000,
          "step": 100,
          "default": 1000,
          "prefix": "$"
        },
        {
          "name": "years",
          "label": "Investment Period",
          "type": "slider",
          "min": 1,
          "max": 30,
          "step": 1,
          "default": 10,
          "suffix": " years"
        },
        {
          "name": "interestRate",
          "label": "Annual Interest Rate",
          "type": "slider",
          "min": 1,
          "max": 15,
          "step": 0.5,
          "default": 7,
          "suffix": "%"
        }
      ],
      "ctaText": "Get Started",
      "ctaUrl": "https://yoursite.com/signup"
    }
  }]'>
</script>
```

**Features:**
- Custom JavaScript formulas
- Slider and number inputs
- Real-time calculation
- Currency formatting
- CTA button with pre-filled data
- PostMessage API for results

**Events:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'sfs_calculator_result') {
    console.log('Result:', event.data.result);
    console.log('Inputs:', event.data.inputs);
  }
});
```

### 4. Changelog Widget

Display latest product updates with badge notification.

**Configuration:**

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[{
    "type": "changelog",
    "enabled": true,
    "config": {
      "workspaceId": "abc123",
      "badge": true,
      "maxItems": 10
    }
  }]'>
</script>
```

**Features:**
- Automatic badge with unread count
- Categorized updates (feature, improvement, bugfix)
- Read/unread tracking (localStorage)
- Beautiful modal UI
- Fetches from SFS Knowledge Base API

## Theming

Customize the appearance of all widgets:

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-theme='{
    "primaryColor": "#2563eb",
    "borderRadius": "12px",
    "fontFamily": "Inter, -apple-system, sans-serif",
    "position": {
      "bottom": "20px",
      "right": "20px"
    }
  }'>
</script>
```

## Security

### CORS Whitelist

Configure allowed domains in your SFS dashboard:

```typescript
// Only these domains can embed widgets
allowedDomains: ['example.com', '*.example.com', 'app.example.com']
```

### API Key

Scope API keys to specific workspaces:

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-api-key="sfs_live_abc123xyz...">
</script>
```

### Rate Limiting

Default: 100 requests/minute per domain.

Upgrade for higher limits:
- **Pro**: 10,000 widget loads/month (£19/mo)
- **Enterprise**: Unlimited + white-label

## Platform Integration Examples

### WordPress

```html
<!-- Add to footer.php or use a plugin like "Header Footer Code Manager" -->
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="your-workspace-id">
</script>
```

### Shopify

```liquid
<!-- Add to theme.liquid before </body> -->
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="{{ settings.sfs_workspace_id }}">
</script>
```

### Webflow

1. Go to Project Settings → Custom Code
2. Add to "Footer Code":

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="your-workspace-id">
</script>
```

### Next.js

```typescript
// app/layout.tsx or pages/_app.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://cdn.sfs.dev/embed.js"
          data-workspace="your-workspace-id"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

### React (SPA)

```typescript
// App.tsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sfs.dev/embed.js';
    script.dataset.workspace = 'your-workspace-id';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div>Your App</div>;
}
```

## Advanced Usage

### Programmatic Control

```javascript
// Access the SDK instance
const sfs = window.SFSEmbed;

// Manually initialize
const sdk = new sfs.SDK({
  workspace: 'abc123',
  widgets: [
    { type: 'chat', enabled: true },
  ],
});

await sfs.init(sdk);

// Destroy widgets
sdk.destroy();

// Check if widget is mounted
const isChatMounted = sdk.isWidgetMounted('chat');

// Unmount specific widget
sdk.unmountWidget('chat');
```

### Custom Events

```javascript
// Form submission
window.addEventListener('message', (event) => {
  if (event.data.type === 'sfs_form_submitted') {
    // Send to Google Analytics
    gtag('event', 'form_submit', {
      form_id: event.data.formId,
    });
  }
});

// Calculator result
window.addEventListener('message', (event) => {
  if (event.data.type === 'sfs_calculator_result') {
    // Store in localStorage
    localStorage.setItem('calculator_result', JSON.stringify(event.data));
  }
});
```

## Performance

- **Bundle Size**: <50KB gzipped
- **Lazy Loading**: Widgets load on scroll
- **CDN**: Cloudflare with <30ms global latency
- **Caching**: Aggressive caching with versioning

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Monetization Tiers

### Free Tier
- 1,000 widget loads/month
- All widgets included
- "Powered by SFS" badge

### Pro Tier (£19/mo)
- 10,000 widget loads/month
- Remove "Powered by SFS" badge
- Priority support

### Enterprise
- Unlimited widget loads
- White-label option
- Custom domains
- SLA guarantee

## API Endpoints

### Form Submission

```
POST https://api.sfs.dev/forms/:formId/submit
Content-Type: application/json
X-SFS-API-Key: your-api-key

{
  "workspaceId": "abc123",
  "formId": "contact-form",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "url": "https://example.com/contact",
    "referrer": "https://google.com",
    "timestamp": "2025-01-15T12:00:00Z"
  }
}
```

### Changelog Fetch

```
GET https://api.sfs.dev/changelog/:workspaceId?limit=10
X-SFS-API-Key: your-api-key
```

### WebSocket Chat

```
wss://ws.sfs.dev/chat?workspace=abc123
```

## Troubleshooting

### Widgets not appearing

1. Check browser console for errors
2. Verify `data-workspace` attribute is correct
3. Check domain is whitelisted in SFS dashboard
4. Ensure script loads after `<body>` tag

### CORS errors

Add your domain to the allowlist in Settings → Embed Settings.

### Rate limit exceeded

Upgrade to Pro or Enterprise tier for higher limits.

## Support

- Documentation: https://docs.sfs.dev/embed
- GitHub Issues: https://github.com/sfs/embed-sdk/issues
- Email: support@sfs.dev
- Discord: https://discord.gg/sfs

## Changelog

### v1.0.0 (2025-01-15)
- Initial release
- Form Widget
- Live Chat Widget
- Calculator Widget
- Changelog Widget
- CDN distribution
- NPM package

## License

MIT License - See LICENSE file for details.

---

Built with ❤️ by the SFS team
