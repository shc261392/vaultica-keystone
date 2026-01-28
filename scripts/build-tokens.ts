#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone - Token Build Script
 *
 * Transforms JSON design tokens into consumable formats:
 * - CSS custom properties
 * - Tailwind CSS config
 * - JavaScript/TypeScript exports
 *
 * Usage: npx tsx scripts/build-tokens.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Paths
const TOKENS_DIR = join(__dirname, "..", "tokens");
const DIST_DIR = join(__dirname, "..", "dist");

// Type definitions
interface TokenValue {
  value: string;
  type?: string;
  description?: string;
}

type TokenData = {
  [key: string]: TokenValue | TokenData | string;
};

type TokenCollection = {
  [category: string]: TokenData;
};

type CSSVariables = {
  [name: string]: string;
};

// Ensure dist directory exists
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Load all token files
 */
function loadTokens(): TokenCollection {
  const tokenFiles = [
    "colors.json",
    "typography.json",
    "effects.json",
    "spacing.json",
    "semantic.json",
  ];
  const tokens: TokenCollection = {};

  for (const file of tokenFiles) {
    const filePath = join(TOKENS_DIR, file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf8");
      const parsed = JSON.parse(content) as TokenData;
      const name = file.replace(".json", "");
      tokens[name] = parsed;
      console.log(`✓ Loaded ${file}`);
    } else {
      console.warn(`⚠ Missing ${file}`);
    }
  }

  return tokens;
}

/**
 * Get nested object value by dot path
 * Tries direct path first, then searches within each token category
 */
function getNestedValue(
  obj: TokenCollection | TokenData,
  path: string
): TokenValue | TokenData | string | undefined {
  const parts = path.split(".");

  // First, try direct path lookup
  let current: TokenCollection | TokenData | TokenValue | string | undefined =
    obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as TokenData)[part];
    } else {
      current = undefined;
      break;
    }
  }
  if (current !== undefined) {
    return current as TokenValue | TokenData | string;
  }

  // If direct lookup failed, try searching within each category
  // This handles references like {color.primitive.neutral.500} when tokens are stored as:
  // { colors: { color: { primitive: { neutral: { 500: ... } } } } }
  for (const category of Object.keys(obj)) {
    const categoryData = (obj as TokenCollection)[category];
    if (categoryData && typeof categoryData === "object") {
      let found: TokenData | TokenValue | string | undefined = categoryData;
      let resolved = true;

      for (const part of parts) {
        if (found && typeof found === "object" && part in found) {
          found = (found as TokenData)[part];
        } else {
          resolved = false;
          break;
        }
      }

      if (resolved && found !== undefined) {
        return found as TokenValue | TokenData | string;
      }
    }
  }

  return undefined;
}

/**
 * Resolve token references like {color.primitive.neutral.500}
 */
function resolveReference(
  value: string | TokenData | TokenValue,
  allTokens: TokenCollection,
  visited: Set<string> = new Set()
): string {
  if (typeof value !== "string") {
    return String(value);
  }

  const refPattern = /\{([^}]+)\}/g;
  let resolved = value;
  let match;

  while ((match = refPattern.exec(value)) !== null) {
    const refPath = match[1];

    // Prevent circular references
    if (visited.has(refPath)) {
      console.warn(`⚠ Circular reference detected: ${refPath}`);
      continue;
    }
    visited.add(refPath);

    const refValue = getNestedValue(allTokens, refPath);
    if (refValue !== undefined) {
      const resolvedRef =
        typeof refValue === "object" && "value" in refValue
          ? resolveReference(refValue.value, allTokens, visited)
          : resolveReference(refValue, allTokens, visited);
      resolved = resolved.replace(match[0], resolvedRef);
    }
  }

  return resolved;
}

/**
 * Flatten tokens into CSS variable format
 */
function flattenTokens(
  obj: TokenData,
  prefix: string = "",
  result: CSSVariables = {},
  allTokens: TokenCollection = {}
): CSSVariables {
  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith("$")) {
      continue;
    }

    const cssVarName = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === "object") {
      if ("value" in value && typeof value.value === "string") {
        // This is a token with a value
        const resolvedValue = resolveReference(value.value, allTokens);
        result[`--${cssVarName}`] = resolvedValue;
      } else {
        // This is a nested object, recurse
        flattenTokens(value as TokenData, cssVarName, result, allTokens);
      }
    }
  }

  return result;
}

/**
 * Generate CSS custom properties
 */
