# 📁 Vaultica Logo Assets

## Files in this directory

| File                      | Description                        | Format |
| ------------------------- | ---------------------------------- | ------ |
| `vaultica-logo.svg`       | Primary full-color logo            | SVG    |
| `vaultica-logo-white.svg` | White version for dark backgrounds | SVG    |
| `vaultica-white-icon.svg` | Icon-only mark (white)             | SVG    |
| `favicon.ico`             | Browser favicon                    | ICO    |

## Brand Colors

The logo uses three official brand colors:

| Name      | OKLCH                         | HEX       | Usage                       |
| --------- | ----------------------------- | --------- | --------------------------- |
| **Black** | `oklch(0.3503 0.014 256.77)`  | `#363b42` | Text, dark elements         |
| **White** | `oklch(0.994 0.0084 197.02)`  | `#f0fbff` | Light elements, backgrounds |
| **Blue**  | `oklch(0.7031 0.1426 236.68)` | `#27abec` | Primary brand color         |

## Bootstrap Theme Compatibility

```scss
$theme-colors: (
  "light": #d7e9f2,
  "dark": #363b42,
  "primary": #27abec,
  "secondary": #1b67a1,
  "info": #f0d15e,
  "success": #13c16a,
  "warning": #eed210,
  "danger": #fe1b20,
);
```

## Usage Guidelines

### Minimum Sizes

| Asset     | Minimum Width | Minimum Height |
| --------- | ------------- | -------------- |
| Full Logo | 120px         | 28px           |
| Icon Only | 16px          | 16px           |
| Favicon   | 16px          | 16px           |

### Clear Space

Maintain clear space equal to the height of the "V" icon on all sides.

### Background Rules

- **vaultica-logo.svg** — Use on light backgrounds
- **vaultica-logo-white.svg** — Use on dark backgrounds
- **vaultica-white-icon.svg** — Use on dark or colored backgrounds

### Don'ts

- ❌ Don't rotate the logo
- ❌ Don't apply additional effects or shadows
- ❌ Don't stretch or distort
- ❌ Don't use colors outside the brand palette
- ❌ Don't place on busy/low-contrast backgrounds
