#!/usr/bin/env node
/**
 * Keystone Version Check Script
 *
 * Verifies that the keystone submodule is up to date with remote.
 * Use this in consumer projects to ensure they're using latest tokens.
 *
 * Usage (in consumer project):
 *   node vaultica-keystone/scripts/check-keystone-version.js
 *   node vaultica-keystone/scripts/check-keystone-version.js --dir ../vaultica-keystone
 *
 * Exit codes:
 *   0 - Up to date
 *   1 - Outdated or error
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Parse command line arguments
const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const customDir =
  dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : null;

// Determine keystone path
const KEYSTONE_PATH = customDir
  ? path.resolve(customDir)
  : path.join(__dirname, "..");

function getLocalVersion() {
  const pkgPath = path.join(KEYSTONE_PATH, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error(
      "❌ Keystone not found at:",
      KEYSTONE_PATH,
      "\n   Run: git submodule update --init"
    );
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

function getRemoteVersion() {
  try {
    execSync("git fetch origin main", {
      cwd: KEYSTONE_PATH,
      stdio: "pipe",
    });

    const remoteContent = execSync("git show origin/main:package.json", {
      cwd: KEYSTONE_PATH,
      encoding: "utf8",
    });
    return JSON.parse(remoteContent).version;
  } catch {
    return null;
  }
}

function getLocalCommit() {
  try {
    return execSync("git rev-parse HEAD", {
      cwd: KEYSTONE_PATH,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
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

function checkBuiltTokens() {
  const distPath = path.join(KEYSTONE_PATH, "dist");
  const requiredFiles = ["theme.css", "tailwind.config.js", "tokens.js"];

  const missing = requiredFiles.filter(
    (f) => !fs.existsSync(path.join(distPath, f))
  );

  if (missing.length > 0) {
    console.warn("⚠️  Missing built tokens:", missing.join(", "));
    console.warn("   Run: cd vaultica-keystone && pnpm run build\n");
    return false;
  }
  return true;
}

function checkVersion() {
  console.log("🔍 Checking Vaultica Keystone version...\n");
  console.log("   Path:", KEYSTONE_PATH, "\n");

  const localVersion = getLocalVersion();
  const remoteVersion = getRemoteVersion();
  const localCommit = getLocalCommit();
  const remoteCommit = getRemoteCommit();

  console.log(`   Local version:  ${localVersion}`);
  console.log(`   Remote version: ${remoteVersion || "unknown"}`);

  if (localCommit) {
    console.log(`   Local commit:   ${localCommit.slice(0, 8)}`);
  }
  if (remoteCommit) {
    console.log(`   Remote commit:  ${remoteCommit.slice(0, 8)}`);
  }
  console.log("");

  // Check if built tokens exist
  const hasBuiltTokens = checkBuiltTokens();

  // Check if behind remote
  if (remoteCommit && localCommit && localCommit !== remoteCommit) {
    console.error("❌ Keystone is outdated!\n");
    console.error("   Run the following commands to update:");
    console.error("   git submodule update --remote vaultica-keystone");
    console.error("   cd vaultica-keystone && pnpm run build && cd ..");
    console.error("   git add vaultica-keystone");
    console.error("   git commit -m 'chore: update keystone to latest'\n");

    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  if (!hasBuiltTokens) {
    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  console.log("✅ Keystone is up to date!\n");
  return true;
}

// Run check
const isUpToDate = checkVersion();
process.exit(isUpToDate ? 0 : 1);
