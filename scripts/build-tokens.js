/**
 * Vaultica Keystone - Token Build Script
 *
 * Transforms JSON design tokens into consumable formats:
 * - CSS custom properties
 * - Tailwind CSS config
 * - JavaScript/TypeScript exports
 *
 * Usage: node scripts/build-tokens.js
 */

const fs = require("fs");
const path = require("path");

// Paths
const TOKENS_DIR = path.join(__dirname, "..", "tokens");
const DIST_DIR = path.join(__dirname, "..", "dist");

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Load all token files
 */
function loadTokens() {
  const tokenFiles = [
    "colors.json",
    "typography.json",
    "effects.json",
    "spacing.json",
    "semantic.json",
  ];
  const tokens = {};

  for (const file of tokenFiles) {
    const filePath = path.join(TOKENS_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(content);
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
 * Resolve token references like {color.primitive.neutral.500}
 */
function resolveReference(value, allTokens, visited = new Set()) {
  if (typeof value !== "string") return value;

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
        typeof refValue === "object" && refValue.value
          ? resolveReference(refValue.value, allTokens, visited)
          : resolveReference(refValue, allTokens, visited);
      resolved = resolved.replace(match[0], resolvedRef);
    }
  }

  return resolved;
}

/**
 * Get nested object value by dot path
 */
function getNestedValue(obj, path) {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Flatten tokens into CSS variable format
 */
function flattenTokens(obj, prefix = "", result = {}, allTokens = {}) {
  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith("$")) continue;

    const cssVarName = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === "object") {
      if ("value" in value) {
        // This is a token with a value
        const resolvedValue = resolveReference(value.value, allTokens);
        result[`--${cssVarName}`] = resolvedValue;
      } else {
        // This is a nested object, recurse
        flattenTokens(value, cssVarName, result, allTokens);
      }
    }
  }

  return result;
}

/**
 * Generate CSS custom properties
 */
function generateCSS(tokens) {
  console.log("\n📦 Generating CSS...");

  const allTokens = {};
  for (const [category, data] of Object.entries(tokens)) {
    Object.assign(allTokens, { [category]: data });
  }

  const cssVars = {};

  for (const [category, data] of Object.entries(tokens)) {
    flattenTokens(
      data,
      category === "colors" ? "" : category,
      cssVars,
      allTokens
    );
  }

  // Build CSS content
  let css = `/**
 * Vaultica Design Tokens
 * Generated: ${new Date().toISOString()}
 * 
 * DO NOT EDIT DIRECTLY - Generated from /tokens/*.json
 * Run 'npm run build' to regenerate
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

  const outputPath = path.join(DIST_DIR, "theme.css");
  fs.writeFileSync(outputPath, css);
  console.log(`✓ Generated ${outputPath}`);

  return cssVars;
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(tokens) {
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

  const outputPath = path.join(DIST_DIR, "tailwind.config.js");
  fs.writeFileSync(outputPath, content);
  console.log(`✓ Generated ${outputPath}`);
}

/**
 * Generate JavaScript/TypeScript exports
 */
function generateJSExports(tokens, cssVars) {
  console.log("\n📦 Generating JS exports...");

  // Create a cleaner token structure for JS consumption
  const jsTokens = {};

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

  const outputPath = path.join(DIST_DIR, "tokens.js");
  fs.writeFileSync(outputPath, content);
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

  const dtsPath = path.join(DIST_DIR, "tokens.d.ts");
  fs.writeFileSync(dtsPath, dtsContent);
  console.log(`✓ Generated ${dtsPath}`);
}

/**
 * Main build function
 */
function build() {
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
    console.error("\n❌ Build failed:", error.message);
    process.exit(1);
  }
}

// Run build
build();
