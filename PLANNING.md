# Vaultica Keystone - Status

> Single Source of Truth for Blink Vault brand assets

## What's Done

| Directory  | Purpose                                     | Status |
| ---------- | ------------------------------------------- | ------ |
| `tokens/`  | Design tokens (colors, typography, spacing) | ✅     |
| `ai/`      | AI context files for consistent generation  | ✅     |
| `assets/`  | Logo and brand assets                       | ✅     |
| `scripts/` | Build and validation tools                  | ✅     |
| `dist/`    | Generated CSS/JS outputs                    | ✅     |
| `preview/` | Next.js preview app                         | ✅     |
| `.github/` | CI workflows                                | ✅     |

## Quick Reference

```bash
pnpm install        # Install dependencies
pnpm run build      # Build tokens → dist/
pnpm run validate   # Validate tokens
pnpm run preview    # Start preview app
```

## Brand Decisions

- **Color**: OKLCH-based, brand blue `#27abec`
- **Typography**: Inter + JetBrains Mono
- **Aesthetic**: Industrial Elegance (heavy borders, high contrast)
- **Theme**: Dark-only

---

Last updated: 2026-01-27
