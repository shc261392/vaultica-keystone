# AI Agents Guide

> Quality checks and workflows for AI assistants working with Vaultica Keystone.

## Before Pushing

```bash
pnpm run quality        # Lint + format check
pnpm run build          # Build tokens
pnpm run preview:build  # Test preview app builds
```

## Quality Tools

| Tool         | Command                         | Purpose          |
| ------------ | ------------------------------- | ---------------- |
| ESLint       | `pnpm run lint:js`              | JS/TS linting    |
| Prettier     | `pnpm run format`               | Code formatting  |
| markdownlint | `pnpm run lint:md`              | Markdown linting |
| TypeScript   | `cd preview && pnpm type-check` | Type checking    |

## Commit Format

```text
type(scope): message

Examples:
feat(tokens): Add new color
fix(preview): Fix build error
docs: Update README
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore` Scopes: `tokens`, `preview`, `scripts`,
`docs`, `ci`

## Auto-Fix

```bash
pnpm run quality:fix    # Fix root files
cd preview && pnpm run quality:fix  # Fix preview app
```

## Key Rules

- Use `pnpm`, not npm or yarn
- All style changes go in `tokens/`, then run `pnpm run build`
- Use CSS variables from tokens, never hardcode colors
- Ensure WCAG AA contrast (4.5:1 minimum)
