# Vaultica Keystone Instructions

Design system for **Blink Vault**. Uses mise (Node 24) and pnpm.

## Commands

```bash
pnpm install && pnpm run build
```

## Rules

- All style changes in `tokens/`, then run `pnpm run build`
- Use OKLCH for colors, functional names (`vault-surface`, `vault-accent`)
- Use CSS variables, never hardcode hex values
- Ensure WCAG AA contrast (4.5:1)
- Use `pnpm`, not npm

## Brand

- **Product**: Blink Vault
- **Aesthetic**: Industrial Elegance (heavy borders, high contrast)
- **Voice**: Swift, minimal, solid — "Blinked to your Vault. ⚡"
- **Avoid**: Playful language, tech jargon, weak borders

## Terminology

- **Blink** = saved item
- **Vault** = user's collection
- **Blink it** = save action

See `ai/brand-context.md` for full context.
