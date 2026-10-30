# Vaultica Keystone

Single Source of Truth for the **BlinkVault** brand. Design tokens, AI context, and assets.

## Brand Architecture

| Entity          | Role                                      | Example                        |
| --------------- | ----------------------------------------- | ------------------------------ |
| **Vaultica**    | The company/team name                    | "© 2026 Vaultica"                |
| **BlinkVault** | The product name (official, legal, SEO)  | "Welcome to BlinkVault"         |
| **Blink**       | Brand shorthand in the product promise   | "AI-ready in a Blink"            |

## Quick Start

```bash
mise install        # Install Node 24
pnpm install        # Install dependencies
pnpm run build      # Build tokens
pnpm run preview    # Preview brand assets
```

## Structure

```text
tokens/         Design tokens (colors, typography, spacing)
ai/             AI context files for consistent generation
assets/logos/   Brand logos (SVG)
dist/           Generated CSS and JS
preview/        Next.js preview app
scripts/        Build and validation scripts (truth.mjs checks docs/truth)
tools/truth/    Canonical truth-docs tooling, synced to the other repos
```

## Usage

### In a Project

Add as a Git submodule:

```bash
git submodule add [URL] vaultica-keystone
```

Import the CSS:

```css
@import "vaultica-keystone/dist/theme.css";
```

**See [Integration Guide](docs/INTEGRATION-GUIDE.md)** for complete setup instructions including:

- Next.js 16 + Tailwind CSS integration
- Logo and asset usage
- Favicon and app icons
- Gatekeeping for token version control

### For AI Assistants

Point Copilot/Cursor to `ai/brand-context.md` for styling context.

## Commands

| Command             | Description              |
| ------------------- | ------------------------ |
| `pnpm run build`    | Build tokens to dist/    |
| `pnpm run validate` | Validate token structure |
| `pnpm run preview`  | Start preview app        |
| `pnpm run verify`   | Run all checks (no CI)   |

Testing and release steps: [Testing and Deployment](docs/guide/testing-and-deployment.md).

## Brand Summary

- **Product**: BlinkVault — "AI-ready in a Blink. One vault for everything your AI needs."
- **Aesthetic**: Industrial Elegance (heavy borders, high contrast, professional 2026 design)
- **Color**: Brand blue `#27abec`
- **Theme**: Dark-only
