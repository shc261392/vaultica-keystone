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

## The mark — "Stacked B"

A rounded-square tile with a solid B built from two stacked blocks: the
product's initial, and saved items piling up in the vault. One path; legible at 16px.
Replaced the earlier lens/eye mark ("the slot") on 2026-10-12.

```svg
<!-- 32×32 grid -->
<rect x="2" y="2" width="28" height="28" rx="8" fill="#0A7C86"/>
<path d="M10.5 7H17A4 4 0 0 1 17 15H13.5V17H19A4 4 0 0 1 19 25H10.5A1.5 1.5 0 0 1 9 23.5V8.5A1.5 1.5 0 0 1 10.5 7Z" fill="#FFFFFF"/>
```

| Variant  | Tile      | B         |
| -------- | --------- | --------- |
| Light UI | `#0A7C86` | `#FFFFFF` |
| Dark UI  | `#3CC8D0` | `#0E1013` |
| Mono     | `currentColor`, B cut out with `fill-rule="evenodd"` | |

Motion: none. No looping pulse.

## Files

| File                    | Description                                    | Format |
| ----------------------- | ---------------------------------------------- | ------ |
| `mark.svg`              | Mark, light-UI colors                          | SVG    |
| `mark-mono.svg`         | Single-color mark (`currentColor`)             | SVG    |
| `wordmark-light.svg`    | Mark + "BlinkVault" for light backgrounds      | SVG    |
| `wordmark-dark.svg`     | Mark + "BlinkVault" for dark backgrounds       | SVG    |
| `favicon.svg`           | Favicon               | SVG    |
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
