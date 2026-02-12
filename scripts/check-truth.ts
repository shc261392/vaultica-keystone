#!/usr/bin/env tsx
import { execSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TRUTH_DIR = 'docs/truth';

interface SourceInfo {
  file: string;
  lastVerified: Date;
  commit: string;
}

function parseSourcesSection(content: string): SourceInfo | null {
  const match = content.match(
    /## Sources[\s\S]*?\*\*Last Verified:\*\*\s*(\S+)[\s\S]*?\*\*Commit:\*\*\s*(\S+)/
  );
  if (!match) return null;
  return {
    file: '',
    lastVerified: new Date(match[1]),
    commit: match[2],
  };
}

function getFileModTime(filePath: string): Date {
  const result = execSync(`git log -1 --format="%aI" -- "${filePath}"`, {
    encoding: 'utf-8',
  }).trim();
  return result ? new Date(result) : new Date(0);
}

function main() {
  const files = readdirSync(TRUTH_DIR).filter((f) => f.endsWith('.md'));
  let hasErrors = false;

  for (const file of files) {
    const filePath = join(TRUTH_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    const sources = parseSourcesSection(content);

    if (!sources) {
      console.error(`❌ ${file}: Missing ## Sources section`);
      hasErrors = true;
      continue;
    }

    // Extract source files from table
    const tableMatch = content.match(/\| File \| Description \|[\s\S]*?(?=\n\n|\n##|$)/);
    if (tableMatch) {
      const rows = tableMatch[0].split('\n').slice(2);
      for (const row of rows) {
        const fileMatch = row.match(/\|\s*([^|]+)\s*\|/);
        if (fileMatch) {
          const sourceFile = fileMatch[1].trim();
          if (sourceFile && !sourceFile.startsWith('-')) {
            const modTime = getFileModTime(sourceFile);
            if (modTime > sources.lastVerified) {
              console.error(`❌ ${file}: Source "${sourceFile}" modified after verification`);
              hasErrors = true;
            }
          }
        }
      }
    }
  }

  if (hasErrors) {
    console.error('\n⚠️  Some truth documents need updating');
    process.exit(1);
  } else {
    console.log('✅ All truth documents are up-to-date');
  }
}

main();
