# Testing and deployment

There is no CI/CD. The only workflow, `.github/workflows/ci.yml`, is a manual no-op.
Everything that used to run in GitHub Actions is a `package.json` script you run locally.

## Prerequisites

- Node 24.13.1 (Volta or `mise install`) and pnpm 10 (`packageManager` in `package.json`).
- Biome installed as a system binary (for example `brew install biome`); it is not an npm
  dependency.
- Dependencies: `pnpm install` and, for the preview app, `pnpm preview:install`.
- Network access for `pnpm audit`.

## Full test gate

```bash
pnpm verify
```

It runs, in order and stopping at the first failure:

1. `pnpm lint` (Biome and markdownlint)
2. `pnpm typecheck`
3. `pnpm validate` (token structure)
4. `pnpm check:tokens` (token JSON syntax and required files)
5. `pnpm check:truth` (`node scripts/truth.mjs check`: truth docs vs sources via `manifest.json`
   and `truth.lock.json`; fix a STALE doc, then `pnpm truth stamp <doc> --reason "..."`)
6. `pnpm audit` (`pnpm audit --audit-level=moderate`, needs network)
7. `pnpm build` (validate, then regenerate `dist/`)
8. `pnpm preview:typecheck` (preview app `tsc --noEmit`)
9. `NODE_ENV=production pnpm preview:build`, then confirms `preview/.next` exists

Run any step on its own while iterating. Auto-fix lint with `pnpm lint:fix`.

## Deployment

Keystone has no deploy target. It is consumed as a git submodule by `vaultica-forge`,
`vaultica-site` and `vaultica-web`. To release a change: run `pnpm verify`, commit the rebuilt
`dist/`, push, then bump the submodule and token hash in each consumer. The old workflow only
uploaded `dist/` as a 30-day build artifact; `pnpm build` produces the same `dist/` locally.

## Database migrations

None. This repo has no database.

## Secrets

None. No script here needs credentials. `pnpm audit` uses the public npm registry.

## What the retired GitHub Actions did

| Old job in `ci.yml` | Replaced by |
| --- | --- |
| `lint` (Biome and markdownlint) | `pnpm lint` |
| `typecheck` | `pnpm typecheck` |
| `validate`: token structure | `pnpm validate` |
| `validate`: Check JSON syntax, Check required files | `pnpm check:tokens` |
| `truth-check` | `pnpm check:truth`, plus the `.husky/pre-commit` staged check |
| `security-audit` | `pnpm audit` |
| `build`: build tokens, upload `dist/` artifact | `pnpm build` (artifact is local `dist/`) |
| `preview-quality` | `pnpm preview:typecheck` |
| `preview-build`: build, check `.next` exists | `NODE_ENV=production pnpm preview:build` and `test -d preview/.next` (in `verify`) |
| `all-checks-passed` | `pnpm verify` exit code |

The `docs/github-workflows/keystone-check.yml` file is a template for consumer repos, not a
workflow of this repo.
