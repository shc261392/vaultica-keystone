#!/usr/bin/env node
// TRUTH_VERSION: 1.0.1
// Canonical copy: vaultica-keystone/tools/truth/truth.mjs. Every repo carries a byte-identical
// copy at scripts/truth.mjs (see tools/truth/sync.sh). Do not edit repo copies by hand.
//
// Keeps docs/truth/* in sync with code. Zero dependencies, Node >= 24 ESM.
// Data: docs/truth/manifest.json (hand-edited) + docs/truth/truth.lock.json (tool-owned).
// Fingerprints are git blob OIDs, so uncommitted / staged / committed all use one format.

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// path.matchesGlob is experimental and prints a warning on stderr; keep hooks quiet.
process.removeAllListeners('warning');

export const TRUTH_VERSION = '1.0.1';
const MANIFEST = 'docs/truth/manifest.json';
const LOCK = 'docs/truth/truth.lock.json';
const STATE_FILE = 'truth-hook-state.json';
const GEN_RE = /<!--\s*truth:gen\s*-->[\s\S]*?<!--\s*\/truth:gen\s*-->/g;

let ROOT = process.cwd();

class UsageError extends Error {}

// ---------------------------------------------------------------- git helpers

function git(args, opts = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
    ...opts,
  });
}

function setRoot(dir) {
  try {
    ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw new UsageError(`not inside a git repository: ${dir}`);
  }
}

function gitDir() {
  return git(['rev-parse', '--absolute-git-dir']).trim();
}

const abs = (p) => path.join(ROOT, p);
// A literal path always matches itself: SvelteKit-style `[slug]` segments are glob character
// classes to matchesGlob, so an exact string comparison must come first.
const globMatch = (p, g) => p === g || path.matchesGlob(p, g);
const matches = (p, globs) => globs.some((g) => globMatch(p, g));

function readJson(file, fallback) {
  const f = abs(file);
  if (!existsSync(f)) return fallback;
  try {
    return JSON.parse(readFileSync(f, 'utf8'));
  } catch (e) {
    throw new UsageError(`${file}: invalid JSON (${e.message})`);
  }
}

