# Vaultica Keystone

Single Source of Truth for the **Blink Vault** brand. Design tokens, AI context, and assets.

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
git submodule add [URL] vaultica-brand
```

Import the CSS:

```css
@import "vaultica-brand/dist/theme.css";
```

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
