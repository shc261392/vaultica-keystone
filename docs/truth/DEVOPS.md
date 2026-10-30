# DevOps Configuration

## Pinned Versions

| Package | Pinned Version | Reason | Issue Link |
|---------|----------------|--------|------------|
| pnpm | 10.29.3 | Stability | — |

## CI/CD

None. `.github/workflows/ci.yml` is a manual no-op. The gate is `pnpm verify`, run locally; see
`docs/guide/testing-and-deployment.md`.

## Tool Versions

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.13.1 | Via Volta |
| Biome | latest | System binary |
| Markdownlint | cli2 ^0.21.0 | Markdown linting |

## Git Hooks

Husky (`prepare` runs `husky`) installs `.husky/pre-commit`, which runs `lint-staged` and then
`node scripts/truth.mjs check --staged`. The second step blocks a commit that stages a source
change without the matching `docs/truth/truth.lock.json` update. Agent hooks for the same check
live in `.claude/settings.json` and `.opencode/plugins/truth.ts`.

There is no `commit-msg` hook (removed upstream in af610a2 and b58c351). Conventional Commits are by
convention; `commitlint.config.ts` stays available via `pnpm exec commitlint`.
