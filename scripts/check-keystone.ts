#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone Version Checker
 *
 * Verifies that the keystone submodule is up to date and tokens are built.
 * Run this script before builds to ensure design token consistency.
 *
 * Usage (in consumer project's package.json):
 *   "check:keystone": "tsx vaultica-keystone/scripts/check-keystone.ts"
 *
 * Or with custom keystone path:
 *   tsx vaultica-keystone/scripts/check-keystone.ts --dir ./custom-keystone
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
const customDir =
  dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : null;

// When run from consumer project, keystone is the parent of scripts/
const KEYSTONE_PATH = customDir ? resolve(customDir) : join(__dirname, "..");
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
      message:
        "Keystone submodule not found. Run: git submodule update --init --recursive",
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
  console.log(
    `   Remote commit:  ${remoteCommit ? remoteCommit.slice(0, 8) : "unknown"}`
  );

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
  console.log(`   Path:           ${KEYSTONE_PATH}`);

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
