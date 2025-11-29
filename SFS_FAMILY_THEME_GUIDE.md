# 🎨 SFS FAMILY THEME - Complete Guide

**Luxurious Gold on Dark Marble with Circuit-Flow Animations**

Welcome to the SFS Family Theme - a beautiful, professional design system that makes your widgets look absolutely stunning!

---

## ✨ WHAT'S INCLUDED

### 🎨 **4 Core Theme Files**

1. **`sfs-complete-theme.css`** - All theme variables and styles
2. **`sfs-circuit-flow.js`** - Animated golden circuit background
3. **`sfs-globals.css`** - Global resets and base styles
4. **`sfs-theme-config.json`** - Configuration values

### 🎯 **Theme Features**

- ✅ **Luxurious Palette**: Sparkling gold on dark marble brown-tinted black
- ✅ **Glassmorphism**: Blurred backgrounds with gold borders and glow
- ✅ **Circuit Animation**: Animated golden particles and connections
- ✅ **Smooth Animations**: Crickit flow easing curves
- ✅ **Fully Responsive**: Mobile-first design
- ✅ **Dark Mode Only**: Optimized for premium feel
- ✅ **Accessibility**: WCAG AA compliant

---

## 🚀 QUICK START

### Step 1: Import Theme Files

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Theme Styles -->
  <link rel="stylesheet" href="path/to/sfs-globals.css" />
  <link rel="stylesheet" href="path/to/sfs-complete-theme.css" />
</head>
<body>
  <!-- Circuit Background -->
  <canvas id="sfs-circuit"></canvas>

  <!-- Your Content Here -->
  <div class="container">
    <h1>Welcome to SFS</h1>
  </div>

  <!-- Circuit Animation -->
  <script src="path/to/sfs-circuit-flow.js"></script>
</body>
</html>
```

### Step 2: Use Theme Classes

```html
<!-- Glass Card -->
<div class="glass-card p-6">
  <h2>Beautiful Glass Card</h2>
  <p>With golden borders and subtle glow on hover</p>
</div>

<!-- Golden Button -->
<button class="btn-gold">
  Click Me
</button>

<!-- Outline Button -->
<button class="btn-outline-gold">
  Learn More
</button>

<!-- Badge -->
<span class="badge-gold">New</span>
```

---

## 🎨 COLOR PALETTE

### Primary Colors

```css
--sf-black: 0 0% 8%;           /* Deep marble black */
--sf-brown: 25 15% 12%;        /* Brown-tinted black */
--sf-gold: 45 95% 65%;         /* Sparkling gold ✨ */
--sf-gold-light: 45 95% 75%;   /* Lighter gold for hover */
--sf-gold-dark: 45 95% 55%;    /* Darker gold for active */
```

### Text Colors

```css
--foreground: 45 20% 95%;      /* Beige/white text */
--muted-foreground: 45 10% 65%; /* Muted beige */
```

### Usage

```html
<h1 class="text-gold">Golden Heading</h1>
<p class="text-beige">Beige paragraph</p>
<span class="text-muted">Muted text</span>
```

---

## 🔮 GLASSMORPHISM COMPONENTS

### Glass Cards

```html
<!-- Basic Glass Card -->
<div class="glass-card">
  <h3>Elegant Card</h3>
  <p>With backdrop blur and gold border</p>
</div>

<!-- Strong Glass Card -->
<div class="glass-card-strong">
  <h3>Premium Card</h3>
  <p>More opaque with stronger glow</p>
</div>

<!-- Glass Card with Golden Glow -->
<div class="glass-card golden-glow">
  <h3>Glowing Card</h3>
  <p>Hover for radial gold glow effect</p>
</div>
```

### Features

- **Backdrop blur**: 16px blur for glass effect
- **Gold borders**: Subtle gold outline (0.2 opacity)
- **Hover glow**: Glowing effect on interaction
- **Gradient overlay**: Subtle gold gradient on hover

---

## 🎮 BUTTONS

### Button Variants

```html
<!-- Primary Gold Button -->
<button class="btn-gold">
  Primary Action
</button>

<!-- Outline Button -->
<button class="btn-outline-gold">
  Secondary Action
</button>

<!-- With Icon -->
<button class="btn-gold">
  <svg>...</svg>
  Download
</button>
```

### Button States

- **Default**: Gold gradient background
- **Hover**: Lighter gold, lifts up 1px
- **Active**: Returns to default position
- **Disabled**: 50% opacity (add `disabled` attribute)

---

## 📝 FORM INPUTS

### Input Fields

```html
<!-- Text Input -->
<input type="text" class="input-gold" placeholder="Enter your name" />

<!-- Textarea -->
<textarea class="input-gold" placeholder="Your message"></textarea>

<!-- Select -->
<select class="input-gold">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Input States

- **Default**: Dark background, subtle border
- **Focus**: Gold border with glow ring
- **Error**: Red border (add `.input-error` class)

---

## 🏷️ BADGES

