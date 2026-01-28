# Vaultica Keystone Integration Guide

Complete guide for integrating Vaultica design tokens, logos, and brand assets into a Next.js 16 +
Tailwind CSS project.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation Methods](#installation-methods)
3. [Using Design Tokens](#using-design-tokens)
4. [Logo & Asset Integration](#logo--asset-integration)
5. [Tailwind CSS Configuration](#tailwind-css-configuration)
6. [Favicon & App Icons](#favicon--app-icons)
7. [Gatekeeping Setup](#gatekeeping-setup)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Add keystone as a git submodule
git submodule add https://github.com/vaultica/keystone.git vaultica-keystone

# 2. Install dependencies and build tokens
cd vaultica-keystone && pnpm install && pnpm run build && cd ..

# 3. Import CSS in your globals.css
# @import "../vaultica-keystone/dist/theme.css";
```

---

## Installation Methods

### Method 1: Git Submodule (Recommended)

Best for projects that need automatic updates and gatekeeping.

```bash
# Add as submodule
git submodule add https://github.com/vaultica/keystone.git vaultica-keystone

# Initialize on clone
git submodule update --init --recursive

# Update to latest
git submodule update --remote vaultica-keystone
```

**Directory structure:**

```text
your-project/
├── vaultica-keystone/       # Submodule
│   ├── dist/
│   │   ├── theme.css
│   │   ├── tailwind.config.js
│   │   └── tokens.js
│   ├── tokens/
│   └── assets/
├── src/
├── tailwind.config.ts
└── package.json
```

### Method 2: NPM Package (Private Registry)

If you publish `@vaultica/keystone` to npm or a private registry:

```bash
pnpm add @vaultica/keystone
```

```typescript
// tailwind.config.ts
import vaulticaTheme from "@vaultica/keystone/dist/tailwind.config.js";
```

### Method 3: Copy Assets (Simple Projects)

Copy required files directly:

```bash
cp -r vaultica-keystone/dist ./src/styles/vaultica
cp -r vaultica-keystone/assets/logos ./public/logos
```

---

## Using Design Tokens

### CSS Custom Properties

Import the generated theme CSS in your `globals.css`:

```css
/* src/app/globals.css */

/* Import Vaultica tokens (adjust path for your setup) */
@import "../../vaultica-keystone/dist/theme.css";

/* Or with npm package */
/* @import "@vaultica/keystone/dist/theme.css"; */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Available CSS Variables:**

```css
/* Brand Colors */
--color-brand-black: #363b42;
--color-brand-white: #f0fbff;
--color-brand-blue: #27abec;

/* Semantic Surface Colors */
--color-semantic-vault-surface-primary   /* Main app background */
--color-semantic-vault-surface-secondary /* Card/panel backgrounds */
--color-semantic-vault-surface-tertiary  /* Elevated surfaces */

/* Semantic Text Colors */
--color-semantic-vault-text-primary      /* Main body text */
--color-semantic-vault-text-secondary    /* Subdued text */
--color-semantic-vault-text-tertiary     /* Placeholder text */
--color-semantic-vault-text-accent       /* Links and highlights */

/* Semantic Border Colors */
--color-semantic-vault-border-default    /* Standard borders */
--color-semantic-vault-border-strong     /* Heavy brutalist borders */
--color-semantic-vault-border-subtle     /* Subtle dividers */
--color-semantic-vault-border-focus      /* Focus ring color */

/* Status Colors */
--color-semantic-vault-status-success
--color-semantic-vault-status-warning
--color-semantic-vault-status-critical

/* Typography */
--typography-fontFamily-primary
--typography-fontFamily-mono

/* Spacing */
--spacing-1 through --spacing-96

/* Effects */
--effects-shadow-sm through --effects-shadow-xl
--effects-border-width-thick: 3px
```

### JavaScript/TypeScript Tokens

```typescript
// Import tokens directly
import { tokens, cssVar } from "../../vaultica-keystone/dist/tokens.js";

// Use raw values
const brandBlue = tokens.color_brand_blue; // "#27abec"

// Use as CSS variable reference
const accentVar = cssVar("color_semantic_vault_accent_default");
// Returns: "var(--color-semantic-vault-accent-default)"
```

**Type-safe tokens:**

```typescript
import type { TokenName } from "../../vaultica-keystone/dist/tokens";

function getToken(name: TokenName): string {
  return tokens[name];
}
```

---

## Logo & Asset Integration

### Available Logos

| File                             | Description               | Usage              |
| -------------------------------- | ------------------------- | ------------------ |
| `blink-icon.svg`                 | Icon only                 | Favicons, small    |
| `blink-logo-dark.svg`            | Logo on dark backgrounds  | Headers, hero      |
| `blink-logo-text.svg`            | Text-only wordmark        | Legal footers      |
| `blink-vault-logo-dark.svg`      | Full product logo (dark)  | Primary branding   |
| `blink-vault-logo-light.svg`     | Full product logo (light) | Light backgrounds  |
| `blink-with-icon-horizontal.svg` | Icon + "Blink" horiz      | Navigation headers |
| `vaultica-logo.svg`              | Company logo              | Footer, about      |
| `vaultica-white-icon.svg`        | White company icon        | Dark backgrounds   |
| `favicon.ico`                    | Favicon                   | Browser tab        |

### Copy Logos to Public Folder

```bash
# Copy all logos to public
cp -r vaultica-keystone/assets/logos/* public/logos/

# Or create a symlink (development)
ln -s ../vaultica-keystone/assets/logos public/logos
```

### Using Logos in Next.js

```tsx
// src/components/Logo.tsx
import Image from "next/image";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const src =
    variant === "dark" ? "/logos/blink-vault-logo-dark.svg" : "/logos/blink-vault-logo-light.svg";

  return <Image src={src} alt="Blink Vault" width={180} height={48} priority />;
}

// App Icon (for small spaces)
export function AppIcon({ size = 32 }: { size?: number }) {
  return <Image src="/logos/blink-icon.svg" alt="Blink" width={size} height={size} />;
}
```

### SVG as React Component

For full control (colors, animations):

```tsx
// src/components/icons/BlinkIcon.tsx
export function BlinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`fill-current ${className}`} aria-label="Blink">
      {/* SVG paths from blink-icon.svg */}
    </svg>
  );
}
```

---

## Tailwind CSS Configuration

### Extend Tailwind with Vaultica Theme

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

// Import Vaultica theme
const vaulticaTheme = require("./vaultica-keystone/dist/tailwind.config.js");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Spread Vaultica theme
      ...vaulticaTheme.theme.extend,

      // Add your project-specific overrides
      colors: {
        ...vaulticaTheme.theme.extend.colors,
        // Project-specific additions
        custom: {
          purple: "#8b5cf6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Available Tailwind Classes

After configuration, you can use:

```tsx
// Surface colors
<div className="bg-vault-surface-primary">Main background</div>
<div className="bg-vault-surface-secondary">Card background</div>

// Text colors
<p className="text-vault-text-primary">Main text</p>
<p className="text-vault-text-secondary">Subdued text</p>
<a className="text-vault-text-accent">Link</a>

// Border colors
<div className="border-vault-border-default">Standard border</div>
<div className="border-vault-border-strong border-3">Brutalist border</div>

// Accent colors
<button className="bg-vault-accent hover:bg-vault-accent-hover">
  Primary Button
</button>

// Status colors
<span className="text-vault-status-success">Success</span>
<span className="text-vault-status-warning">Warning</span>
<span className="text-vault-status-critical">Error</span>

// Font families
<p className="font-primary">Body text (Inter)</p>
<code className="font-mono">Code (JetBrains Mono)</code>

// Brutalist borders
<div className="border-thick border-vault-border-strong">3px border</div>
<div className="border-heavy border-vault-border-strong">4px border</div>

// Glow effects
<button className="shadow-glow-accent">Glowing button</button>
```

### Create Component Classes

```css
/* src/app/globals.css */
@layer components {
  /* Primary button with Vaultica styling */
  .btn-primary {
    @apply bg-vault-accent text-white font-semibold px-6 py-3 
           border-3 border-vault-accent
           hover:bg-vault-accent-hover hover:border-vault-accent-hover
           focus:outline-none focus:ring-2 focus:ring-vault-border-focus 
           focus:ring-offset-2 focus:ring-offset-vault-surface-primary
           transition-colors duration-150;
  }

  /* Secondary button */
  .btn-secondary {
    @apply bg-transparent text-vault-text-primary font-semibold px-6 py-3
           border-3 border-vault-border-strong
           hover:bg-vault-surface-tertiary hover:border-vault-text-secondary
           focus:outline-none focus:ring-2 focus:ring-vault-border-focus
           transition-colors duration-150;
  }

  /* Brutalist card */
  .card-brutalist {
    @apply bg-vault-surface-secondary border-3 border-vault-border-strong p-6;
  }

  /* Input field */
  .input-brutalist {
    @apply bg-vault-surface-secondary text-vault-text-primary
           border-3 border-vault-border-default
           focus:border-vault-border-focus focus:outline-none
           placeholder:text-vault-text-tertiary
           px-4 py-3 w-full;
  }
}
```

---

## Favicon & App Icons

### Setup Web App Icons

**Step 1: Copy favicon and create app icons:**

```bash
# Copy favicon
cp vaultica-keystone/assets/logos/favicon.ico public/

# Copy icon for PWA/social
cp vaultica-keystone/assets/logos/blink-icon.svg public/icon.svg
```

**Step 2: Configure metadata in layout.tsx:**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blink Vault",
  description: "See it. Blink it. Find it.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};
```

**Step 3: Create web manifest:**

```json
// public/manifest.json
{
  "name": "Blink Vault",
  "short_name": "Blink",
  "description": "See it. Blink it. Find it.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#363b42",
  "theme_color": "#27abec",
  "icons": [
    {
      "src": "/logos/blink-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Generate PNG Icons from SVG

```bash
# Using ImageMagick (install: brew install imagemagick)
convert -background none -resize 192x192 public/logos/blink-icon.svg public/icons/icon-192.png
convert -background none -resize 512x512 public/logos/blink-icon.svg public/icons/icon-512.png
convert -background none -resize 180x180 public/logos/blink-icon.svg public/apple-touch-icon.png
```

### Open Graph / Social Images

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Blink Vault",
    description: "See it. Blink it. Find it.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blink Vault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blink Vault",
    description: "See it. Blink it. Find it.",
    images: ["/og-image.png"],
  },
};
```

---

## Gatekeeping Setup

Ensure your project always uses the latest keystone tokens. This prevents drift between design
tokens and your application.

**Requirements:**

- Add `tsx` as a dev dependency: `pnpm add -D tsx`
- Set `"type": "module"` in your package.json for ES modules

### Method 1: TypeScript Version Check Script (Recommended)

Keystone includes TypeScript ES module scripts in `scripts/`. Use them directly or copy to your
project:

```typescript
// Option A: Run directly from keystone submodule
// pnpm check:keystone → tsx vaultica-keystone/scripts/check-keystone.ts

// Option B: Copy to your project's scripts/ folder and adjust paths
```

**The check-keystone.ts script:**

```typescript
#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone Version Checker
 *
 * Verifies that the keystone submodule is up to date and tokens are built.
 * Run this script before builds to ensure design token consistency.
 *
 * Usage:
 *   pnpm check:keystone
 *
 * Exit codes:
 *   0 - Keystone is up to date and tokens are built
 *   1 - Keystone is outdated, missing, or tokens not built
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Parse command line arguments for custom directory
const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const customDir = dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : null;

// When run from consumer project, keystone is the parent of scripts/
const KEYSTONE_PATH = customDir ? resolve(customDir) : join(__dirname, "..", "vaultica-keystone");
const DIST_PATH = join(KEYSTONE_PATH, "dist");

const isCI = process.env.CI === "true";

interface CheckResult {
  success: boolean;
  message: string;
}

function execSilent(command: string, cwd: string): string | null {
  try {
    return execSync(command, { cwd, encoding: "utf8", stdio: "pipe" }).trim();
  } catch {
    return null;
  }
}

function checkSubmoduleExists(): CheckResult {
  if (!existsSync(KEYSTONE_PATH)) {
    return {
      success: false,
      message: "Keystone submodule not found. Run: git submodule update --init --recursive",
    };
  }
  return { success: true, message: "Submodule exists" };
}

function getLocalVersion(): string | null {
  const pkgPath = join(KEYSTONE_PATH, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return pkg.version;
  } catch {
    return null;
  }
}

function checkTokensBuilt(): CheckResult {
  const requiredFiles = ["theme.css", "tailwind.config.js", "tokens.js"];

  for (const file of requiredFiles) {
    if (!existsSync(join(DIST_PATH, file))) {
      return {
        success: false,
        message: `Missing built token file: dist/${file}. Run: cd vaultica-keystone && pnpm install && pnpm run build`,
      };
    }
  }
  return { success: true, message: "All token files are built" };
}

function checkSubmoduleVersion(): CheckResult {
  // Fetch latest from remote (silently, may fail if offline)
  execSilent("git fetch origin main", KEYSTONE_PATH);

  const localCommit = execSilent("git rev-parse HEAD", KEYSTONE_PATH);
  const remoteCommit = execSilent("git rev-parse origin/main", KEYSTONE_PATH);

  if (!localCommit) {
    return { success: false, message: "Could not determine local commit" };
  }

  console.log(`   Local commit:   ${localCommit.slice(0, 8)}`);
  console.log(`   Remote commit:  ${remoteCommit ? remoteCommit.slice(0, 8) : "unknown"}`);

  if (remoteCommit && localCommit !== remoteCommit) {
    const message =
      "Keystone submodule is outdated. Run: git submodule update --remote vaultica-keystone";
    if (isCI) {
      return { success: false, message };
    }
    // In local dev, warn but don't fail
    console.warn(`\n⚠️  Warning: ${message}`);
    return { success: true, message: "Outdated but continuing in dev mode" };
  }

  return { success: true, message: "Submodule is up to date" };
}

function main(): void {
  console.log("🔍 Checking Vaultica Keystone...\n");

  // Check 1: Submodule exists
  const existsCheck = checkSubmoduleExists();
  if (!existsCheck.success) {
    console.error(`❌ ${existsCheck.message}`);
    process.exit(1);
  }

  // Get and display version
  const version = getLocalVersion();
  console.log(`   Version:        ${version ?? "unknown"}`);

  // Check 2: Submodule version
  const versionCheck = checkSubmoduleVersion();
  if (!versionCheck.success) {
    console.error(`\n❌ ${versionCheck.message}`);
    process.exit(1);
  }

  // Check 3: Tokens are built
  const tokensCheck = checkTokensBuilt();
  if (!tokensCheck.success) {
    console.error(`\n❌ ${tokensCheck.message}`);
    process.exit(1);
  }

  console.log("\n✅ Keystone submodule is valid");
  console.log("✅ Token files are built");
}

main();
```

Add to your `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "check:keystone": "tsx scripts/check-keystone.ts",
    "check:tokens": "tsx scripts/verify-token-hash.ts",
    "check:tokens:update": "tsx scripts/verify-token-hash.ts --update",
    "prebuild": "pnpm check:keystone || true"
  },
  "devDependencies": {
    "tsx": "^4.21.0"
  }
}
```

### Method 2: Token Hash Verification (TypeScript)

Create a hash of the built tokens to detect changes:

```typescript
#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone Token Hash Verifier
 *
 * Creates and verifies a hash of the built design tokens to detect changes.
 * This ensures that token changes are explicitly acknowledged in version control.
 *
 * Usage:
 *   pnpm check:tokens          # Verify current hash
 *   pnpm check:tokens --update # Update stored hash
 *
 * Exit codes:
 *   0 - Hash verified or updated successfully
 *   1 - Hash mismatch (tokens have changed)
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const hashIndex = args.indexOf("--hash");

const customDir = dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : null;
const customHashFile = hashIndex !== -1 && args[hashIndex + 1] ? args[hashIndex + 1] : null;

const KEYSTONE_PATH = customDir ? resolve(customDir) : join(__dirname, "..", "vaultica-keystone");
const KEYSTONE_DIST = join(KEYSTONE_PATH, "dist");
const HASH_FILE = customHashFile
  ? resolve(customHashFile)
  : join(__dirname, "..", ".keystone-hash");

const TOKEN_FILES = ["theme.css", "tailwind.config.js", "tokens.js"] as const;

const isCI = process.env.CI === "true";

function calculateHash(): string {
  const contents = TOKEN_FILES.map((file) => {
    const filePath = join(KEYSTONE_DIST, file);
    if (!existsSync(filePath)) {
      console.error(`❌ Missing token file: ${file}`);
      console.error("   Run: cd vaultica-keystone && pnpm run build");
      process.exit(1);
    }
    return readFileSync(filePath, "utf8");
  });

  return createHash("sha256").update(contents.join("")).digest("hex");
}

function updateHash(): void {
  const hash = calculateHash();
  writeFileSync(HASH_FILE, hash + "\n");

  console.log("✅ Token hash updated");
  console.log(`   Hash: ${hash.slice(0, 16)}...`);
  console.log("");
  console.log("   Don't forget to commit the hash file:");
  console.log('   git add .keystone-hash && git commit -m "chore: update keystone token hash"');
}

function verify(): void {
  console.log("🔍 Verifying Keystone token hash...\n");

  const currentHash = calculateHash();

  if (!existsSync(HASH_FILE)) {
    console.log("📝 No existing hash found. Creating initial token hash...");
    writeFileSync(HASH_FILE, currentHash + "\n");
    console.log(`   Hash: ${currentHash.slice(0, 16)}...`);
    console.log("");
    console.log("   Commit the hash file:");
    console.log('   git add .keystone-hash && git commit -m "chore: add keystone token hash"');
    return;
  }

  const storedHash = readFileSync(HASH_FILE, "utf8").trim();

  if (currentHash !== storedHash) {
    console.error("❌ Token hash mismatch! Keystone tokens have changed.");
    console.error("");
    console.error(`   Previous: ${storedHash.slice(0, 16)}...`);
    console.error(`   Current:  ${currentHash.slice(0, 16)}...`);
    console.error("");
    console.error("   If this change is intentional, update the hash:");
    console.error("   pnpm check:tokens --update");

    if (isCI) {
      process.exit(1);
    }
    return;
  }

  console.log("✅ Token hash verified");
  console.log(`   Hash: ${currentHash.slice(0, 16)}...`);
}

// Parse command line arguments
if (args.includes("--update")) {
  updateHash();
} else {
  verify();
}
```

### Method 3: GitHub Actions Workflow

Use pnpm scripts instead of inline bash for better maintainability:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: ["feat/**", "fix/**", "chore/**"]

jobs:
  check-keystone:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check keystone submodule
        run: pnpm check:keystone

      - name: Verify token hash
        run: pnpm check:tokens

  lint:
    runs-on: ubuntu-latest
    needs: check-keystone
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    needs: check-keystone
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

### Method 4: Pre-commit Hook

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check if keystone submodule is outdated
echo "🔍 Checking Keystone version..."

cd vaultica-keystone
git fetch origin main 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
  echo ""
  echo "⚠️  Warning: Keystone submodule is outdated!"
  echo "   Local:  ${LOCAL:0:8}"
  echo "   Remote: ${REMOTE:0:8}"
  echo ""
  echo "   Consider updating with:"
  echo "   git submodule update --remote vaultica-keystone"
  echo ""
fi

cd ..

# Run lint-staged
npx lint-staged
```

### Method 5: Dependabot for Submodules

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule:
      interval: "daily"
    commit-message:
      prefix: "chore(keystone):"
```

---

## Troubleshooting

### CSS Variables Not Working

Ensure `theme.css` is imported BEFORE Tailwind directives:

```css
@import "../../vaultica-keystone/dist/theme.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Also check the path is correct for your project structure.

### Tailwind Colors Not Applying

1. Verify the theme is properly merged in `tailwind.config.ts`
2. Restart the dev server after config changes
3. Check that the color variable is using `var(--...)` syntax

### Submodule Not Found

```bash
# Initialize submodules
git submodule update --init --recursive

# If .gitmodules is missing, re-add
git submodule add https://github.com/vaultica/keystone.git vaultica-keystone
```

### Tokens Not Built

```bash
cd vaultica-keystone
pnpm install
pnpm run build
```

### TypeScript Errors with Tokens

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@vaultica/keystone/*": ["./vaultica-keystone/dist/*"]
    }
  }
}
```

---

## Complete Example: Minimal Setup

```bash
# 1. Create Next.js 16 project
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app

# 2. Add keystone submodule
git submodule add https://github.com/vaultica/keystone.git vaultica-keystone
cd vaultica-keystone && pnpm install && pnpm run build && cd ..

# 3. Copy logos
mkdir -p public/logos
cp vaultica-keystone/assets/logos/*.svg public/logos/
cp vaultica-keystone/assets/logos/favicon.ico public/

# 4. Update globals.css (prepend import)
cat > src/app/globals.css << 'EOF'
@import "../../vaultica-keystone/dist/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: var(--color-semantic-vault-surface-primary);
  color: var(--color-semantic-vault-text-primary);
}
EOF

# 5. Update tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const vaulticaTheme = require("./vaultica-keystone/dist/tailwind.config.js");

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      ...vaulticaTheme.theme.extend,
    },
  },
  plugins: [],
};

export default config;
EOF

# 6. Add gatekeeping script
mkdir -p scripts
# (copy check-keystone.ts from vaultica-keystone/scripts/)

# 7. Update package.json scripts
npm pkg set scripts.check:keystone="npx tsx scripts/check-keystone.ts"
npm pkg set scripts.prebuild="npm run check:keystone"

# 8. Run dev server
pnpm dev
```

---

## Version History

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0.0   | 2026-01-28 | Initial integration guide |

---

**Keystone Version:** 1.0.0  
**Last Updated:** 2026-01-28
