# Truth docs tooling

`truth.mjs` keeps `docs/truth/*` in sync with code. Zero dependencies, Node 24+. This directory is
canonical; repos carry an identical copy at `scripts/truth.mjs` (see `sync.sh`).

## Model

- `docs/truth/manifest.json` (hand-edited): which docs exist, their `sources` globs, `exclude`,
  `severity` (`block` or `warn`), optional `sections` and `reviewEvery` (for example `90d`), plus a
  repo-wide `watch` list used to report UNMAPPED files.
- `docs/truth/truth.lock.json` (tool-owned, never edit): per doc, git blob OIDs of every source at
  the last verification, a doc hash and the last stamp reason.

A doc is STALE when a matched source was added, removed or changed since its stamp, when
`reviewEvery` elapsed, or when it has no lock entry (UNVERIFIED).

## Commands

```bash
node scripts/truth.mjs check [--staged|--dirty] [--json]   # exit 0 clean, 1 stale block docs, 3 config error
node scripts/truth.mjs stamp <doc> --reason "<>= 20 chars>" [--unchanged "<why prose still true>"]
node scripts/truth.mjs init <doc>      # first lock entry; only after reading doc against sources
node scripts/truth.mjs import [--strip]  # one-time migration from Sources tables
node scripts/truth.mjs selftest
```

Stamping rules: one doc per call, refused when the doc is not stale, refused if the doc text is
unchanged since the last stamp unless `--unchanged` explains why and names a changed file. Never
bulk-stamp; re-read the doc against the changed sources first.

## Wiring

- Git: call `node scripts/truth.mjs check --staged` from the pre-commit hook (`pre-commit.sh`).
- Claude Code: merge `claude-settings.hooks.json` into `.claude/settings.json`.
- OpenCode: `opencode-plugin.ts` becomes `.opencode/plugins/truth.ts`.
- Copilot (optional): `hook copilot-stop` prints `{"decision":"block","reason":...}`.

## Add a doc

Add an entry to `manifest.json`, run `check` (it shows UNVERIFIED), read the doc against the
sources, fix it, then `stamp` (or `init`).

Sync: `tools/truth/sync.sh <repo-dir>...`