function sortObj(o) {
  return Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

// ---------------------------------------------------------------- data loading

function loadManifest() {
  const m = readJson(MANIFEST, null);
  if (!m) throw new UsageError(`${MANIFEST} not found (create it, or run: import)`);
  if (m.version !== 1 || typeof m.docs !== 'object') {
    throw new UsageError(`${MANIFEST}: expected { "version": 1, "docs": {...} }`);
  }
  m.watch ??= [];
  for (const [doc, e] of Object.entries(m.docs)) {
    if (!Array.isArray(e.sources) || e.sources.length === 0) {
      throw new UsageError(`${MANIFEST}: ${doc} needs a non-empty "sources" array`);
    }
    e.exclude ??= [];
    e.severity ??= 'block';
    if (e.severity !== 'block' && e.severity !== 'warn') {
      throw new UsageError(`${MANIFEST}: ${doc} severity must be "block" or "warn"`);
    }
    if (e.reviewEvery && !/^\d+d$/.test(e.reviewEvery)) {
      throw new UsageError(`${MANIFEST}: ${doc} reviewEvery must look like "90d"`);
    }
  }
  return m;
}

function loadLock(staged) {
  if (staged) {
    try {
      return JSON.parse(git(['show', `:${LOCK}`]));
    } catch {
      return { version: 1, docs: {} };
    }
  }
  return readJson(LOCK, { version: 1, docs: {} });
}

function saveLock(lock) {
  const out = { version: 1, docs: sortObj(lock.docs) };
  for (const d of Object.keys(out.docs)) {
    out.docs[d] = { ...out.docs[d], files: sortObj(out.docs[d].files) };
  }
  mkdirSync(path.dirname(abs(LOCK)), { recursive: true });
  writeFileSync(abs(LOCK), `${JSON.stringify(out, null, 2)}\n`);
}

function docBody(text) {
  return text.replace(/\r\n/g, '\n').replace(GEN_RE, '').trim();
}
const hashStr = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const docHashOf = (doc) => hashStr(docBody(readFileSync(abs(doc), 'utf8')));

// ---------------------------------------------------------------- file universe

function nulSplit(s) {
  return s.split('\0').filter(Boolean);
}

function headMap() {
  const m = new Map();
  try {
    for (const rec of nulSplit(git(['ls-tree', '-r', '-z', 'HEAD']))) {
      const tab = rec.indexOf('\t');
      m.set(rec.slice(tab + 1), rec.slice(0, tab).split(' ')[2]);
    }
  } catch {
    // no commits yet
  }
  return m;
}

/** Map path -> oid for tracked + untracked-not-ignored files (work) or index entries (staged). */
function universe(staged, wanted) {
  const out = new Map();
  if (staged) {
    for (const rec of nulSplit(git(['ls-files', '-s', '-z']))) {
      const tab = rec.indexOf('\t');
      const [mode, oid, stage] = rec.slice(0, tab).split(' ');
      if (stage !== '0' || mode === '160000') continue;
      const p = rec.slice(tab + 1);
      if (wanted(p)) out.set(p, oid);
    }
    return out;
  }
  const paths = [...new Set(nulSplit(git(['ls-files', '-co', '--exclude-standard', '-z'])))].filter(
    (p) => wanted(p) && existsSync(abs(p)) && statSync(abs(p)).isFile(),
  );
  if (paths.length) {
    const oids = git(['hash-object', '--stdin-paths'], { input: `${paths.join('\n')}\n` })
      .trim()
      .split('\n');
    paths.forEach((p, i) => {
      out.set(p, oids[i]);
    });
  }
  return out;
}

// ---------------------------------------------------------------- check engine

function compute({ staged = false, dirty = false } = {}) {
  const manifest = loadManifest();
  const lock = loadLock(staged);
  const docs = Object.entries(manifest.docs);
  const allGlobs = [...manifest.watch, ...docs.flatMap(([, e]) => e.sources)];
  const files = universe(staged, (p) => matches(p, allGlobs));
  const head = headMap();
  const isDirty = (p, cur) => (cur ?? null) !== (head.get(p) ?? null);
  const warnings = [];
  const results = [];
  const mappedPaths = new Set();

  for (const [doc, e] of docs) {
    if (!staged && !existsSync(abs(doc))) throw new UsageError(`${MANIFEST}: doc not found: ${doc}`);
    const matched = new Map();
    for (const [p, oid] of files) {
      if (matches(p, e.sources) && !matches(p, e.exclude)) matched.set(p, oid);
    }
    for (const p of matched.keys()) mappedPaths.add(p);
    for (const g of e.sources) {
      if (![...files.keys()].some((p) => globMatch(p, g))) {
        warnings.push(`${doc}: source glob matches no files: ${g}`);
      }
    }
    const entry = lock.docs?.[doc];
    const changed = [];
    if (entry) {
      for (const [p, oid] of matched) {
        if (!(p in entry.files)) changed.push({ path: p, status: 'new', cur: oid });
        else if (entry.files[p] !== oid) changed.push({ path: p, status: 'modified', cur: oid });
      }
      for (const p of Object.keys(entry.files)) {
        if (!matched.has(p)) changed.push({ path: p, status: 'removed', cur: null });
      }
    }
    for (const c of changed) c.dirty = isDirty(c.path, c.cur);
    let expired = false;
    if (entry && e.reviewEvery) {
      const days = Number.parseInt(e.reviewEvery, 10);
      expired = Date.now() - Date.parse(entry.verifiedAt) > days * 86_400_000;
    }
    const unverified = !entry;
    let stale = unverified || changed.length > 0 || expired;
    if (dirty && !changed.some((c) => c.dirty)) stale = false;
    // Pre-commit: an unlocked doc only blocks a commit that actually touches its sources.
    if (staged && unverified && ![...matched].some(([p, oid]) => isDirty(p, oid))) stale = false;
    const sections = Object.entries(e.sections ?? {})
      .filter(([, globs]) => changed.some((c) => matches(c.path, globs)))
      .map(([name]) => name);
    results.push({ doc, severity: e.severity, stale, unverified, expired, changed, sections, matched });
  }

  const unmapped = [];
  const docSet = new Set([...docs.map(([d]) => d), MANIFEST, LOCK]);
  for (const [p, cur] of files) {
    if (docSet.has(p) || mappedPaths.has(p) || !matches(p, manifest.watch)) continue;
    if (isDirty(p, cur)) unmapped.push(p);
  }
  return { results, unmapped, warnings, manifest };
}

const runner = () => (existsSync(abs('pnpm-lock.yaml')) ? 'pnpm truth' : 'npm run truth --');

function fixCmd(r) {
  return `${runner()} stamp ${r.doc} --reason "<what changed>"`;
}

function describe(r) {
  const parts = [];
  if (r.unverified) parts.push('UNVERIFIED: no lock entry (read the doc against its sources, then stamp)');
  const tag = (c) => {
    const st = c.status === 'new' ? 'new' : c.status;
    return `${c.path} (${st}${c.dirty ? ', uncommitted' : ''})`;
  };
  if (r.changed.length) parts.push(`changed: ${r.changed.map(tag).join(' | ')}`);
  if (r.expired) parts.push('review interval elapsed (reviewEvery)');
  return parts;
}

function render(res, { json }) {
  const stale = res.results.filter((r) => r.stale);
  if (json) {
    return JSON.stringify(
      {
        stale: stale.map((r) => ({
          doc: r.doc,
          severity: r.severity,
          unverified: r.unverified,
          changed: r.changed.map((c) => ({ path: c.path, status: c.status, uncommitted: c.dirty })),
          sections: r.sections,
          fix: fixCmd(r),
        })),
        unmapped: res.unmapped,
        warnings: res.warnings,
      },
      null,
      2,
    );
  }
  const lines = [];
  for (const r of stale) {
    lines.push(`${r.severity === 'block' ? 'STALE' : 'STALE (warn)'} ${r.doc}`);
    for (const p of describe(r)) lines.push(`  ${p}`);
    if (r.sections.length) lines.push(`  sections: ${r.sections.map((s) => `"${s}"`).join(', ')}`);
    lines.push(`  FIX: edit the doc to match the code, then: ${fixCmd(r)}`);
  }
  if (res.unmapped.length) {
    lines.push(`UNMAPPED (watched but no doc maps them): ${res.unmapped.join(', ')}`);
  }
  for (const w of res.warnings) lines.push(`WARN ${w}`);
  if (!stale.length) lines.unshift(`truth: ${res.results.length} doc(s) current`);
  return lines.join('\n');
}

function cmdCheck(flags) {
  const res = compute({ staged: !!flags.staged, dirty: !!flags.dirty });
  const out = render(res, { json: !!flags.json });
  if (out) console.log(out);
  const blocking = res.results.some((r) => r.stale && r.severity === 'block');
  return blocking ? 1 : 0;
}

// ---------------------------------------------------------------- stamp / init

function writeEntry(res, r, last) {
  const lock = loadLock(false);
  lock.docs ??= {};
  lock.docs[r.doc] = {
    docHash: docHashOf(r.doc),
    verifiedAt: new Date().toISOString(),
    files: Object.fromEntries(r.matched),
    last,
  };
  saveLock(lock);
}

function cmdStamp(args, flags) {
  const [doc] = args;
  if (!doc || args.length > 1) throw new UsageError('usage: stamp <doc> --reason "<text>" [--unchanged "<why>"]');
  const reason = typeof flags.reason === 'string' ? flags.reason.trim() : '';
  const res = compute();
  const r = res.results.find((x) => x.doc === doc);
  if (!r) throw new UsageError(`${doc} has no entry in ${MANIFEST}`);
  if (!r.stale) {
    console.error(`REFUSED: ${doc} is not stale; nothing to stamp.`);
    return 1;
  }
  if (reason.length < 20) {
    console.error('REFUSED: --reason must be at least 20 characters describing what you changed or verified.');
    return 1;
  }
  const prev = loadLock(false).docs?.[doc];
  const unchanged = typeof flags.unchanged === 'string' ? flags.unchanged.trim() : '';
  if (prev && prev.docHash === docHashOf(doc)) {
    const names = r.changed.map((c) => path.basename(c.path));
    const ok =
      unchanged.length >= 20 && (names.length === 0 || names.some((n) => unchanged.includes(n)));
    if (!ok) {
      console.error(
        `REFUSED: the doc text is unchanged since the last stamp. Either update ${doc}, or pass ` +
          '--unchanged "<why the prose is still true>" (>= 20 chars) naming at least one changed ' +
          `file${names.length ? ` (${names.join(', ')})` : ''}.`,
      );
      return 1;
    }
  }
  writeEntry(res, r, {
    changed: r.changed.map((c) => c.path),
    reason,
    ...(unchanged ? { unchanged } : {}),
  });
  console.log(`stamped ${doc}`);
  return 0;
}

function cmdInit(args, flags) {
  const [doc] = args;
  if (!doc) throw new UsageError('usage: init <doc> [--reason "<text>"]');
  const res = compute();
  const r = res.results.find((x) => x.doc === doc);
  if (!r) throw new UsageError(`${doc} has no entry in ${MANIFEST}`);
  if (loadLock(false).docs?.[doc]) {
    console.error(`REFUSED: ${doc} already has a lock entry; use stamp.`);
    return 1;
  }
  const reason = typeof flags.reason === 'string' && flags.reason ? flags.reason : 'baseline (init)';
  writeEntry(res, r, { changed: [], reason });
  console.log(`initialised ${doc} (${r.matched.size} source file(s))`);
  return 0;
}

// ---------------------------------------------------------------- import (legacy migration)

const SOURCES_HEAD = /^##\s+Sources?\s*$/i;

function parseLegacySources(text) {
  const out = [];
  let inSec = false;
  let headerSeen = false;
  for (const line of text.split(/\r?\n/)) {
    if (SOURCES_HEAD.test(line)) {
      inSec = true;
      continue;
    }
    if (inSec && /^##\s+/.test(line)) break;
    if (!inSec) continue;
    if (/^\s*\|/.test(line)) {
      if (!headerSeen) {
        headerSeen = true;
        continue;
      }
      if (/^\s*\|[\s:|-]+\|?\s*$/.test(line)) continue;
      const cell = line.split('|')[1]?.trim() ?? '';
      pushLegacy(out, cell);
    } else {
      const b = line.match(/^\s*[-*]\s+(.+)$/);
      if (b) pushLegacy(out, b[1].trim());
    }
  }
  return out;
}

function pushLegacy(out, cell) {
  const c = cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`/g, '')
    .trim();
  const p = c.split(/\s+/)[0];
  if (p && p !== '-' && !out.includes(p)) out.push(p);
}

function stripLegacy(text) {
  const lines = text.split('\n');
  const out = [];
  let inSec = false;
  for (const line of lines) {
    if (SOURCES_HEAD.test(line)) {
      inSec = true;
      continue;
    }
    if (inSec && /^##\s+/.test(line)) inSec = false;
    if (inSec) continue;
    if (/^\s*\*\*(Last Verified|Commit):\*\*/i.test(line)) continue;
    out.push(line);
  }
  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '')}\n`;
}

function cmdImport(flags) {
  const dir = 'docs/truth';
  if (!existsSync(abs(dir))) throw new UsageError(`${dir} not found`);
  const manifest = readJson(MANIFEST, { version: 1, watch: [], docs: {} });
  const lock = readJson(LOCK, { version: 1, docs: {} });
  const oldLock = readJson(`${dir}/.truth-lock.json`, null);
  const docs = readdirSync(abs(dir)).filter((f) => f.endsWith('.md'));
  const summary = [];
  for (const f of docs) {
    const doc = `${dir}/${f}`;
    const text = readFileSync(abs(doc), 'utf8');
    const sources = parseLegacySources(text);
    if (sources.length && !manifest.docs[doc]) {
      manifest.docs[doc] = {
        sources: sources.map((s) => (s.endsWith('/') ? `${s}**` : s)),
        exclude: [],
        severity: 'block',
      };
    }
    const entry = manifest.docs[doc];
    if (!entry) {
      summary.push(`${doc}: no Sources section found, not registered`);
      continue;
    }
    const stripped = stripLegacy(text);
    if (!lock.docs[doc]) {
      // Seed from the old SHA256 lock where content still matches the verified hash.
      const old = oldLock?.docs?.[doc];
      const files = {};
      let seeded = 0;
      if (old) {
        for (const [p, sha] of Object.entries(old.files ?? {})) {
          if (!existsSync(abs(p)) || !statSync(abs(p)).isFile()) continue;
          if (createHash('sha256').update(readFileSync(abs(p))).digest('hex') !== sha) continue;
          files[p] = git(['hash-object', p]).trim();
          seeded++;
        }
      }
      if (old) {
        lock.docs[doc] = {
          docHash: hashStr(docBody(stripped)),
          verifiedAt: old.verified,
          files,
          last: { changed: [], reason: `imported from legacy lock (${seeded} file(s) still match)` },
        };
      }
    }
    if (flags.strip) writeFileSync(abs(doc), stripped);
    summary.push(`${doc}: ${sources.length} source(s)${flags.strip ? ', stripped' : ''}`);
  }
  mkdirSync(abs(dir), { recursive: true });
  writeFileSync(abs(MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  if (Object.keys(lock.docs).length) saveLock(lock);
  console.log(`${summary.join('\n')}\nWrote ${MANIFEST}. Tune globs, then run check and audit each STALE doc.`);
  if (oldLock) console.log('Legacy .truth-lock.json was read; delete it once the new lock looks right.');
  return 0;
}

// ---------------------------------------------------------------- hooks

function readStdinJson() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    return {};
  }
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

function loadState() {
  try {
    return JSON.parse(readFileSync(path.join(gitDir(), STATE_FILE), 'utf8'));
  } catch {
    return { sessions: {} };
  }
}

function saveState(st) {
  const ids = Object.keys(st.sessions);
  for (const id of ids.slice(0, Math.max(0, ids.length - 20))) delete st.sessions[id];
  writeFileSync(path.join(gitDir(), STATE_FILE), JSON.stringify(st));
}

function relPath(p) {
  if (!p) return '';
  let full = p;
  if (path.isAbsolute(p)) {
    try {
      full = path.join(realpathSync(path.dirname(p)), path.basename(p));
    } catch {
      // parent missing: use as given
    }
  }
  const r = path.isAbsolute(full) ? path.relative(realpathSync(ROOT), full) : full;
  return r.split(path.sep).join('/');
}

function hookPost(input) {
  const rel = relPath(input.tool_input?.file_path);
  if (!rel || rel.startsWith('..')) return null;
  const manifest = loadManifest();
  const hits = Object.entries(manifest.docs).filter(
    ([doc, e]) => doc !== rel && matches(rel, e.sources) && !matches(rel, e.exclude),
  );
  if (!hits.length) return null;
  const sid = input.session_id ?? 'default';
  const st = loadState();
  const s = (st.sessions[sid] ??= {});
  s.posted ??= [];
  const fresh = hits.filter(([doc]) => !s.posted.includes(doc));
  if (!fresh.length) return null;
  s.posted.push(...fresh.map(([d]) => d));
  saveState(st);
  const msg = fresh
    .map(([doc, e]) => {
      const secs = Object.entries(e.sections ?? {})
        .filter(([, g]) => matches(rel, g))
        .map(([n]) => `"${n}"`);
      return `${rel} feeds ${doc}${secs.length ? ` (sections: ${secs.join(', ')})` : ''}`;
    })
    .join('; ');
  return {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `Truth docs: ${msg}. Update the doc to match before finishing, then ${runner()} stamp <doc> --reason "...".`,
    },
  };
}

function stripQuoted(cmd) {
  return cmd.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');
}

function hookPre(input) {
  const deny = (reason) => ({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  });
  const rel = relPath(input.tool_input?.file_path);
  if (rel === LOCK) {
    return deny(`${LOCK} is tool-owned. Use: ${runner()} stamp <doc> --reason "..."`);
  }
  const cmd = input.tool_input?.command;
  if (typeof cmd === 'string' && /\bgit\s+commit\b/.test(cmd)) {
    const bare = stripQuoted(cmd);
    if (/(^|\s)--no-verify\b/.test(bare) || /(^|\s)-[a-zA-Z]*n[a-zA-Z]*(\s|$)/.test(bare)) {
      return deny('git commit --no-verify is not allowed: it skips the truth-docs pre-commit hook.');
    }
  }
  return null;
}

function staleFingerprint(stale) {
  return hashStr(
    stale
      .flatMap((r) => [r.doc, ...r.changed.map((c) => `${c.path}:${c.status}:${c.cur ?? ''}`)])
      .sort()
      .join('\n'),
  );
}

/** Shared Stop logic. Returns { block?: string, notice?: string } */
function stopLogic(sid, active) {
  const dirtyRes = compute({ dirty: true });
  const blocking = dirtyRes.results.filter((r) => r.stale && r.severity === 'block');
  const st = loadState();
  const s = (st.sessions[sid] ??= {});
  if (blocking.length) {
    const fp = staleFingerprint(blocking);
    if (active && s.lastBlockFp === fp) {
      return {
        notice:
          `truth: agent stopped without resolving stale docs (${blocking.map((r) => r.doc).join(', ')}); ` +
          'no progress since the last block, so the stop was allowed. Review manually.',
      };
    }
    s.lastBlockFp = fp;
    saveState(st);
    const reason = blocking
      .map((r) => {
        const sec = r.sections.length ? ` Sections: ${r.sections.map((x) => `"${x}"`).join(', ')}.` : '';
        return `STALE ${r.doc}: ${describe(r).join('; ')}.${sec} FIX: edit the doc to match the code, ` +
          `then run: ${fixCmd(r)}`;
      })
      .join('\n');
    return { block: `Truth docs are out of date. Resolve before finishing:\n${reason}` };
  }
  delete s.lastBlockFp;
  const notes = [];
  const warn = dirtyRes.results.filter((r) => r.stale && r.severity === 'warn');
  if (warn.length) notes.push(`truth (warn): ${warn.map((r) => r.doc).join(', ')} may be stale.`);
  if (!s.reportedDrift) {
    const all = compute();
    const drift = all.results.filter((r) => r.stale && r.severity === 'block');
    if (drift.length) {
      notes.push(`truth: pre-existing drift in ${drift.map((r) => r.doc).join(', ')} (run check).`);
      s.reportedDrift = true;
    }
  }
  saveState(st);
  return notes.length ? { notice: notes.join(' ') } : {};
}

function runHook(name) {
  let input = {};
  try {
    input = readStdinJson();
    setRoot(input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd());
    let out = null;
    if (name === 'claude-post') out = hookPost(input);
    else if (name === 'claude-pre') out = hookPre(input);
    else if (name === 'claude-stop') {
      const r = stopLogic(input.session_id ?? 'default', !!input.stop_hook_active);
      if (r.block) out = { decision: 'block', reason: r.block };
      else if (r.notice) out = { systemMessage: r.notice };
    } else if (name === 'copilot-stop') {
      const r = stopLogic(input.sessionId ?? input.session_id ?? 'default', !!input.stop_hook_active);
      if (r.block) out = { decision: 'block', reason: r.block };
      else {
        out = { decision: 'allow' };
        if (r.notice) console.error(r.notice);
      }
    } else {
      throw new UsageError(`unknown hook: ${name}`);
    }
    if (out) process.stdout.write(`${JSON.stringify(out)}\n`);
  } catch (e) {
    // Fail OPEN: never block the agent because of a tooling error.
    process.stderr.write(`truth hook ${name} failed open: ${e?.message ?? e}\n`);
  }
  return 0;
}

// ---------------------------------------------------------------- selftest

function cmdSelftest() {
  const self = fileURLToPath(import.meta.url);
  const dir = mkdtempSync(path.join(tmpdir(), 'truth-selftest-'));
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 't',
    GIT_AUTHOR_EMAIL: 't@t',
    GIT_COMMITTER_NAME: 't',
    GIT_COMMITTER_EMAIL: 't@t',
  };
  let failed = 0;
  let n = 0;
  const sh = (cmd, args, input) =>
    spawnSync(cmd, args, { cwd: dir, env, input, encoding: 'utf8' });
  const t = (args, input) => {
    const r = sh('node', [self, ...args], input);
    return { code: r.status, out: r.stdout, err: r.stderr, json: () => JSON.parse(r.stdout) };
  };
  const ok = (name, cond, extra = '') => {
    n++;
    if (!cond) {
      failed++;
      console.log(`  FAIL ${name} ${extra}`);
    } else console.log(`  ok   ${name}`);
  };
  const w = (p, c) => {
    mkdirSync(path.dirname(path.join(dir, p)), { recursive: true });
    writeFileSync(path.join(dir, p), c);
  };
  const commitAll = (m) => {
    sh('git', ['add', '-A']);
    sh('git', ['commit', '-q', '-m', m]);
  };
  try {
    sh('git', ['init', '-q', '-b', 'main']);
    w('src/a.ts', 'export const a = 1;\n');
    w('lib/w.ts', 'export const w = 1;\n');
    w('docs/truth/A.md', '# A\n\n## Tier budgets\n\nA is 1.\n');
    w('docs/truth/W.md', '# W\n\nW is 1.\n');
    w(
      MANIFEST,
      JSON.stringify({
        version: 1,
        watch: ['src/**', 'lib/**'],
        docs: {
          'docs/truth/A.md': { sources: ['src/**'], severity: 'block', sections: { 'Tier budgets': ['src/a.ts'] } },
          'docs/truth/W.md': { sources: ['lib/**'], severity: 'warn' },
        },
      }),
    );
    commitAll('init');
    ok('unverified docs fail check', t(['check']).code === 1);
    ok('literal [bracket] path matches itself', globMatch('src/routes/blink/[slug]/+page.svelte', 'src/routes/blink/[slug]/+page.svelte'));
    ok('wildcard still matches bracket path', globMatch('src/routes/blink/[slug]/+page.svelte', 'src/routes/blink/*/+page.svelte'));
    ok('non-matching path stays unmatched', !globMatch('src/routes/other/+page.svelte', 'src/routes/blink/[slug]/+page.svelte'));
    ok('init A', t(['init', 'docs/truth/A.md']).code === 0);
    ok('init W', t(['init', 'docs/truth/W.md']).code === 0);
    ok('second init refused', t(['init', 'docs/truth/A.md']).code === 1);
    ok('clean => 0', t(['check']).code === 0);
    commitAll('baseline');
    ok('clean after commit', t(['check']).code === 0);

    w('src/a.ts', 'export const a = 2;\n');
    const c1 = t(['check']);
    ok('uncommitted edit => stale exit 1', c1.code === 1 && c1.out.includes('src/a.ts'));
    ok('stale names section', c1.out.includes('"Tier budgets"'));
    ok('--dirty sees it', t(['check', '--dirty']).code === 1);
    ok('--staged ignores unstaged', t(['check', '--staged']).code === 0);
    sh('git', ['add', 'src/a.ts']);
    ok('--staged sees staged', t(['check', '--staged']).code === 1);
    const js = t(['check', '--json']);
    ok('--json shape', js.code === 1 && js.json().stale[0].doc === 'docs/truth/A.md' && Array.isArray(js.json().unmapped));

    ok('short reason refused', t(['stamp', 'docs/truth/A.md', '--reason', 'short']).code === 1);
    ok(
      'unchanged prose without --unchanged refused',
      t(['stamp', 'docs/truth/A.md', '--reason', 'verified everything is fine here']).code === 1,
    );
    ok(
      '--unchanged not naming a file refused',
      t(['stamp', 'docs/truth/A.md', '--reason', 'verified everything is fine here', '--unchanged', 'nothing relevant mentioned here ok']).code === 1,
    );
    w('docs/truth/A.md', '# A\n\n## Tier budgets\n\nA is 2.\n');
    ok('stamp after doc edit', t(['stamp', 'docs/truth/A.md', '--reason', 'A is now 2 in a.ts, doc updated']).code === 0);
    ok('clean after stamp', t(['check']).code === 0);
    ok('no-op restamp refused', t(['stamp', 'docs/truth/A.md', '--reason', 'restamping with no changes at all']).code === 1);
    sh('git', ['add', '-A']);
    ok('--staged ok when lock staged', t(['check', '--staged']).code === 0);
    commitAll('a=2');

    w('src/c.ts', 'export const c = 1;\n');
    ok('new untracked file => stale', t(['check']).out.includes('src/c.ts (new'));
    ok(
      'stamp with --unchanged naming file',
      t(['stamp', 'docs/truth/A.md', '--reason', 'c.ts is unrelated helper', '--unchanged', 'c.ts adds a helper; A.md prose stays true']).code === 0,
    );
    const lockTxt = readFileSync(path.join(dir, LOCK), 'utf8');
    ok('lock records reason', lockTxt.includes('c.ts adds a helper') && lockTxt.includes('"reason"'));
    commitAll('c');

    w('lib/w.ts', 'export const w = 2;\n');
    const cw = t(['check']);
    ok('warn doc stale but exit 0', cw.code === 0 && cw.out.includes('STALE (warn)'));
    commitAll('w');
    w('src/new/x.ts', 'x\n');
    w('lib/ignored/../../src/zzz.txt', 'z\n');
    ok('glob catches nested new file', t(['check']).out.includes('src/new/x.ts'));
    rmSync(path.join(dir, 'src/new'), { recursive: true });
    rmSync(path.join(dir, 'src/zzz.txt'));

    // hooks
    const sid = { session_id: 's1', cwd: dir };
    const post = (f, extra = {}) =>
      t(['hook', 'claude-post'], JSON.stringify({ ...sid, tool_name: 'Edit', tool_input: { file_path: path.join(dir, f) }, ...extra }));
    const p1 = post('src/a.ts');
    ok('post: context for mapped file', p1.code === 0 && p1.json().hookSpecificOutput.additionalContext.includes('docs/truth/A.md'));
    ok('post: hookEventName PostToolUse', p1.json().hookSpecificOutput.hookEventName === 'PostToolUse');
    ok('post: once per doc per session', post('src/a.ts').out.trim() === '');
    ok('post: unmapped file silent', post('README.md').out.trim() === '');
    const pre = (ti) => t(['hook', 'claude-pre'], JSON.stringify({ ...sid, tool_name: 'X', tool_input: ti }));
    ok('pre: deny lock edit', pre({ file_path: path.join(dir, LOCK) }).json().hookSpecificOutput.permissionDecision === 'deny');
    ok('pre: allow manifest edit', pre({ file_path: path.join(dir, MANIFEST) }).out.trim() === '');
    ok('pre: deny --no-verify', pre({ command: 'git commit --no-verify -m x' }).json().hookSpecificOutput.permissionDecision === 'deny');
    ok('pre: deny -n', pre({ command: 'git commit -n -m x' }).out.includes('deny'));
    ok('pre: deny -an', pre({ command: 'git commit -an -m x' }).out.includes('deny'));
    ok('pre: -n inside message ok', pre({ command: 'git commit -m "fix -n flag"' }).out.trim() === '');

    w('src/a.ts', 'export const a = 3;\n');
    const stop = (extra) => t(['hook', 'claude-stop'], JSON.stringify({ ...sid, session_id: 's2', hook_event_name: 'Stop', ...extra }));
    const s1 = stop({ stop_hook_active: false });
    ok('stop: blocks on dirty stale', s1.code === 0 && s1.json().decision === 'block' && s1.json().reason.includes('stamp docs/truth/A.md'));
    const s2 = stop({ stop_hook_active: true });
    ok('stop: loop guard allows when no progress', s2.code === 0 && s2.json().decision === undefined && !!s2.json().systemMessage);
    w('src/b.ts', 'export const b = 1;\n');
    ok('stop: re-blocks when stale set changed', stop({ stop_hook_active: true }).json().decision === 'block');
    const cp = t(['hook', 'copilot-stop'], JSON.stringify({ sessionId: 'c1', cwd: dir, stopReason: 'end_turn' }));
    ok('copilot-stop: block shape', cp.json().decision === 'block' && !!cp.json().reason);
    const bad = t(['hook', 'claude-stop'], 'not json{');
    ok('hook fails open on bad input', bad.code === 0 && bad.out.trim() === '');
    const bad2 = t(['hook', 'claude-stop'], JSON.stringify({ cwd: '/nonexistent-dir-xyz' }));
    ok('hook fails open on bad cwd', bad2.code === 0 && bad2.out.trim() === '');
    w('docs/truth/A.md', '# A\n\n## Tier budgets\n\nA is 3.\n');
    ok('stamp for stop clean', t(['stamp', 'docs/truth/A.md', '--reason', 'a=3 and new b.ts reflected in doc']).code === 0);
    ok('stop: clean allows', stop({ stop_hook_active: false }).out.trim() === '' || stop({}).json().decision === undefined);

    // import
    sh('git', ['checkout', '-q', '--', '.']);
    w('docs/truth/L.md', '# L\n\n## Body\n\ntext\n\n## Sources\n\n**Last Verified:** 2026-01-01T00:00:00Z\n\n| File | Description |\n|------|-------------|\n| src/a.ts | file thing |\n| `lib/w.ts` | x |\n');
    const im = t(['import', '--strip']);
    ok('import runs', im.code === 0);
    const mf = JSON.parse(readFileSync(path.join(dir, MANIFEST), 'utf8'));
    ok('import registers sources (incl. paths containing "file")', mf.docs['docs/truth/L.md']?.sources.length === 2);
    ok('import strips Sources', !readFileSync(path.join(dir, 'docs/truth/L.md'), 'utf8').includes('Sources'));
  } catch (e) {
    failed++;
    console.log(`  FAIL selftest crashed: ${e.stack}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(failed ? `selftest: ${failed} of ${n} FAILED` : `selftest: ${n} checks passed (v${TRUTH_VERSION})`);
  return failed ? 1 : 0;
}

// ---------------------------------------------------------------- main

function parseArgs(argv) {
  const args = [];
  const flags = {};
  const valued = new Set(['reason', 'unchanged']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (valued.has(k)) flags[k] = argv[++i] ?? '';
      else flags[k] = true;
    } else args.push(a);
  }
  return { args, flags };
}

const HELP = `truth ${TRUTH_VERSION}
  check [--staged|--dirty] [--json]
  stamp <doc> --reason "<>=20 chars>" [--unchanged "<why prose still true>"]
  init <doc> [--reason "..."]
  import [--strip]
  selftest
  hook claude-post|claude-pre|claude-stop|copilot-stop`;

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'hook') process.exit(runHook(rest[0]));
  if (cmd === 'selftest') process.exit(cmdSelftest());
  if (!cmd || cmd === '--help' || cmd === 'help' || cmd === '--version') {
    console.log(HELP);
    process.exit(cmd ? 0 : 3);
  }
  try {
    setRoot(process.cwd());
    const { args, flags } = parseArgs(rest);
    let code;
    if (cmd === 'check') code = cmdCheck(flags);
    else if (cmd === 'stamp') code = cmdStamp(args, flags);
    else if (cmd === 'init') code = cmdInit(args, flags);
    else if (cmd === 'import') code = cmdImport(flags);
    else throw new UsageError(`unknown command: ${cmd}\n${HELP}`);
    process.exit(code);
  } catch (e) {
    console.error(e instanceof UsageError ? `truth: ${e.message}` : e.stack);
    process.exit(3);
  }
}

main();
