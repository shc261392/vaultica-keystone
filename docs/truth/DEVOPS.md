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
| actions/upload-artifact | v7 | Latest stable |
| pnpm/action-setup | v4 | Latest stable |
| biomejs/setup-biome | v2 | Biome linter integration |

## Tool Versions

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.13.1 | Via Volta |
| Biome | latest | Via GitHub Actions |
| Markdownlint | cli2 v0.21.0 | Markdown linting |

## Sources

**Last Verified:** 2026-03-09T11:48:06Z
**Commit:** 246ee40

| File | Description |
|------|-------------|
| package.json | Version pins and volta config |
| .github/workflows/ci.yml | CI pipeline configuration |
