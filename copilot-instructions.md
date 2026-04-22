# Project Context

Vaultica Keystone - Design system and single source of truth (SSoT) for brand
tokens, AI context, and design assets.

## Tech Stack

- **Framework:** TypeScript, Node.js utilities
- **Language:** TypeScript 5.x (strict mode)
- **Build:** Node.js scripts, Token generation
- **Biome:** System binary (NOT npm, installed via brew/script)

## Development Tools

- **Node.js:** 24.13.1 (via Volta)
- **Package Manager:** pnpm 10.29.3
- **Linting/Formatting:** Biome (system binary, NOT npm package)
- **Markdown Linting:** markdownlint-cli2

## Key Rules

- All style changes in `tokens/`, then run `pnpm run build`
- Use OKLCH for colors, functional names (`vault-surface`, `vault-accent`)
- Use CSS variables, never hardcode hex values
- Ensure WCAG AA contrast (4.5:1)
- Use `pnpm`, not npm
- Biome configs in `biome.jsonc`, not separate eslint/prettier files

## Tool Preferences

- **Prefer VS Code Task Runner** for checks, builds, tests
- **Use Biome** for all code quality (linting/formatting)
- **Update truth docs** when infrastructure changes

## Commit Convention

Use Conventional Commits:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `chore:` maintenance
- `refactor:` code restructuring

**Never** run `git push` without explicit user approval.

## Documentation

Structure in `/docs`:

| Folder | Purpose |
|--------|---------|
| `truth/` | Source of truth (MUST sync with code) |
| `plans/` | Approved plans (immutable) |
| `progress/` | Implementation tracking |
| `guide/` | How-to guides |
| `backlog/` | Future proposals |

**Truth docs require `## Sources` section.** Run `pnpm check:truth` to verify.

## Brand

- **Product**: Blink Vault
- **Aesthetic**: Industrial Elegance (heavy borders, high contrast)
- **Voice**: Calm, clear, intentional — "AI-ready in a Blink. One vault for everything your AI needs."
- **Avoid**: Playful language, tech jargon, bulk-dump messaging, weak borders, vibe-app aesthetics

## Terminology

- **Vault** = user's centralized repository
- **AI-ready** = core product promise
- **Sync / Send / Drop** = the three ingestion models

See `ai/brand-context.md` for full context.