```html
<!-- Default Badge -->
<span class="badge-gold">New</span>

<!-- With Icon -->
<span class="badge-gold">
  ⭐ Premium
</span>

<!-- Status Badges -->
<span class="badge-gold">🔴 Live</span>
<span class="badge-gold">✅ Verified</span>
```

---

## ⚡ CIRCUIT-FLOW ANIMATION

### Configuration

```javascript
// Access the circuit flow instance
const circuit = window.SFSCircuitFlow;

// Customize settings
circuit.setConfig({
  particleCount: 100,        // More particles
  nodeCount: 40,             // More connection nodes
  particleSpeed: 0.5,        // Faster movement
  connectionDistance: 200,    // Longer connections
  mouseRadius: 250,          // Larger mouse interaction
});

// Pause animation
circuit.pause();

// Resume animation
circuit.resume();

// Destroy (cleanup)
circuit.destroy();
```

### Features

- **80 Golden Particles**: Flowing across the screen
- **30 Connection Nodes**: Pulsing golden nodes
- **Mouse Interaction**: Particles react to cursor
- **Auto-Pause**: Stops when tab is hidden (performance)
- **Responsive**: Adjusts to window resize

---

## 🎬 ANIMATIONS

### Built-in Animations

```html
<!-- Pulse Gold -->
<div class="pulse-gold">Pulsing glow effect</div>

<!-- Shimmer -->
<div class="shimmer-gold">Shimmer effect</div>

<!-- Float -->
<div class="float">Floating animation</div>
```

### Custom Animations

```css
/* Use easing variables */
.my-element {
  transition: all 300ms var(--ease-smooth);
}

/* Bounce effect */
.bounce-element {
  transition: transform 300ms var(--ease-bounce);
}

/* Elastic effect */
.elastic-element {
  transition: transform 300ms var(--ease-elastic);
}
```

---

## 📐 SPACING SYSTEM

### Spacing Tokens

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

### Usage with Tailwind-like Classes

```html
<div class="p-6">Padding 24px</div>
<div class="m-4">Margin 16px</div>
<div class="gap-md">Gap 16px</div>
```

---

## 🔤 TYPOGRAPHY

### Font Families

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'Georgia', serif;
--font-mono: 'JetBrains Mono', 'Menlo', monospace;
```

### Font Sizes

```html
<h1>Huge Heading (3rem / 48px)</h1>
<h2>Large Heading (2.25rem / 36px)</h2>
<h3>Medium Heading (1.875rem / 30px)</h3>
<h4>Small Heading (1.5rem / 24px)</h4>
<p class="text-lg">Large Text (1.125rem)</p>
<p>Normal Text (1rem)</p>
<small class="text-sm">Small Text (0.875rem)</small>
```

### Golden Gradient Headings

```html
<!-- H1 automatically gets gold gradient -->
<h1>This Heading Shimmers in Gold</h1>

<!-- Apply to any element -->
<h2 style="background: linear-gradient(135deg, hsl(var(--sf-gold)) 0%, hsl(var(--sf-gold-light)) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
  Custom Golden Text
</h2>
```

---

## 🎯 COMPLETE WIDGET EXAMPLE

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SFS Family Theme Demo</title>

  <!-- SFS Theme -->
  <link rel="stylesheet" href="path/to/sfs-globals.css" />
  <link rel="stylesheet" href="path/to/sfs-complete-theme.css" />
</head>
<body>
  <!-- Circuit Background -->
  <canvas id="sfs-circuit"></canvas>

  <!-- Main Content -->
  <div class="container" style="padding: 3rem 0; position: relative; z-index: 1;">
    <!-- Hero Section -->
    <div class="text-center" style="margin-bottom: 4rem;">
      <h1 class="float">Welcome to SFS</h1>
      <p class="text-lg text-muted">
        Luxurious design meets powerful functionality
      </p>
    </div>

    <!-- Feature Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
      <!-- Card 1 -->
      <div class="glass-card golden-glow" style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: hsl(var(--sf-gold) / 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <span style="font-size: 24px;">⚡</span>
        </div>
        <h3 style="margin-bottom: 0.5rem;">Lightning Fast</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">
          Built for speed with optimized performance
        </p>
        <button class="btn-outline-gold">
          Learn More →
        </button>
      </div>

      <!-- Card 2 -->
      <div class="glass-card golden-glow" style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: hsl(var(--sf-gold) / 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <span style="font-size: 24px;">🔒</span>
        </div>
        <h3 style="margin-bottom: 0.5rem;">Secure by Default</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">
          Bank-level security with encryption
        </p>
        <button class="btn-outline-gold">
          Learn More →
        </button>
      </div>

      <!-- Card 3 -->
      <div class="glass-card golden-glow" style="padding: 2rem;">
        <div style="width: 48px; height: 48px; background: hsl(var(--sf-gold) / 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <span style="font-size: 24px;">🎨</span>
        </div>
        <h3 style="margin-bottom: 0.5rem;">Beautiful Design</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">
          Stunning UI that users love
        </p>
        <button class="btn-outline-gold">
          Learn More →
        </button>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="glass-card-strong" style="margin-top: 4rem; padding: 3rem; text-center;">
      <h2 style="margin-bottom: 1rem;">Ready to Get Started?</h2>
      <p class="text-lg text-muted" style="margin-bottom: 2rem;">
        Join thousands of users who love SFS
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn-gold" style="padding: 1rem 2rem;">
          Start Free Trial
        </button>
        <button class="btn-outline-gold" style="padding: 1rem 2rem;">
          View Demo
        </button>
      </div>
    </div>
  </div>

  <!-- Circuit Animation -->
  <script src="path/to/sfs-circuit-flow.js"></script>
</body>
</html>
```

