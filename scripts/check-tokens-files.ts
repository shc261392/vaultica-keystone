#!/usr/bin/env tsx
/**
 * Vaultica Keystone - Token files check
 *
 * 1. Every tokens/*.json parses as JSON.
 * 2. Every required token / AI context file exists.
 *
 * Replaces the former CI steps "Check JSON syntax" and "Check required files".
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TOKENS_DIR = 'tokens';

const REQUIRED_FILES = [
  'tokens/colors.json',
  'tokens/typography.json',
  'tokens/effects.json',
  'tokens/spacing.json',
  'tokens/semantic.json',
  'ai/brand-context.md',
  'ai/personality.md',
];

let failed = false;

for (const name of readdirSync(TOKENS_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()) {
  const file = join(TOKENS_DIR, name);
  try {
    JSON.parse(readFileSync(file, 'utf8'));
    console.log(`✓ Valid JSON: ${file}`);
  } catch (error) {
    console.error(`❌ Invalid JSON: ${file} (${(error as Error).message})`);
    failed = true;
  }
}

for (const file of REQUIRED_FILES) {
  if (existsSync(file)) {
    console.log(`✓ Found ${file}`);
  } else {
    console.error(`❌ Missing required file: ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('✅ Token files check passed');
