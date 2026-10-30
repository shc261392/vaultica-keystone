# DevOps Configuration

## Pinned Versions

| Package | Pinned Version | Reason | Issue Link |
|---------|----------------|--------|------------|
| pnpm | 10.29.3 | Stability | — |
| katex (override, `package.json` `pnpm.overrides`) | >=0.18.2 | Fixes a low advisory in the same tree; `pnpm audit` exits non-zero on any finding | — |
| re2js (override, `package.json` `pnpm.overrides`) | >=2.8.7 | Fixes a high advisory in `markdownlint-cli2`'s dependency tree; keeps `pnpm audit` clean | — |

## CI/CD

None. `.github/workflows/ci.yml` is a manual no-op. The gate is `pnpm verify`, run locally; see
`docs/guide/testing-and-deployment.md`.

## Tool Versions

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.13.1 | Via Volta |
| Biome | latest | System binary |
| Markdownlint | cli2 ^0.24.0 | Markdown linting |
| @resvg/resvg-js | 2.6.2 | Renders the social kit PNGs (`pnpm build:social`) and the Vaultica logo, icon and Stripe PNGs (`pnpm build:logo`) |

## Git Hooks

Husky (`prepare` runs `husky`) installs `.husky/pre-commit`, which runs `lint-staged` and then
`node scripts/truth.mjs check --staged`. The second step blocks a commit that stages a source
change without the matching `docs/truth/truth.lock.json` update. Agent hooks for the same check
live in `.claude/settings.json` and `.opencode/plugins/truth.ts`.

There is no `commit-msg` hook (removed upstream in af610a2 and b58c351). Conventional Commits are by
convention; `commitlint.config.ts` stays available via `pnpm exec commitlint`.
