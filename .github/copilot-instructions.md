# GitHub Copilot — project instructions

> This file is a **pointer**. The canonical, tool-agnostic agent rules for this
> repository live in [`/AGENTS.md`](../AGENTS.md). Read and follow `AGENTS.md`.

Summary: change styles only in `tokens/` then `pnpm build`; OKLCH + CSS variables, never
hardcoded hex; WCAG AA; Biome (system binary) for code quality; the local gate `pnpm verify`
(no CI/CD) must pass, which covers `pnpm lint`, `pnpm typecheck`, `pnpm check:truth` and
`pnpm build`; Conventional Commits; never push without approval.
