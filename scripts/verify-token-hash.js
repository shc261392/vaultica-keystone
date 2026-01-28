#!/usr/bin/env node
/**
 * Token Hash Verification Script
 *
 * Creates a SHA-256 hash of built tokens to detect changes.
 * Use this in consumer projects to ensure tokens match expectations.
 *
 * Usage:
 *   node scripts/verify-token-hash.js          # Verify hash
 *   node scripts/verify-token-hash.js --update # Update hash file
 *   node scripts/verify-token-hash.js --create # Create initial hash
 *
 * Expects a .keystone-hash file in the consumer project root.
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Parse arguments
const args = process.argv.slice(2);
const shouldUpdate = args.includes("--update");
const shouldCreate = args.includes("--create");

// Paths - adjust for consumer project usage
const SCRIPT_DIR = __dirname;
const IS_IN_KEYSTONE = SCRIPT_DIR.includes("vaultica-keystone");

// When run from consumer project, keystone is a subdirectory
const PROJECT_ROOT = IS_IN_KEYSTONE
  ? path.join(SCRIPT_DIR, "..")
  : process.cwd();

const KEYSTONE_PATH = IS_IN_KEYSTONE
  ? path.join(SCRIPT_DIR, "..")
  : path.join(process.cwd(), "vaultica-keystone");

const KEYSTONE_DIST = path.join(KEYSTONE_PATH, "dist");
const HASH_FILE = path.join(PROJECT_ROOT, ".keystone-hash");

function calculateHash() {
  const files = ["theme.css", "tailwind.config.js", "tokens.js", "tokens.d.ts"];

  let content = "";
  for (const file of files) {
    const filePath = path.join(KEYSTONE_DIST, file);
    if (fs.existsSync(filePath)) {
      content += fs.readFileSync(filePath, "utf8");
    }
  }

  if (!content) {
    console.error("❌ No token files found in:", KEYSTONE_DIST);
    console.error("   Run: cd vaultica-keystone && pnpm run build");
    process.exit(1);
  }

  return crypto.createHash("sha256").update(content).digest("hex");
}

function updateHash() {
  const hash = calculateHash();
  fs.writeFileSync(HASH_FILE, hash + "\n");
  console.log("✅ Hash updated");
  console.log(`   File: ${HASH_FILE}`);
  console.log(`   Hash: ${hash.slice(0, 16)}...`);
  console.log("");
  console.log("   Don't forget to commit this file:");
  console.log("   git add .keystone-hash");
  console.log("   git commit -m 'chore: update keystone token hash'");
}

function verify() {
  console.log("🔍 Verifying Keystone token hash...\n");

  const currentHash = calculateHash();

  if (!fs.existsSync(HASH_FILE)) {
    if (shouldCreate) {
      console.log("📝 Creating initial token hash...");
      fs.writeFileSync(HASH_FILE, currentHash + "\n");
      console.log(`   Hash: ${currentHash.slice(0, 16)}...`);
      console.log("✅ Hash file created");
      return true;
    }

    console.error("❌ Hash file not found:", HASH_FILE);
    console.error("");
    console.error("   Create it with:");
    console.error("   node scripts/verify-token-hash.js --create");
    console.error("   git add .keystone-hash");
    console.error("   git commit -m 'chore: add keystone token hash'");

    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  const storedHash = fs.readFileSync(HASH_FILE, "utf8").trim();

  console.log(`   Stored:  ${storedHash.slice(0, 16)}...`);
  console.log(`   Current: ${currentHash.slice(0, 16)}...`);
  console.log("");

  if (currentHash !== storedHash) {
    console.error("❌ Token hash mismatch!");
    console.error("");
    console.error(
      "   The keystone tokens have changed since last verification."
    );
    console.error("   This may indicate:");
    console.error("   - Keystone was updated but hash wasn't");
    console.error("   - Local token modifications");
    console.error("   - Build output differs");
    console.error("");
    console.error("   To accept the new tokens:");
    console.error("   node scripts/verify-token-hash.js --update");
    console.error("   git add .keystone-hash");
    console.error("   git commit -m 'chore: update keystone token hash'");

    if (process.env.CI) {
      process.exit(1);
    }
    return false;
  }

  console.log("✅ Token hash verified\n");
  return true;
}

// Main execution
if (shouldUpdate) {
  updateHash();
} else {
  const isValid = verify();
  process.exit(isValid ? 0 : 1);
}
