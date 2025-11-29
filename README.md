# SFS Embed SDK

Drop-in widgets for customer websites - Typeform/Intercom style embeddable components.

## Overview

SFS Embed SDK allows you to add professional widgets to any website with just one line of code. Perfect for:

- Lead capture forms
- Live customer support chat
- Interactive calculators
- Product update notifications

## Quick Start

```html
<script src="https://cdn.sfs.dev/embed.js" data-workspace="your-workspace-id"></script>
```

## Features

### 🎯 Four Powerful Widgets

1. **Form Widget** - Customizable forms with lead capture
2. **Live Chat** - Real-time customer support with WebSocket
3. **Calculator** - Interactive calculators with custom formulas
4. **Changelog** - Product update notifications with badges

### 🎨 SFS Design System

All widgets follow the SmartFlow Systems design guidelines:

- **Primary Color**: SFS Blue (`#3B82F6` / `hsl(221 83% 53%)`)
- **Typography**: Inter font family
- **Elevation System**: Subtle hover effects and shadows
- **Dark Mode**: Full support with automatic detection
- **Responsive**: Mobile-first design

### 🔒 Security

- CORS whitelist validation
- API key authentication
- Rate limiting (100 req/min default)
- Domain restrictions
- XSS protection

### ⚡ Performance

- Bundle size: <50KB gzipped
- Lazy loading support
- CDN delivery (Cloudflare)
- Efficient caching

## Project Structure

```
sfs-embed-sdk/
├── client/
│   └── src/
│       ├── sdk/                  # Embeddable SDK
│       │   ├── core/            # Core functionality
│       │   │   ├── loader.ts    # Main SDK loader
│       │   │   ├── config.ts    # Configuration
│       │   │   └── security.ts  # Security features
│       │   ├── widgets/         # Widget components
│       │   │   ├── FormWidget.tsx
│       │   │   ├── LiveChatWidget.tsx
│       │   │   ├── CalculatorWidget.tsx
│       │   │   └── ChangelogWidget.tsx
│       │   ├── types/           # TypeScript types
│       │   └── index.tsx        # Main entry point
│       ├── components/          # Demo app components
│       ├── pages/               # Demo app pages
│       └── index.css            # SFS Design System styles
├── server/                      # Express backend
├── examples/                    # Usage examples
├── dist/
│   └── sdk/
│       └── sfs-embed.min.js    # Built SDK bundle
├── SDK_DOCUMENTATION.md         # Full SDK documentation
└── README.md                    # This file
```

## Development

### Install Dependencies

```bash
npm install
```

### Build SDK

```bash
# Build only the SDK
npm run build:sdk

# Build everything (app + SDK)
npm run build:all
```

### Development Server

```bash
npm run dev
```

The app will run at http://localhost:5000 with:
- Demo website showcasing all widgets
- Interactive examples
- Documentation

### Testing Widgets

Open the example HTML files in `examples/`:

```bash
# After building the SDK
open examples/all-widgets.html
open examples/form-widget.html
open examples/chat-widget.html
open examples/calculator-widget.html
open examples/changelog-widget.html
```

## Documentation

See [SDK_DOCUMENTATION.md](./SDK_DOCUMENTATION.md) for comprehensive documentation including:

- Installation methods (CDN, NPM)
- Widget configuration options
- Platform integrations (WordPress, Shopify, Next.js, etc.)
- API reference
- Security setup
- Troubleshooting

## Usage Examples

### Basic Installation

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123">
</script>
```

### Enable Specific Widgets

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-widgets='[
    {"type": "chat", "enabled": true},
    {"type": "changelog", "enabled": true}
  ]'>
</script>
```

### Custom Theme

```html
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="abc123"
  data-theme='{"primaryColor": "#667eea"}'>
</script>
```

### Programmatic Control

```javascript
const sdk = new window.SFSEmbed.SDK({
  workspace: 'abc123',
  widgets: [
    { type: 'chat', enabled: true }
  ]
});

await window.SFSEmbed.init(sdk);
```

## Tech Stack

### Frontend
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with SFS design tokens
- **Vite** - Build tool
- **Wouter** - Lightweight routing

### Backend (Optional)
- **Express** - API server
- **WebSocket** - Real-time chat
- **PostgreSQL** - Database (via Drizzle ORM)

### Build
- **Vite** - Fast bundling
- **Terser** - Minification
- **ESBuild** - Server bundling

## API Endpoints

The SDK connects to these endpoints:

- **Forms**: `POST https://api.sfs.dev/forms/:formId/submit`
- **Changelog**: `GET https://api.sfs.dev/changelog/:workspaceId`
- **Chat**: `wss://ws.sfs.dev/chat?workspace=:id`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Monetization

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
- White-label
- Custom domains
- SLA

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-widget`)
3. Commit your changes (`git commit -m 'Add amazing widget'`)
4. Push to the branch (`git push origin feature/amazing-widget`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: https://docs.sfs.dev/embed
- **Email**: support@sfs.dev
- **GitHub Issues**: https://github.com/sfs/embed-sdk/issues
- **Discord**: https://discord.gg/sfs

## Roadmap

- [x] Form Widget
- [x] Live Chat Widget
- [x] Calculator Widget
- [x] Changelog Widget
- [ ] NPM Package
- [ ] File upload in chat
- [ ] Video call widget
- [ ] Appointment booking widget
- [ ] Payment widget
- [ ] Survey widget
- [ ] White-label option
- [ ] Analytics dashboard
- [ ] A/B testing

## Credits

Built with ❤️ by the SmartFlow Systems team.

Design system follows SFS brand guidelines with:
- SFS Blue primary color
- Inter typography
- Elevation-based interactions
- Mobile-first responsiveness

---

**Ready to embed?** Check out the [full documentation](./SDK_DOCUMENTATION.md) to get started!
