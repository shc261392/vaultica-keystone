# CLAUDE.md — Vaultica Keystone

@AGENTS.md

---

This repository keeps a **single canonical instruction file**: [`AGENTS.md`](AGENTS.md).
The import above loads it into Claude Code. If anything here conflicts with `AGENTS.md`,
`AGENTS.md` wins.

## Claude Code specifics

- **Question tool:** `AskUserQuestion`.
- **Model routing:** pass `model: "opus" | "sonnet" | "haiku"` on Agent tool calls per the
  routing table in `AGENTS.md`.
- **Scratch space:** `.agent_workspace/` (git-ignored) or the session scratchpad.
- **Approval:** never `git commit` or `git push` without explicit approval.
