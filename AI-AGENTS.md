# AI Agents Guide - Vaultica Keystone

> **For AI Agents, GitHub Copilot, and Automated Tools**

This guide explains the quality tools, workflows, and standards enforced in the Vaultica Keystone
design system. All agents working with this codebase must follow these guidelines.

---

## 🎯 Quality Philosophy

**Zero-tolerance policy for quality violations.** All code must pass quality gates before merging.

### Blocking Quality Gates (Must Pass)

- ✅ **ESLint** - No errors allowed
- ✅ **TypeScript** - No type errors allowed
- ✅ **Prettier** - Code must be formatted
- ✅ **Markdownlint** - Documentation must be well-formed
- ✅ **Build** - Tokens must build successfully
- ✅ **Security Audit** - No moderate+ vulnerabilities

### Non-Blocking Quality Checks (Warnings)

- ⚠️ **cspell** - Spell check (can have false positives)

---

## 🛠️ Quality Tools Overview

### 1. **ESLint** - JavaScript/TypeScript Linting

**Purpose:** Enforce coding standards and catch bugs

**Configuration:**

- Root: `.eslintrc.json` (for `scripts/` directory)
- Preview: `preview/.eslintrc.json` (Next.js + TypeScript)

**Run Locally:**

```bash
# Lint root JavaScript files
pnpm run lint:js

# Lint preview app
cd preview && pnpm lint

# Auto-fix issues
cd preview && pnpm lint:fix
```

**Common Rules:**

- No unused variables (prefix with `_` if intentional)
- No `console.log` (use `console.warn` or `console.error`)
- TypeScript: avoid `any` when possible

---

### 2. **Prettier** - Code Formatting

**Purpose:** Consistent code style across all files

**Configuration:**

- Root: `.prettierrc` and `.prettierignore`
- Preview: `preview/.prettierrc`

**Run Locally:**

```bash
# Check formatting (CI runs this)
pnpm run format:check

# Auto-format all files
pnpm run format

# Preview app only
cd preview && pnpm format
```

**Format on Save:** Enabled in VS Code (`.vscode/settings.json`)

---

### 3. **TypeScript Type Checking**

**Purpose:** Ensure type safety in the preview app

**Configuration:** `preview/tsconfig.json`

**Run Locally:**

```bash
cd preview && pnpm type-check
```

**Key Points:**

- Strict mode enabled
- No implicit `any`
- Use path aliases: `@/*`, `@tokens/*`, `@assets/*`

---

### 4. **markdownlint** - Markdown Linting

**Purpose:** Enforce consistent documentation formatting

**Configuration:** `.markdownlint.json`

**Run Locally:**

```bash
pnpm run lint:md
```

**Common Rules:**

- Headings must increment by one level
- No trailing spaces
- Blank line around lists and headings
- Fenced code blocks must specify language

---

### 5. **cspell** - Spell Checking

**Purpose:** Catch typos in documentation and code

**Configuration:** `cspell.json`

**Run Locally:**

```bash
pnpm run lint:spell
```

**Adding Custom Words:** Edit `cspell.json` → `words` array

**Note:** This is non-blocking in CI (can have false positives)

---

### 6. **commitlint** - Commit Message Validation

**Purpose:** Enforce conventional commit format

**Configuration:** `commitlint.config.js`

**Format:**

