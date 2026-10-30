#!/bin/sh
# Usage: tools/truth/sync.sh <repo-dir>...
# Copies truth.mjs -> <repo>/scripts/truth.mjs and the OpenCode plugin ->
# <repo>/.opencode/plugins/truth.ts. Does not touch package.json, hooks, manifest or docs.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
[ "$#" -gt 0 ] || { echo "usage: $0 <repo-dir>..." >&2; exit 2; }
for repo in "$@"; do
  [ -d "$repo" ] || { echo "not a directory: $repo" >&2; exit 2; }
  mkdir -p "$repo/scripts" "$repo/.opencode/plugins"
  cp "$here/truth.mjs" "$repo/scripts/truth.mjs"
  cp "$here/opencode-plugin.ts" "$repo/.opencode/plugins/truth.ts"
  echo "synced $repo ($(grep -m1 -o 'TRUTH_VERSION: [0-9.]*' "$here/truth.mjs"))"
done
