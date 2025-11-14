# Design Guidelines: Embeddable Widget SDK

## Design Approach: Design System-Based

**Selected System**: Material Design 3 with customization for embedding flexibility

**Justification**: This SDK must integrate seamlessly into diverse host websites while maintaining professional quality. A design system approach ensures:
- Consistent, predictable UI patterns across all widgets
- Clean, unobtrusive design that won't clash with host sites
- Accessibility and usability standards
- Scalable component architecture

**Key Principles**:
- Neutral elegance: Professional appearance that complements any host site
- Minimal footprint: Compact widgets that don't dominate the page
- Clear hierarchy: Instant recognition of interactive elements
- Adaptability: Works on light or dark backgrounds

## Typography

**Font Stack**: System fonts for zero-load performance
```
Font Families:
- Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Monospace (for calculator): 'SF Mono', Monaco, 'Cascadia Code', monospace

Hierarchy:
- Widget headers: 16px, font-weight 600
- Body text: 14px, font-weight 400
- Labels: 12px, font-weight 500
- Button text: 14px, font-weight 600
- Calculator display: 24px, font-weight 400, monospace
```

## Layout System

**Spacing Primitives**: Tailwind units of 2, 3, 4, 6, 8
- Widget padding: p-4 to p-6
- Element gaps: gap-3 to gap-4
- Section spacing: mb-6, mt-4
- Compact spacing: space-y-2 for forms

**Widget Dimensions**:
- Chat widget: 360px × 500px (mobile: full width)
- Form widget: 400px × auto (mobile: full width)
- Calculator widget: 320px × 480px
- Demo page container: max-w-6xl, px-6

## Component Library

### Core Widget Elements

**Widget Container**:
- Rounded corners (rounded-xl)
- Shadow elevation: shadow-2xl for floating widgets
- Backdrop blur for overlay widgets
- Fixed positioning for chat/floating widgets

**Trigger Buttons** (Chat/Form launchers):
- Circular: 56px diameter
- Fixed bottom-right: bottom-6, right-6
- Icon-only with tooltip on hover
- Prominent shadow: shadow-lg

**Form Widget**:
- Vertical stack layout
- Input fields: h-10, rounded-lg, px-3
- Full-width inputs with consistent spacing (space-y-3)
- Submit button: w-full, h-10, rounded-lg
- Validation messages: text-sm below inputs

**Calculator Widget**:
- Display area: h-16, text-right, px-4
- Button grid: 4×5 layout, gap-2
- Number buttons: h-12, rounded-lg
- Operator buttons: Visually distinct (consider subtle differentiation)
- Equal button: Spans 2 columns

**Chat Widget**:
- Header: h-14, flex items-center, px-4
- Messages area: flex-1, overflow-y-auto, p-4, space-y-3
- Message bubbles: max-w-[80%], rounded-2xl, px-4, py-2
- User messages: ml-auto, rounded-br-sm
- Bot messages: mr-auto, rounded-bl-sm
- Input area: h-14, flex items-center, px-3, gap-2
- Input field: flex-1, h-10, rounded-full, px-4
- Send button: 40px circle, rounded-full

### Demo Page Components

**Hero Section**:
- 60vh height minimum
- Centered content with max-w-3xl
- Large heading (text-5xl), descriptive subtitle (text-xl)
- CTA buttons: gap-4, h-12, px-8, rounded-lg
- Code snippet preview below hero

**Integration Examples Section**:
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Each example card: p-6, rounded-xl, shadow-md
- Live widget preview inside card
- Code snippet below with copy button
- Toggle between preview/code views

**Code Snippets**:
- Monospace font, text-sm
- Syntax highlighting via Prism.js or highlight.js
- Copy button: absolute top-2 right-2
- Background treatment to distinguish from content

**Features Section**:
- 2-column grid (grid-cols-1 md:grid-cols-2)
- Icon + heading + description pattern
- Icons: 24px, consistent style from Heroicons
- Generous spacing: py-16 for section

**Documentation Section**:
- Single column, max-w-4xl
- Tabbed interface for different widget types
- Step-by-step integration guide
- API reference table: bordered cells, alternating row treatment

**Footer**:
- 3-column layout: Logo/About, Quick Links, Developer Resources
- Links: text-sm, space-y-2
- Social icons: 20px, gap-3
- Copyright: text-xs, text-center, pt-6

## Responsive Behavior

**Mobile Adaptations** (< 768px):
- Chat widget: Full screen overlay when open
- Form/Calculator: Bottom sheet style (slide up from bottom)
- Demo page: Single column stacking
- Trigger buttons: Slightly smaller (48px)
- Reduced padding: p-4 instead of p-6

**Tablet** (768px - 1024px):
- 2-column grids where appropriate
- Widgets maintain desktop dimensions
- Demo page container: max-w-4xl

## Animations

**Use sparingly, only for feedback**:
- Widget open/close: Scale + fade (200ms)
- Message sending: Slide up + fade (150ms)
- Button interactions: Scale on click (100ms)
- NO decorative scroll animations
- NO complex transitions

## Images

**Hero Section**: 
- Subtle abstract geometric background pattern (low opacity overlay)
- OR gradient background (no image needed - code/tech aesthetic works better)

**Feature Cards**:
- Small icons only (from Heroicons library)
- No photography needed

**Widget Previews**:
- Live interactive widgets (no static screenshots)
- Browser window mockup frames optional

**General Approach**: Minimal image use - this is a developer tool where clean, functional design speaks louder than photography. Focus on live widget demonstrations and clear code examples.