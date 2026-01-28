# 📁 Blink Vault Logo Assets

> Logo and icon assets for **Blink Vault** by **Vaultica**

## Brand Architecture

| Entity          | Role                                      | Usage Example                  |
| --------------- | ----------------------------------------- | ------------------------------ |
| **Vaultica**    | The company/team name                     | "© 2026 Vaultica"              |
| **Blink Vault** | The product name (official, legal, SEO)   | "Welcome to Blink Vault"       |
| **Blink**       | The action keyword, command, abbreviation | "Blink it", `/blink`, `@blink` |

## Files in this directory

### Blink Icon (Primary Mark)

| File             | Description                     | Format |
| ---------------- | ------------------------------- | ------ |
| `blink-icon.svg` | Icon symbol (512×512, centered) | SVG    |
| `favicon.ico`    | Browser favicon (from icon)     | ICO    |

### Blink (Short Name / Action)

| File                             | Description                      | Format |
| -------------------------------- | -------------------------------- | ------ |
| `blink-logo-text.svg`            | "Blink" text only (transparent)  | SVG    |
| `blink-logo-dark.svg`            | "Blink" for dark backgrounds     | SVG    |
| `blink-logo-clean.svg`           | Full traced logo (transparent)   | SVG    |
| `blink-with-icon-horizontal.svg` | Icon + "Blink" horizontal lockup | SVG    |

### Blink Vault (Full Product Name)

| File                                   | Description                            | Format |
| -------------------------------------- | -------------------------------------- | ------ |
| `blink-vault-logo-text.svg`            | "Blink Vault" text (transparent)       | SVG    |
| `blink-vault-logo-dark.svg`            | "Blink Vault" for dark backgrounds     | SVG    |
| `blink-vault-logo-light.svg`           | "Blink Vault" for light backgrounds    | SVG    |
| `blink-vault-with-icon-horizontal.svg` | Icon + "Blink Vault" horizontal lockup | SVG    |

### Legacy (Vaultica Company)

| File                      | Description                 | Format |
| ------------------------- | --------------------------- | ------ |
| `vaultica-logo.svg`       | Vaultica wordmark (color)   | SVG    |
| `vaultica-logo-white.svg` | Vaultica wordmark (white)   | SVG    |
| `vaultica-white-icon.svg` | Vaultica icon mark (legacy) | SVG    |

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

### Which Logo to Use

| Context                     | Recommended File                       |
| --------------------------- | -------------------------------------- |
| App icon / favicon          | `blink-icon.svg`, `favicon.ico`        |
| Dark UI header              | `blink-vault-logo-dark.svg`            |
| Light UI header             | `blink-vault-logo-light.svg`           |
| Horizontal lockup (dark bg) | `blink-vault-with-icon-horizontal.svg` |
| Command/action branding     | `blink-logo-dark.svg`                  |
| Footer copyright            | Text: "© 2026 Vaultica"                |

### Clear Space

Maintain clear space equal to the height of the Blink icon on all sides.

### Don'ts

- ❌ Don't rotate the logo
- ❌ Don't apply additional effects or shadows
- ❌ Don't stretch or distort
- ❌ Don't use colors outside the brand palette
- ❌ Don't place on busy/low-contrast backgrounds
