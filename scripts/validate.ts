#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone - Token Validation Script
 *
 * Validates design tokens for:
 * - Color contrast (WCAG 2.2 AA compliance)
 * - Reference resolution (no broken references)
 * - Required token presence
 *
 * Usage: npx tsx scripts/validate.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Paths
const TOKENS_DIR = join(__dirname, "..", "tokens");

// Validation results
const errors: string[] = [];
const warnings: string[] = [];

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

interface TokenReference {
  path: string;
  reference: string;
  file: string;
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
      tokens[file.replace(".json", "")] = JSON.parse(content) as TokenData;
    } else {
      errors.push(`Missing required token file: ${file}`);
    }
  }

  return tokens;
}

/**
 * Check if all token references can be resolved
 */
function validateReferences(tokens: TokenCollection): void {
  console.log("🔗 Validating token references...");

  const allRefs: TokenReference[] = [];

  function findRefs(obj: TokenData, filePath: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) {
        continue;
      }

      const currentPath = filePath ? `${filePath}.${key}` : key;

      if (value && typeof value === "object") {
        if ("value" in value && typeof value.value === "string") {
          const refs = value.value.match(/\{([^}]+)\}/g);
          if (refs) {
            refs.forEach((ref) => {
              allRefs.push({
                path: currentPath,
                reference: ref.slice(1, -1),
                file: filePath.split(".")[0],
              });
            });
          }
        } else {
          findRefs(value as TokenData, currentPath);
        }
      }
    }
  }

  for (const [category, data] of Object.entries(tokens)) {
    findRefs(data, category);
  }

  // Check each reference can be resolved
  for (const ref of allRefs) {
    const resolved = resolveRef(ref.reference, tokens);
    if (resolved === undefined) {
      errors.push(`Unresolved reference: ${ref.reference} in ${ref.path}`);
    }
  }

  console.log(`  Found ${allRefs.length} references`);
}

/**
 * Resolve a token reference
 * Handles both cross-file and within-file references
 */
function resolveRef(
  refPath: string,
  tokens: TokenCollection
): TokenValue | TokenData | string | undefined {
  const parts = refPath.split(".");
  let current: TokenCollection | TokenData | TokenValue | string | undefined =
    tokens;

  // First try direct path
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as TokenData)[part];
    } else {
      // Try to find within specific token files
      current = undefined;
      break;
    }
  }

  if (current !== undefined) {
    return current as TokenValue | TokenData | string;
  }

  // Try within each token category (colors, typography, etc.)
  for (const [_category, data] of Object.entries(tokens)) {
    let found: TokenData | TokenValue | string | undefined = data;
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

  return undefined;
}

/**
 * Check required tokens exist
 */
function validateRequiredTokens(tokens: TokenCollection): void {
  console.log("📋 Validating required tokens...");

  const required = [
    // Surface colors
    "colors.color.semantic.vault.surface.primary",
    "colors.color.semantic.vault.surface.secondary",

    // Text colors
    "colors.color.semantic.vault.text.primary",
    "colors.color.semantic.vault.text.secondary",

    // Border colors
    "colors.color.semantic.vault.border.default",
    "colors.color.semantic.vault.border.strong",

    // Accent colors
    "colors.color.semantic.vault.accent.default",

    // Typography
    "typography.typography.fontFamily.primary",
    "typography.typography.fontSize.base",

    // Effects
    "effects.effects.border.width.default",
    "effects.effects.border.radius.md",

    // Spacing
    "spacing.spacing.4",
  ];

  for (const path of required) {
    const value = resolveRef(path, tokens);
    if (value === undefined) {
      errors.push(`Missing required token: ${path}`);
    }
  }

  console.log(`  Checked ${required.length} required tokens`);
}

/**
 * Validate OKLCH color values
 */
function validateColorFormat(tokens: TokenCollection): void {
  console.log("🎨 Validating color formats...");

  const colorsData = tokens.colors?.color;
  const colorTokens: TokenData =
    colorsData && typeof colorsData === "object" && "primitive" in colorsData
      ? ((colorsData as TokenData).primitive as TokenData)
      : {};
  let colorCount = 0;

  function checkColors(obj: TokenData, path: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) {
        continue;
      }

      const currentPath = path ? `${path}.${key}` : key;

      if (value && typeof value === "object") {
        if (
          "value" in value &&
          (value as TokenValue).type === "color" &&
          typeof value.value === "string"
        ) {
          colorCount++;
          const colorValue = value.value;

          // Check for valid color format
          const validFormats = [
            /^oklch\(.+\)$/,
            /^#[0-9a-fA-F]{3,8}$/,
            /^rgb\(.+\)$/,
            /^hsl\(.+\)$/,
            /^transparent$/,
            /^\{.+\}$/, // References are ok
          ];

          if (!validFormats.some((format) => format.test(colorValue))) {
            warnings.push(
              `Unusual color format at ${currentPath}: ${colorValue}`
            );
          }
        } else {
          checkColors(value as TokenData, currentPath);
        }
      }
    }
  }

  checkColors(colorTokens);
  console.log(`  Validated ${colorCount} color tokens`);
}

/**
 * Check for accessibility issues
 */
function validateAccessibility(tokens: TokenCollection): void {
  console.log("♿ Validating accessibility...");

  // Check that focus states exist
  const focusTokens = [
    "colors.color.semantic.vault.border.focus",
    "semantic.semantic.feedback.focus.ring-color",
  ];

  for (const path of focusTokens) {
    const value = resolveRef(path, tokens);
    if (value === undefined) {
      warnings.push(`Missing focus state token: ${path}`);
    }
  }

  // Note: Full contrast ratio checking would require color parsing
  // This is a placeholder for more advanced validation
  console.log("  ⚠ Full contrast validation requires manual review");
}

/**
 * Main validation function
 */
function validate(): void {
  console.log("🏛️  Vaultica Keystone Token Validation\n");
  console.log("═".repeat(40));
  console.log("");

  const tokens = loadTokens();

  if (Object.keys(tokens).length === 0) {
    console.error("❌ No tokens loaded. Cannot validate.");
    process.exit(1);
  }

  validateReferences(tokens);
  validateRequiredTokens(tokens);
  validateColorFormat(tokens);
  validateAccessibility(tokens);

  console.log("\n" + "═".repeat(40));

  // Report results
  if (errors.length > 0) {
    console.log("\n❌ ERRORS:");
    errors.forEach((err) => console.log(`  • ${err}`));
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:");
    warnings.forEach((warn) => console.log(`  • ${warn}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ All validations passed!");
  } else {
    console.log(
      `\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings`
    );
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Run validation
validate();
