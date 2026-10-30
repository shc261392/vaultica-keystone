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

Every doc in `truth/` is registered in `truth/manifest.json` with the source globs it describes.
`truth/truth.lock.json` is tool-owned and records what each doc was last verified against; never
edit it by hand.

```bash
pnpm truth check                                  # list STALE docs
pnpm truth stamp docs/truth/X.md --reason "..."   # after editing the doc to match the code
```

See `tools/truth/README.md` for the rules.
