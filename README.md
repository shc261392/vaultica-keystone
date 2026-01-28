# Vaultica Keystone

Single Source of Truth for the **Blink Vault** brand. Design tokens, AI context, and assets.

## Brand Architecture

| Entity          | Role                                      | Example                        |
| --------------- | ----------------------------------------- | ------------------------------ |
| **Vaultica**    | The company/team name                     | "© 2026 Vaultica"              |
| **Blink Vault** | The product name (official, legal, SEO)   | "Welcome to Blink Vault"       |
| **Blink**       | The action keyword, command, abbreviation | "Blink it", `/blink`, `@blink` |

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
scripts/        Build and validation scripts
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
| `pnpm run quality`  | Run all quality checks   |

## Brand Summary

- **Product**: Blink Vault — "See it. Blink it. Find it."
- **Aesthetic**: Industrial Elegance (heavy borders, high contrast)
- **Color**: Brand blue `#27abec`
- **Theme**: Dark-only
