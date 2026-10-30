# AGENTS.md — Vaultica Keystone

Canonical, tool-agnostic instructions for **every** AI coding agent working in this
repository. Harness entry points all resolve here:

| Harness | Entry point |
| --- | --- |
| OpenCode | auto-loads this `AGENTS.md`; config in [`opencode.jsonc`](opencode.jsonc) |
| Claude Code | [`CLAUDE.md`](CLAUDE.md) imports this file |
| GitHub Copilot | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) points here |

Claude Code and OpenCode are the **must-support** harnesses. If a harness-specific file
conflicts with this one, **this file wins**.

---

## Project

Vaultica Keystone is the design system and single source of truth (SSoT) for brand tokens,
AI context and design assets. It is consumed as a **git submodule** by `vaultica-forge`,
`vaultica-site` and `vaultica-web`, so every change here ships to all three.

- **Stack:** TypeScript 5 (strict) · Node 24 (Volta) · pnpm 10 · token build via `tsx`.
- **Quality:** Biome (system binary, **not** an npm package) · markdownlint-cli2 · cspell ·
  husky pre-commit (commitlint is installed but no `commit-msg` hook runs it).
- **Brand:** BlinkVault (product, by Vaultica) — "AI-ready in a Blink. One vault for everything
  your AI needs." Industrial elegance (heavy borders, high contrast). Voice: calm, clear,
  intentional. Avoid playful language, tech jargon, bulk-dump messaging, weak borders and
  vibe-app aesthetics. Terms: **Vault** = user's centralized repository · **AI-ready** = the core
  promise · **Sync / Send / Drop** = the three ingestion models. Full context:
  [`ai/brand-context.md`](ai/brand-context.md).

## Non-negotiable rules

1. **Tokens are the source.** Change styles only in `tokens/`, then run `pnpm build`.
   Never hand-edit `dist/`.
2. **No hardcoded colors.** Use CSS variables / functional names (`vault-surface`,
   `vault-accent`); define colors in OKLCH. Meet WCAG AA contrast (4.5:1).
3. **Use `pnpm`**, never npm or yarn. Biome config lives in `biome.jsonc` only — no
   separate ESLint/Prettier files.
4. **Truth docs stay in sync.** Truth docs (`docs/truth/`, mapped in `manifest.json`) must
   match the code. When `pnpm truth check` or a hook reports STALE, edit the listed sections,
   then run the printed `pnpm truth stamp ... --reason`. Never edit `truth.lock.json` and never
   stamp a doc you didn't re-read. Tooling lives in `tools/truth/`; repos carry a copy at
   `scripts/truth.mjs`.
5. **Config changes need approval** (Biome, tsconfig, commitlint).
6. **Git needs approval.** Never `git commit` or `git push` without explicit approval.
   Conventional Commits, header ≤ 100 chars: `feat | fix | docs | style | refactor | perf |
   test | build | ci | chore | revert`, e.g. `feat(tokens): add accent scale`.
7. **Ask when ambiguous** with your harness's question tool; never guess.
8. **Downstream impact.** Token or asset changes affect three apps — call that out, and
   remind the human that consumers must bump the submodule and their token hash.

## Quality gates

There is no CI/CD (the only GitHub workflow is a manual no-op). The gate is `pnpm verify`,
run locally. Run it before declaring a task complete (fix failures, do not skip). It chains
the checks below plus `pnpm validate`, `pnpm check:tokens` and `pnpm audit`. Details and
release steps: [`docs/guide/testing-and-deployment.md`](docs/guide/testing-and-deployment.md).

```bash
pnpm verify          # everything below, in order
pnpm lint            # Biome + markdownlint
pnpm typecheck       # tsc --noEmit
pnpm check:truth     # truth docs vs sources (also: pnpm truth ...)
pnpm build           # validate + regenerate dist/
pnpm preview:build   # preview app still builds
```

Auto-fix: `pnpm lint:fix`. Prefer your harness's task runner for these checks when
available.

## Documentation layout (`docs/`)

| Folder | Purpose |
| --- | --- |
| `truth/` | Source of truth (must sync with code) |
| `plans/` | Approved plans (immutable) |
| `progress/` | Implementation tracking |
| `guide/` | How-to guides |
| `backlog/` | Future proposals |

## Agent assets

Agent-facing brand context lives in [`ai/`](ai/) (`brand-context.md`,
`component-patterns.md`, `personality.md`, …). Read the relevant file on demand; do not
load all of them.

## Model routing (cost-balanced)

Use the cheapest tier that does the job reliably; escalate on failure, not by default.

| Tier | Use for | Claude Code | OpenCode |
| --- | --- | --- | --- |
| **Opus** | Token-system and brand architecture decisions; changes that ripple into all three consumers | `opus` | `anthropic/claude-opus-5-5` |
| **Sonnet** (default) | Token edits, scripts, docs, reviews, everyday implementation | `sonnet` | `anthropic/claude-sonnet-5-5` |
| **Haiku** | Read-only exploration, grep, summaries, contrast/lint triage, mechanical edits | `haiku` | `anthropic/claude-haiku-5-5` |

Run the main session on Sonnet. Opus decides, Sonnet builds. Escalate once: thin Haiku
result → Sonnet; Sonnet fails twice → Opus with a failure summary. Claude Code: pass
`model` on the Agent tool. OpenCode: `explore` is pinned to Haiku in `opencode.jsonc`.
