#!/usr/bin/env npx tsx
/**
 * Vaultica Keystone Token Hash Verifier
 *
 * Creates and verifies a hash of the built design tokens to detect changes.
 * This ensures that token changes are explicitly acknowledged in version control.
 *
 * Usage (in consumer project's package.json):
 *   "check:tokens": "tsx vaultica-keystone/scripts/verify-token-hash.ts"
 *   "check:tokens:update": "tsx vaultica-keystone/scripts/verify-token-hash.ts --update"
 *
 * Options:
 *   --update    Update the stored hash with current token hash
 *   --dir PATH  Custom path to keystone directory
 *   --hash PATH Custom path to hash file (defaults to .keystone-hash in project root)
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

const customDir =
  dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : null;
const customHashFile =
  hashIndex !== -1 && args[hashIndex + 1] ? args[hashIndex + 1] : null;

// When run from consumer project, keystone is the parent of scripts/
const KEYSTONE_PATH = customDir ? resolve(customDir) : join(__dirname, "..");
const KEYSTONE_DIST = join(KEYSTONE_PATH, "dist");

// Hash file defaults to project root (parent of keystone directory)
const HASH_FILE = customHashFile
  ? resolve(customHashFile)
  : join(KEYSTONE_PATH, "..", ".keystone-hash");

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
  console.log(`   File: ${HASH_FILE}`);
  console.log("");
  console.log("   Don't forget to commit the hash file:");
  console.log(
    '   git add .keystone-hash && git commit -m "chore: update keystone token hash"'
  );
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
    console.log(
      '   git add .keystone-hash && git commit -m "chore: add keystone token hash"'
    );
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