---

## 🎨 CUSTOMIZATION

### Change Gold Color

```css
:root {
  /* Make it more yellow */
  --sf-gold: 50 95% 65%;

  /* Make it more orange */
  --sf-gold: 40 95% 65%;

  /* Make it rose gold */
  --sf-gold: 15 75% 65%;
}
```

### Adjust Circuit Animation

```javascript
window.SFSCircuitFlow.setConfig({
  colors: {
    particle: 'rgba(255, 100, 100, 0.8)',      // Red particles
    particleGlow: 'rgba(255, 100, 100, 0.4)',
    line: 'rgba(255, 100, 100, 0.2)',
    node: 'rgba(255, 100, 100, 0.6)',
  },
});
```

### Custom Glass Effect

```css
.my-glass-card {
  background: hsl(var(--glass-bg));
  backdrop-filter: blur(20px);  /* More blur */
  border: 2px solid hsl(var(--sf-gold) / 0.5);  /* Thicker gold border */
  box-shadow: var(--shadow-gold-strong);  /* Stronger glow */
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First */
.container {
  padding: var(--spacing-sm);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-lg);
  }
}
```

---

## ⚡ PERFORMANCE TIPS

### 1. Lazy Load Circuit Animation

```html
<!-- Only load on desktop -->
<script>
  if (window.innerWidth > 768) {
    const script = document.createElement('script');
    script.src = 'path/to/sfs-circuit-flow.js';
    document.body.appendChild(script);
  }
</script>
```

### 2. Reduce Particle Count on Mobile

```javascript
window.SFSCircuitFlow.setConfig({
  particleCount: window.innerWidth > 768 ? 80 : 40,
  nodeCount: window.innerWidth > 768 ? 30 : 15,
});
```

### 3. Pause When Not Visible

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    window.SFSCircuitFlow.pause();
  } else {
    window.SFSCircuitFlow.resume();
  }
});
```

---

## 🎯 BEST PRACTICES

### ✅ DO

- Use glass cards for important content
- Apply golden-glow to interactive elements
- Use btn-gold for primary actions
- Keep circuit animation subtle
- Test on mobile devices

### ❌ DON'T

- Overuse gold color (use sparingly for accent)
- Add too many particles (impacts performance)
- Use on light backgrounds (theme is dark-only)
- Forget accessibility (maintain contrast)
- Skip the circuit canvas element

---

## 🚀 INTEGRATION WITH SFS WIDGETS

All SFS widgets automatically use the Family Theme when imported:

```html
<!-- Widget automatically inherits theme -->
<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="your-id"
  data-widgets='[{
    "type": "chat",
    "enabled": true
  }]'>
</script>

<!-- Widgets will have: -->
<!-- ✓ Gold buttons and accents -->
<!-- ✓ Glass card styling -->
<!-- ✓ Dark marble background -->
<!-- ✓ Smooth animations -->
```

---

## 🎨 THEME COMPARISON

| Feature | SFS Family | Default | Impact |
|---------|------------|---------|--------|
| Primary Color | Gold | Blue | Premium feel |
| Background | Dark Marble | White/Dark | Luxurious |
| Effects | Glassmorphism | Flat | Modern |
| Animation | Circuit Flow | None | Engaging |
| Typography | Inter | System | Professional |
| Borders | Gold Glow | Standard | Elegant |

---

## 💎 PREMIUM FEATURES

### ✨ What Makes SFS Family Theme Special

1. **Circuit Animation** - Unique animated background
2. **Glassmorphism** - Modern blur effects with gold accents
3. **Golden Gradients** - Shimmering headings
4. **Hover Effects** - Smooth glow and lift animations
5. **Dark Luxury** - Premium dark aesthetic
6. **Performance** - Optimized for speed
7. **Accessibility** - WCAG AA compliant

---

## 📚 RESOURCES

- **Full Documentation**: `/docs/theme`
- **Examples**: `/examples/theme`
- **Config File**: `sfs-theme-config.json`
- **Support**: support@sfs.dev
- **Discord**: https://discord.gg/sfs

---

## 🎉 YOU'RE READY!

You now have everything you need to create stunning, luxurious interfaces with the SFS Family Theme!

**Quick Checklist:**
- ✅ Import theme CSS files
- ✅ Add circuit canvas element
- ✅ Include circuit-flow.js
- ✅ Use glass-card and btn-gold classes
- ✅ Test on multiple devices
- ✅ Enjoy the beauty! ✨

---

**Built with ❤️ by the SFS team**

*Making the web more beautiful, one widget at a time.*
