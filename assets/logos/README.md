# BlinkVault Logo Assets

> Logo and icon assets for **BlinkVault** by **Vaultica**. Mirrored in
> `vaultica-web/public/logos/` — keep both in sync.

## Brand Architecture

| Entity         | Role                                     | Usage Example                                   |
| -------------- | ---------------------------------------- | ----------------------------------------------- |
| **Vaultica**   | The company / legal entity               | "© 2026 Vaultica"                               |
| **BlinkVault** | The product name (one word, camel-case)  | "Welcome to BlinkVault"                         |
| Tagline        | Product promise                          | "Dump anything. Ask anything. See the source."  |

Never write the name as two words ("Blink Vault"). The assistant is referred to as BlinkVault.

## The mark — "the slot"

A rounded-square tile with a lens-shaped cut-out: an eye mid-blink, and a drop
slot you throw things into. One geometric primitive; legible at 16px.

```svg
<!-- 32×32 grid -->
<rect x="2" y="2" width="28" height="28" rx="8" fill="#0A7C86"/>
<path d="M8 16 Q16 10.5 24 16 Q16 21.5 8 16Z" fill="#FFFFFF"/>
<circle cx="16" cy="16" r="2" fill="#0A7C86"/>
```

| Variant  | Tile      | Lens      | Pupil     |
| -------- | --------- | --------- | --------- |
| Light UI | `#0A7C86` | `#FFFFFF` | `#0A7C86` |
| Dark UI  | `#3CC8D0` | `#0E1013` | `#3CC8D0` |
| Mono     | `currentColor`, lens cut out with `fill-rule="evenodd"` | | |

Motion: the lens may close and reopen (140ms) on hover only. No looping pulse.

## Files

| File                    | Description                                    | Format |
| ----------------------- | ---------------------------------------------- | ------ |
| `mark.svg`              | Mark, light-UI colors                          | SVG    |
| `mark-mono.svg`         | Single-color mark (`currentColor`)             | SVG    |
| `wordmark-light.svg`    | Mark + "BlinkVault" for light backgrounds      | SVG    |
| `wordmark-dark.svg`     | Mark + "BlinkVault" for dark backgrounds       | SVG    |
| `favicon.svg`           | Favicon (lens enlarged for 16px)               | SVG    |
| `favicon.ico`           | Multi-size favicon                             | ICO    |
| `icon-32.png`           | 32px icon                                      | PNG    |
| `apple-touch-icon.png`  | 180px iOS icon                                 | PNG    |
| `icon-192.png`          | 192px PWA icon                                 | PNG    |
| `icon-512.png`          | 512px PWA icon                                 | PNG    |
| `icon-maskable-512.png` | 512px maskable PWA icon (20% safe zone)        | PNG    |

### Legacy (Vaultica company marks)

| File                      | Description                 | Format |
| ------------------------- | --------------------------- | ------ |
| `vaultica-logo.svg`       | Vaultica wordmark (color)   | SVG    |
| `vaultica-logo-white.svg` | Vaultica wordmark (white)   | SVG    |
| `vaultica-white-icon.svg` | Vaultica icon mark (legacy) | SVG    |

## Wordmark

"BlinkVault" in Geist SemiBold (600), tracking −0.02em, one color
(`text-primary`). The camel-case separates the halves; no two-tone treatment.
Lockup: mark height = 1.5× cap height, gap = 0.4× mark width.

The current wordmark SVGs use a system font stack with no `@import` (webfonts
don't load inside `<img>`). Follow-up: convert the text to outlines.

## Brand Colors

Single source of truth is `tokens/vault-theme.json` (calm tool-like palette, v2).

| Token                  | Light     | Dark      |
| ---------------------- | --------- | --------- |
| Accent                 | `#0A7C86` | `#3CC8D0` |
| Surface (app bg)       | `#FAFAFB` | `#0E1013` |
| Text primary           | `#141619` | `#ECEDF0` |
| Success                | `#1F8A4C` | `#3FB871` |
| Warning                | `#A65A06` | `#E5A13A` |
| Critical               | `#C93A3A` | `#F06A6A` |

## Usage Guidelines

### Minimum Sizes

| Asset     | Minimum Width | Minimum Height |
| --------- | ------------- | -------------- |
| Wordmark  | 120px         | 24px           |
| Mark      | 16px          | 16px           |

### Which Logo to Use

| Context            | Recommended File                       |
| ------------------ | -------------------------------------- |
| App icon / favicon | `favicon.svg`, `favicon.ico`, PNG set  |
| Light UI header    | `wordmark-light.svg`                   |
| Dark UI header     | `wordmark-dark.svg`                    |
| Inline / monochrome| `mark-mono.svg`                        |
| Footer copyright   | Text: "© 2026 Vaultica"                |

### Clear Space

Keep clear space equal to half the mark's width on all sides.

### Don'ts

- Don't rotate, stretch, or recolor the mark outside the palette above
- Don't add glows, gradients, or drop shadows
- Don't write the name as two words
- Don't place on busy or low-contrast backgrounds
