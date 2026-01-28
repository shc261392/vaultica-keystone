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

### Method 1: Git Submodule Version Check (CI/CD)

Create a script to verify submodule version:

```javascript
// scripts/check-keystone-version.js
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const KEYSTONE_PATH = path.join(__dirname, "..", "vaultica-keystone");

function getLocalVersion() {
  const pkgPath = path.join(KEYSTONE_PATH, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error("❌ Keystone submodule not found. Run: git submodule update --init");
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

function getRemoteVersion() {
  try {
    // Fetch latest from remote
    execSync("git fetch origin main", {
      cwd: KEYSTONE_PATH,
      stdio: "pipe",
    });

    // Get version from remote main branch
    const remoteContent = execSync("git show origin/main:package.json", {
      cwd: KEYSTONE_PATH,
      encoding: "utf8",
    });
    return JSON.parse(remoteContent).version;
  } catch (error) {
    console.warn("⚠️ Could not fetch remote version:", error.message);
    return null;
  }
}

function getLocalCommit() {
  return execSync("git rev-parse HEAD", {
    cwd: KEYSTONE_PATH,
    encoding: "utf8",
  }).trim();
}

function getRemoteCommit() {
  try {
    return execSync("git rev-parse origin/main", {
      cwd: KEYSTONE_PATH,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

function checkVersion() {
  console.log("🔍 Checking Vaultica Keystone version...\n");

  const localVersion = getLocalVersion();
  const remoteVersion = getRemoteVersion();
  const localCommit = getLocalCommit();
  const remoteCommit = getRemoteCommit();

  console.log(`   Local version:  ${localVersion}`);
  console.log(`   Remote version: ${remoteVersion || "unknown"}`);
  console.log(`   Local commit:   ${localCommit.slice(0, 8)}`);
  console.log(`   Remote commit:  ${remoteCommit ? remoteCommit.slice(0, 8) : "unknown"}`);
  console.log("");

  // Check if behind remote
  if (remoteCommit && localCommit !== remoteCommit) {
    console.error("❌ Keystone is outdated!");
    console.error("");
    console.error("   Run the following commands to update:");
    console.error("   git submodule update --remote vaultica-keystone");
    console.error("   cd vaultica-keystone && pnpm run build && cd ..");
    console.error("   git add vaultica-keystone");
    console.error("   git commit -m 'chore: update keystone to latest'");
    console.error("");

    // Exit with error in CI
    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  console.log("✅ Keystone is up to date!");
  return true;
}

// Run check
checkVersion();
```

Add to your `package.json`:

```json
{
  "scripts": {
    "check:keystone": "node scripts/check-keystone-version.js",
    "predev": "npm run check:keystone || true",
    "prebuild": "npm run check:keystone"
  }
}
```

### Method 2: Token Hash Verification

Create a hash of the built tokens to detect changes:

```javascript
// scripts/verify-token-hash.js
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KEYSTONE_DIST = path.join(__dirname, "..", "vaultica-keystone", "dist");
const HASH_FILE = path.join(__dirname, "..", ".keystone-hash");

function calculateHash() {
  const files = ["theme.css", "tailwind.config.js", "tokens.js"];
  const contents = files.map((f) => {
    const filePath = path.join(KEYSTONE_DIST, f);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  });
  return crypto.createHash("sha256").update(contents.join("")).digest("hex");
}

function verify() {
  const currentHash = calculateHash();

  if (!fs.existsSync(HASH_FILE)) {
    console.log("📝 Creating initial token hash...");
    fs.writeFileSync(HASH_FILE, currentHash);
    console.log(`   Hash: ${currentHash.slice(0, 16)}...`);
    return true;
  }

  const storedHash = fs.readFileSync(HASH_FILE, "utf8").trim();

  if (currentHash !== storedHash) {
    console.log("🔄 Keystone tokens have changed!");
    console.log(`   Previous: ${storedHash.slice(0, 16)}...`);
    console.log(`   Current:  ${currentHash.slice(0, 16)}...`);
    console.log("");
    console.log("   Update the hash file:");
    console.log(`   echo "${currentHash}" > .keystone-hash`);
    console.log("   git add .keystone-hash");
    console.log("   git commit -m 'chore: update keystone token hash'");

    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  console.log("✅ Token hash verified");
  return true;
}

// Update command
if (process.argv.includes("--update")) {
  const hash = calculateHash();
  fs.writeFileSync(HASH_FILE, hash);
  console.log(`✅ Hash updated: ${hash.slice(0, 16)}...`);
} else {
  verify();
}
```

### Method 3: GitHub Actions Workflow

```yaml
# .github/workflows/keystone-check.yml
name: Keystone Version Check

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  check-keystone:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Check keystone submodule
        run: |
          cd vaultica-keystone
          git fetch origin main

          LOCAL_COMMIT=$(git rev-parse HEAD)
          REMOTE_COMMIT=$(git rev-parse origin/main)

          echo "Local:  $LOCAL_COMMIT"
          echo "Remote: $REMOTE_COMMIT"

          if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
            echo "::error::Keystone submodule is outdated. Please update to latest."
            exit 1
          fi

          echo "✅ Keystone is up to date"

      - name: Verify tokens are built
        run: |
          if [ ! -f "vaultica-keystone/dist/theme.css" ]; then
            echo "::error::Keystone tokens not built. Run 'pnpm run build' in keystone directory."
            exit 1
          fi
          echo "✅ Tokens are built"

      - name: Check token hash
        run: |
          node scripts/verify-token-hash.js
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

# Run other pre-commit hooks
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
# (copy check-keystone-version.js from above)

# 7. Update package.json scripts
npm pkg set scripts.check:keystone="node scripts/check-keystone-version.js"
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