```text
<type>(<scope>): <subject>

Examples:
feat(tokens): Add new primary color palette
fix(preview): Resolve TypeScript build error
docs: Update AI-AGENTS guide
chore(deps): Update dependencies
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting (no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD
- `chore` - Other changes
- `revert` - Revert commit

**Scopes:**

- `tokens` - Design tokens
- `preview` - Preview app
- `scripts` - Build scripts
- `docs` - Documentation
- `ci` - CI/CD
- `deps` - Dependencies
- `config` - Configuration

---

### 7. **Security Audit** - Dependency Vulnerabilities

**Purpose:** Detect security vulnerabilities in dependencies

**Run Locally:**

```bash
npm audit --audit-level=moderate
```

**Action Required:**

- Update vulnerable packages immediately
- Document exceptions if updates break functionality

---

## 🔄 CI/CD Workflows

### **Quality Gate** (`.github/workflows/quality-gate.yml`)

**Triggers:** Every push/PR to `main` or `develop`

**Jobs:**

1. **Lint** - ESLint + markdownlint
2. **Format Check** - Prettier validation
3. **Spell Check** - cspell (non-blocking)
4. **Security Audit** - npm audit
5. **Preview Quality** - TypeScript + ESLint + Prettier
6. **Preview Build** - Verify build succeeds
7. **All Checks Passed** - Gate summary

**All jobs must pass for merge approval.**

---

### **Validate** (`.github/workflows/validate.yml`)

**Triggers:** Changes to `tokens/**` or `ai/**`

**Jobs:**

1. Token validation
2. JSON syntax check
3. Required files check
4. Markdown linting (blocking)

---

### **Build** (`.github/workflows/build.yml`)

**Triggers:** Changes to `tokens/**` or `scripts/**`

**Jobs:**

1. Quality checks (lint + format)
2. Token validation
3. Build tokens
4. Upload artifacts
5. Commit dist/ (main branch only)

---

## 🪝 Pre-Commit Hooks (Husky + lint-staged)

**Purpose:** Catch issues before they reach CI

**Hooks:**

- **pre-commit** → Runs `lint-staged` (auto-fix + format)
- **commit-msg** → Runs `commitlint` (validate commit message)

**What Gets Checked:**

- `*.js` → ESLint + Prettier
- `preview/src/**/*.{ts,tsx}` → ESLint + Prettier (preview)
- `*.{json,md,yml,yaml}` → Prettier
- `*.md` → markdownlint

**To Bypass (Emergency Only):**

```bash
git commit --no-verify -m "message"
```

⚠️ **Warning:** Bypassing hooks will cause CI to fail.

---

## 🧪 Running All Quality Checks Locally

**Before pushing, run:**

```bash
# Root quality checks
pnpm run quality

# Preview app checks
cd preview && pnpm run quality

# Full validation
pnpm run validate
pnpm run build
pnpm run preview:build
```

**Auto-fix mode:**

```bash
pnpm run quality:fix
cd preview && pnpm run quality:fix
```

---

## 📋 Quality Checklist for AI Agents

Before completing any task:

- [ ] Code is properly formatted (Prettier)
- [ ] No ESLint errors
- [ ] No TypeScript type errors (if preview app)
- [ ] Markdown follows linting rules
- [ ] Commit messages use conventional format
- [ ] No spelling errors in documentation
- [ ] Build succeeds (`pnpm run build`)
- [ ] Preview builds (if changed: `pnpm preview:build`)
- [ ] All tests pass (when tests exist)

---

## 🚨 Common Issues & Fixes

### Issue: ESLint errors after editing code

**Fix:**

```bash
pnpm run lint:js
# or
cd preview && pnpm run lint:fix
```

---

### Issue: Prettier formatting violations

**Fix:**

```bash
pnpm run format
```

---

### Issue: TypeScript errors in preview app

**Fix:**

```bash
cd preview && pnpm type-check
```

Check error messages and fix type issues.

---

### Issue: Markdownlint violations

**Fix:**

```bash
npm run lint:md
```

Common fixes:

- Add blank lines around headings/lists
- Remove trailing spaces
- Add language to code blocks

---

### Issue: Commit message rejected

**Fix:** Use conventional commit format:

```bash
git commit -m "feat(tokens): Add new color"
```

---

### Issue: Pre-commit hook fails

**Fix:**

```bash
# See what failed
npm run quality

# Auto-fix
npm run quality:fix

# Re-commit
git add .
git commit -m "fix: Resolve quality issues"
```

---

## 🔧 Tool Versions & Environment

**Node Version:** 24.x (see `.nvmrc`)  
**Package Manager:** pnpm 9.x (preview app), npm (root)  
**Runtime Manager:** mise (optional, see `.tool-versions`)

**Recommended VS Code Extensions:**

- ESBen Petersen: Prettier
- Microsoft: ESLint
- Tailwind CSS IntelliSense
- Code Spell Checker
- Markdownlint
- GitHub Copilot
- Conventional Commits

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 💡 Best Practices for AI Agents

1. **Always run quality checks before completion**
2. **Auto-fix when possible** (`npm run quality:fix`)
3. **Read error messages carefully** - they often contain the fix
4. **Use conventional commits** - Required for merge
5. **Test builds locally** before pushing
6. **Keep commits atomic** - One logical change per commit
7. **Update documentation** when changing workflows
8. **Add unknown words to cspell** instead of disabling
9. **Don't bypass quality gates** unless emergency
10. **When in doubt, ask** - Quality is non-negotiable

---

**Remember:** Quality gates exist to maintain codebase health. They are your allies, not obstacles.

---

### Last Updated: 2026-01-24
