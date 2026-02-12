# Project Documentation

## Directory Structure

| Folder | Purpose | Naming Convention |
|--------|---------|-------------------|
| `truth/` | Source of truth (architecture, schema, devops) | Topic-based |
| `plans/` | Approved implementation plans (immutable) | `YYYY-MM-DD-<topic>.md` |
| `progress/` | Implementation tracking | `YYYY-MM-DD-<topic>-PROGRESS.md` |
| `guide/` | How-to guides and tutorials | Topic-based |
| `backlog/` | Future ideas and proposals | Topic-based |

## Truth Document Requirements

Every file in `truth/` MUST include a `## Sources` section:

```markdown
## Sources

**Last Verified:** 2026-02-12T00:00:00Z
**Commit:** abc1234

| File | Description |
|------|-------------|
| src/example.ts | Implementation |
```

**Verify with:** `pnpm check:truth`
