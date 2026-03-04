# DevOps Configuration

## Pinned Versions

| Package | Pinned Version | Reason | Issue Link |
|---------|----------------|--------|------------|
| pnpm | 10.29.3 | Stability | — |

## GitHub Actions Versions

| Action | Version | Notes |
|--------|---------|-------|
| actions/checkout | v6 | Latest stable |
| actions/setup-node | v6 | Latest stable |
| pnpm/action-setup | v4 | Latest stable |
| biomejs/setup-biome | v2 | Biome linter integration |

## Tool Versions

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.13.1 | Via Volta |
| Biome | latest | Via GitHub Actions |
| Markdownlint | cli2 v0.20.0 | Markdown linting |

## Sources

**Last Verified:** 2026-03-04T13:00:00Z
**Commit:** 042bc48

| File | Description |
|------|-------------|
| package.json | Version pins and volta config |
| .github/workflows/ci.yml | CI pipeline configuration |
