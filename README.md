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

- **Product**: BlinkVault. Tagline: "Dump anything. Ask anything. See the source." (source:
  `vaultica-web/src/lib/brand.ts`)
- **Design**: "Quiet instrument" - calm and tool-like. Sparse 1px borders, no glow or neon,
  shadows only on overlays, an 8px radius family.
- **Type**: Geist and Geist Mono.
- **Themes**: dark **blink** (surface `#0E1013`, accent `#3CC8D0`) and light **paper**
  (accent `#0A7C86`). Users choose System, Blink or Paper.
- **Focus**: a text field owns its focus ring - accent border plus a 3px halo
  (`--color-vault-accent-ring`).
- **Patterns**: see [`ai/component-patterns.md`](ai/component-patterns.md).
- **Social kit**: [`assets/social/`](assets/social/README.md) (avatar, X header, Reddit banner and
  icon, link card), rebuilt with `pnpm build:social`.