function generateCSS(tokens: TokenCollection): CSSVariables {
  console.log("\n📦 Generating CSS...");

  const allTokens: TokenCollection = {};
  for (const [category, data] of Object.entries(tokens)) {
    Object.assign(allTokens, { [category]: data });
  }

  const cssVars: CSSVariables = {};

  // Don't pass category as prefix since token files already have proper top-level keys
  // e.g., colors.json has "color": {...}, typography.json has "typography": {...}
  for (const [_category, data] of Object.entries(tokens)) {
    flattenTokens(data, "", cssVars, allTokens);
  }

  // Build CSS content
  let css = `/**
 * Vaultica Design Tokens
 * Generated: ${new Date().toISOString()}
 * 
 * DO NOT EDIT DIRECTLY - Generated from /tokens/*.json
 * Run 'pnpm run build' to regenerate
 */

:root {
`;

  // Sort and add variables
  const sortedVars = Object.entries(cssVars).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  for (const [name, value] of sortedVars) {
    css += `  ${name}: ${value};\n`;
  }

  css += `}

/* Dark theme (default) */
[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
}

/* Light theme */
[data-theme="light"],
.theme-light {
  color-scheme: light;
  /* Light theme overrides would go here */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

  const outputPath = join(DIST_DIR, "theme.css");
  writeFileSync(outputPath, css);
  console.log(`✓ Generated ${outputPath}`);

  return cssVars;
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(_tokens: TokenCollection): void {
  console.log("\n📦 Generating Tailwind config...");

  const config = {
    theme: {
      extend: {
        colors: {
          vault: {
            surface: {
              primary: "var(--color-semantic-vault-surface-primary)",
              secondary: "var(--color-semantic-vault-surface-secondary)",
              tertiary: "var(--color-semantic-vault-surface-tertiary)",
            },
            border: {
              DEFAULT: "var(--color-semantic-vault-border-default)",
              strong: "var(--color-semantic-vault-border-strong)",
              subtle: "var(--color-semantic-vault-border-subtle)",
              focus: "var(--color-semantic-vault-border-focus)",
            },
            text: {
              primary: "var(--color-semantic-vault-text-primary)",
              secondary: "var(--color-semantic-vault-text-secondary)",
              tertiary: "var(--color-semantic-vault-text-tertiary)",
              accent: "var(--color-semantic-vault-text-accent)",
            },
            accent: {
              DEFAULT: "var(--color-semantic-vault-accent-default)",
              hover: "var(--color-semantic-vault-accent-hover)",
              active: "var(--color-semantic-vault-accent-active)",
              subtle: "var(--color-semantic-vault-accent-subtle)",
            },
            status: {
              success: "var(--color-semantic-vault-status-success)",
              warning: "var(--color-semantic-vault-status-warning)",
              critical: "var(--color-semantic-vault-status-critical)",
            },
          },
        },
        fontFamily: {
          primary: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "sans-serif",
          ],
          mono: [
            "JetBrains Mono",
            "SF Mono",
            "Fira Code",
            "Consolas",
            "monospace",
          ],
        },
        borderWidth: {
          DEFAULT: "2px",
          thick: "3px",
          heavy: "4px",
        },
        borderRadius: {
          sm: "0.25rem",
          DEFAULT: "0.5rem",
          lg: "0.75rem",
          xl: "1rem",
        },
        boxShadow: {
          "glow-accent": "0 0 20px oklch(55% 0.2 265 / 0.3)",
          "glow-success": "0 0 20px oklch(60% 0.15 155 / 0.3)",
          "glow-critical": "0 0 20px oklch(55% 0.2 25 / 0.3)",
        },
        transitionDuration: {
          fast: "100ms",
          normal: "200ms",
          slow: "300ms",
        },
      },
    },
  };

  const content = `/**
 * Vaultica Tailwind Configuration
 * Generated: ${new Date().toISOString()}
 * 
 * Usage: Import in your tailwind.config.js
 * 
 * const vaulticaTheme = require('./path/to/tailwind.config.js');
 * module.exports = {
 *   ...vaulticaTheme,
 *   // your overrides
 * };
 */

module.exports = ${JSON.stringify(config, null, 2)};
`;

  const outputPath = join(DIST_DIR, "tailwind.config.js");
  writeFileSync(outputPath, content);
  console.log(`✓ Generated ${outputPath}`);
}

/**
 * Generate JavaScript/TypeScript exports
 */
function generateJSExports(
  _tokens: TokenCollection,
  cssVars: CSSVariables
): void {
  console.log("\n📦 Generating JS exports...");

  // Create a cleaner token structure for JS consumption
  const jsTokens: { [key: string]: string } = {};

  for (const [name, value] of Object.entries(cssVars)) {
    const cleanName = name.replace("--", "").replace(/-/g, "_");
    jsTokens[cleanName] = value;
  }

  const content = `/**
 * Vaultica Design Tokens - JavaScript Export
 * Generated: ${new Date().toISOString()}
 * 
 * Usage:
 * import { tokens } from '@vaultica/keystone';
 * const primaryColor = tokens.color_semantic_vault_accent_default;
 */

export const tokens = ${JSON.stringify(jsTokens, null, 2)};

// CSS variable helper
export function cssVar(name) {
  return \`var(--\${name.replace(/_/g, '-')})\`;
}

// Type definitions
export type TokenName = keyof typeof tokens;

export default tokens;
`;

  const outputPath = join(DIST_DIR, "tokens.js");
  writeFileSync(outputPath, content);
  console.log(`✓ Generated ${outputPath}`);

  // Also generate TypeScript definitions
  const dtsContent = `/**
 * Vaultica Design Tokens - TypeScript Definitions
 * Generated: ${new Date().toISOString()}
 */

export declare const tokens: {
${Object.keys(jsTokens)
  .map((key) => `  ${key}: string;`)
  .join("\n")}
};

export declare function cssVar(name: TokenName): string;

export type TokenName = keyof typeof tokens;

export default tokens;
`;

  const dtsPath = join(DIST_DIR, "tokens.d.ts");
  writeFileSync(dtsPath, dtsContent);
  console.log(`✓ Generated ${dtsPath}`);
}

/**
 * Main build function
 */
function build(): void {
  console.log("🏛️  Vaultica Keystone Token Build\n");
  console.log("═".repeat(40));

  try {
    // Load tokens
    const tokens = loadTokens();

    // Generate outputs
    const cssVars = generateCSS(tokens);
    generateTailwindConfig(tokens);
    generateJSExports(tokens, cssVars);

    console.log("\n═".repeat(40));
    console.log("✅ Build complete!\n");
    console.log("Output files:");
    console.log("  - dist/theme.css");
    console.log("  - dist/tailwind.config.js");
    console.log("  - dist/tokens.js");
    console.log("  - dist/tokens.d.ts");
  } catch (error) {
    console.error(
      "\n❌ Build failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

// Run build
build();
