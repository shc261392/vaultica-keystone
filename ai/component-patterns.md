# 🧩 Blink Component Patterns

> **For AI/LLM Context**: Reference this document when generating UI components for Blink. These patterns ensure visual consistency with the Industrial Elegance aesthetic.

---

## Design Principles Recap

1. **Heavy Borders** — 2-4px, visible containment
2. **High Contrast** — Dark surfaces, bright text/accents
3. **Visual Weight** — Substantial, grounded elements
4. **Precision** — Clean geometry, purposeful spacing

---

## Core Components

### Button

#### Primary Button

```
Background: var(--vault-accent-default)
Text: var(--color-neutral-0) [white]
Border: none
Border-radius: 8px (effects.border.radius.md)
Padding: 12px 24px
Font-weight: 600 (semibold)
Letter-spacing: 0.02em

:hover — Background lightens (accent-hover)
:active — Background darkens (accent-active)
:focus — 2px ring with offset
```

#### Secondary Button

```
Background: transparent
Text: var(--vault-text-primary)
Border: 2px solid var(--vault-border-strong)
Border-radius: 8px

:hover — Background: neutral-800
:focus — Border color changes to accent
```

#### Ghost Button

```
Background: transparent
Border: none
Text: var(--vault-text-secondary)

:hover — Background: neutral-800
```

---

### Card

```
Background: var(--vault-surface-secondary)
Border: 2px solid var(--vault-border-strong)  /* Heavy brutalist border */
Border-radius: 12px (effects.border.radius.lg)
Padding: 24px
Shadow: effects.shadow.sm (minimal — borders do the work)

/* Card with media */
Overflow: hidden (for image cropping)
```

#### Card Variations

| Variant | Border | Background |
|---------|--------|------------|
| Default | 2px neutral-500 | neutral-900 |
| Selected | 2px accent-500 | neutral-900 |
| Hoverable | 2px neutral-500 → accent-400 on hover | neutral-900 |
| Elevated | 3px neutral-500 | neutral-800 |

---

### Input

```
Background: var(--vault-surface-secondary)
Border: 2px solid var(--vault-border-default)
Border-radius: 8px
Padding: 12px 16px
Height: 48px (sizing.input.height-lg)
Color: var(--vault-text-primary)

::placeholder — var(--vault-text-tertiary)

:focus {
  Border-color: var(--vault-accent-default)
  Box-shadow: effects.shadow.glow-accent (optional)
}

:invalid / :error {
  Border-color: var(--color-critical-500)
}
```

---

### Search Input (Hero Element)

The search bar is Vaultica's primary interaction point.

```
Height: 56-64px
Border: 3px solid var(--vault-border-strong)
Border-radius: 12px
Font-size: 18px (typography.fontSize.lg)
Icon: Search icon, 24px, left-aligned

/* Prominent focus state */
:focus {
  Border-color: var(--vault-accent-default)
  Box-shadow: 0 0 0 4px var(--vault-accent-subtle)
}
```

---

### Badge / Tag

```
Padding: 4px 12px
Border-radius: 6px
Font-size: 12px (typography.fontSize.xs)
Font-weight: 500 (medium)
Letter-spacing: 0.04em

/* Variants */
Default: bg neutral-700, text neutral-100
Accent: bg accent-900, text accent-200
Success: bg success-900, text success-100
Warning: bg warning-900, text warning-100
Critical: bg critical-900, text critical-100
```

---

### Toast / Notification

```
Background: var(--vault-surface-tertiary)
Border: 2px solid var(--vault-border-default)
Border-radius: 12px
Padding: 16px 20px
Shadow: effects.shadow.lg
Max-width: 400px

/* Icon on left, dismiss on right */
Display: flex
Align-items: center
Gap: 16px

/* Variants follow badge pattern for color */
```

---

### Modal / Dialog

```
Background: var(--vault-surface-secondary)
Border: 3px solid var(--vault-border-strong)  /* Heavy */
Border-radius: 16px (effects.border.radius.xl)
Padding: 32px
Shadow: effects.shadow.xl
Max-width: 480px (typical)

/* Backdrop */
Background: oklch(0% 0 0 / 0.6)
Backdrop-filter: blur(4px)
```

---

### Navigation Item

```
Padding: 12px 16px
Border-radius: 8px
Font-weight: 500

/* States */
Default: transparent bg, secondary text
Hover: neutral-800 bg, primary text
Active: accent-900 bg, accent-200 text
Current: accent-900 bg, accent-200 text, 3px left border accent
```

---

### Blink Card

For displaying saved Blinks in the Visual Gallery:

```
/* Thumbnail area */
Aspect-ratio: 1/1 or 4/3 (visual-first)
Object-fit: cover
Border-radius: 8px (internal)

/* NO metadata labels by default (Visual Gallery) */
/* On hover or detail view: */
Date: 12px, secondary text, subtle

/* Container */
Background: neutral-900
Border: 2px solid neutral-700
Border-radius: 12px
Padding: 0 (edge-to-edge imagery)

:hover — Border color neutral-500
```

---

### Blink Zone (Save Area)

```
/* Default */
Background: neutral-900
Border: 2px dashed neutral-600
Border-radius: 16px
Padding: 48px
Text-align: center
Label: "Blink it" or "Drop to Blink"

/* Hover / Drag-over */
Border-color: primary-400 (brand blue)
Border-style: solid
Background: primary-900 (subtle)

/* Icon */
Size: 48px
Color: neutral-400 → primary-400 on drag

/* Success feedback */
Show: "Blinked to your Vault. ⚡" toast
```

---

## Layout Patterns

### App Shell

```
Display: grid
Grid-template-columns: 240px 1fr (sidebar + main)
Grid-template-rows: 64px 1fr (header + content)

/* Or for mobile-first */
Flex with collapsible sidebar
```

### Content Grid (Visual Gallery)

The Visual Gallery is Blink's signature view — clean, edge-to-edge, label-free:

```
Display: grid
Grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
Gap: 8px (spacing.2) — tight for visual density

/* NO text labels or tags in grid view */
/* Metadata appears on hover/selection only */
```

### Stack Layout

```
Display: flex
Flex-direction: column
Gap: 16px (spacing.4) — standard
Gap: 8px (spacing.2) — compact
Gap: 24px (spacing.6) — spacious
```

---

## Iconography Guidelines

- **Style**: Outlined, 2px stroke weight
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Color**: Inherits from text color
- **Grid**: 24x24 canvas with 2px padding

### Key Icons

| Function | Icon Reference |
|----------|----------------|
| Blink Vault/Home | Shield or Safe |
| Blink it (save) | Lightning bolt or blink eye |
| Search | Magnifying glass |
| Settings | Gear |
| Share | Arrow from box |
| Delete | Trash |
| Copy Link | Chain links |
| Expire/Timer | Clock |
| Lock | Padlock |
| Success | Checkmark |
| Error | X or Triangle alert |

---

## Animation Guidelines

### Transitions

- Duration: 200ms (effects.motion.duration.normal)
- Easing: ease-in-out

### Micro-interactions

- Button press: Scale 0.98 on active
- Card hover: Subtle border color shift
- Focus: Smooth ring expansion

### Loading States

- Skeleton: Pulse animation on neutral-800 → neutral-700
- Spinner: Circular, accent color, smooth rotation

---

## Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Focus visible on all interactive elements
- [ ] Touch targets ≥ 44x44px
- [ ] Reduced motion respects `prefers-reduced-motion`
- [ ] All icons have aria-labels or are decorative
- [ ] Form inputs have associated labels

---

*Use these patterns as the baseline. Remember: technology is invisible, speed is paramount, visuals come first.*
