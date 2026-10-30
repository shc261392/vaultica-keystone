#!/bin/sh
# Truth-docs gate for git pre-commit. Blocks when a staged source change lacks a staged lock update.
# Source this from .husky/pre-commit or .githooks/pre-commit (or call it directly).
exec node scripts/truth.mjs check --staged
