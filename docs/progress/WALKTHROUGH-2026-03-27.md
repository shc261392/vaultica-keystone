# Keystone Design System Update — Walkthrough

> **Date**: 2026-03-27
> **Scope**: Brand tagline overhaul, SAFE concept, design philosophy hardening, token version bump

---

## Summary of Changes

This update retires the old tagline "Store, share, and find — in a blink." and replaces it with
**"Save anything. Find everything. In a blink."** — introducing the **SAFE concept** as the
canonical product language. The design philosophy is also formally hardened to explicitly
forbid "vibe app" aesthetics.

---

## 1. Tagline & Brand Copy Overhaul

### What Changed

| Location | Before | After |
|----------|--------|-------|
| Primary tagline | "Store, share, and find — in a blink." | **"Save anything. Find everything. In a blink."** |
| Voice line | "Blinked to your Vault. ⚡" | "Save anything. Find everything. In a blink." |
| Secondary list | "Your vault, your rules." (removed) | 4 new variants added (see below) |
| Product description (short) | "Store, share, and find…" | "Save anything. Find everything…" |

### New Secondary Tagline Options

Agents should select from these pre-approved variants — never create new brand slogans:

> "AI organizes everything the moment you upload."  
> "Share any file with a link. No setup, no folders."  
> "No setup, no folders. Instant results."  
> "Everything you save. Instantly found."  
> "Blink it in. Find it fast."  
> "Your vault. Instantly searchable."  
> "Save now. Find later. Zero effort."  

### "Your files, your rules" is Permanently Retired

The phrase **"Your files, your rules"** and its variants (`"your vault, your rules"`, etc.) are
**permanently retired as of 2026-03-27**. Do not use them in any new copy, UI text, metadata,
documentation, or code comments.

**Files to check when copying existing text:**
- `src/app/layout.tsx` — SEO metadata
- `src/app/page.tsx` — Hero section copy
- `src/app/auth/page.tsx` — Auth page tagline
- `public/manifest.json` — PWA description
- Any new file that references old taglines

---

## 2. SAFE Concept (New)

**SAFE** = **S**ave **A**nything, **F**ind **E**verything.

This is the official name for Blink Vault's dual-mode bottom input bar. Agents working on
the SAFE input component (file: `src/components/vault/upload-zone.tsx`) should understand:

- The same input handles both **saving** (file drop, URL paste, text) and **finding** (search)
- The user never explicitly switches modes — context is inferred
- Microcopy within the component must use SAFE-aware language:
  - ✅ "Save anything or search your vault…"
  - ✅ "Drop a file, paste a URL, or search…"  
  - ❌ "Upload" (too narrow — SAFE saves more than files)
  - ❌ "Search" as a standalone CTA (undersells the save capability)

The SAFE concept is now documented in [`ai/brand-context.md`](../../ai/brand-context.md).

---

## 3. Design Philosophy Hardening

### What Changed in `ai/brand-context.md`

The Design Philosophy section now explicitly states:

> "This is a 2026 professional tool — not a 'vibe app.' Every pixel serves a purpose.
> The design communicates efficiency, security, and speed."

Four new explicit prohibitions added to the Key Principles:

| Principle | New Prohibition |
|-----------|----------------|
| Structural Weight | Monospace accents for technical authority (added) |
| High Contrast | Dark-only theme — no light mode distraction (added) |
| Brutalist Precision | **No playful rounded bubble UI, no gradient backgrounds, no emoji-driven UX** |
| Security Aesthetic | Everything has a defined boundary (added) |

### How Agents Should Apply This

When writing React components or CSS for vaultica-web:

**DO:**
- Use `rounded-sm` or `rounded` (≤4px radius). Square or near-square corners.
- Use `border-2` or `border-[3px]` on interactive elements
- Use `font-mono` for technical values (file sizes, slugs, timestamps)
- Use dark background tokens: `bg-[var(--vault-surface-primary)]` etc.
- Use `text-white` or near-white text on dark surfaces

**DO NOT:**
- Use `rounded-full` on rectangular elements (cards, panels, inputs)
- Use decorative gradients as backgrounds (`bg-gradient-to-r`, etc.)
- Add emoji to UI labels or button text
- Add a light mode variant unless explicitly requested
- Use `shadow-xl` / blob/glow effects for decoration

---

## 4. Token Version Bump

All five token files were bumped to **version 2.0.0** with `lastUpdated: "2026-03-27"`.

| File | Old Version | New Version |
|------|-------------|-------------|
| `tokens/colors.json` | 1.1.0 | **2.0.0** |
| `tokens/typography.json` | 1.0.0 | **2.0.0** |
| `tokens/spacing.json` | 1.0.0 | **2.0.0** |
| `tokens/effects.json` | 1.0.0 | **2.0.0** |
| `tokens/semantic.json` | 1.0.0 | **2.0.0** |

No token _values_ changed in this update — only metadata. The version bump signals that this
keystone release is the canonical design SSoT for vaultica-web going forward.

**Important for integrators:** If you consume these tokens in code and compare by version,
update your version checks to `>= 2.0.0`. No migration of token values is required.

---

## 5. Files Changed in This Update

### vaultica-keystone

| File | Change |
|------|--------|
| `ai/brand-context.md` | Philosophy line, SAFS section added, design prohibitions added |
| `ai/personality.md` | Tagline, 7 secondary options, product descriptions (short/medium/long) |
| `copilot-instructions.md` | Voice line updated, "vibe-app aesthetics" added to avoid list |
| `README.md` | Brand summary tagline + aesthetic description |
| `PLANNING.md` | Brand aesthetic line, tagline entry, date → 2026-03-27 |
| `docs/INTEGRATION-GUIDE.md` | 4 code examples updated with new tagline |
| `docs/progress/WALKTHROUGH-2026-01-12.md` | Hero copy reference updated |
| `preview/src/app/page.tsx` | Hero taglines + "your vault, your rules" → "Your vault. Always secure." |
| `tokens/*.json` (all 5) | `version` → `2.0.0`, `lastUpdated` → `2026-03-27` |

### vaultica-web (corresponding changes)

| File | Change |
|------|--------|
| `src/app/layout.tsx` | SEO metadata — 4 tagline instances updated |
| `src/app/auth/page.tsx` | Auth page tagline |
| `src/app/page.tsx` | Hero section copy |
| `public/manifest.json` | PWA description |

---

## 6. How to Keep Future Code Aligned

### When Writing New UI Text

1. **Open** `ai/personality.md` in context before writing any user-facing copy
2. **Match tone**: Swift, minimal, confident — 5 words max for labels, 15 words max for subtitles
3. **Use approved taglines only** — never draft new brand slogans without human approval
4. **Check retired list**: `"Your files, your rules"`, `"your vault, your rules"`, `"Store, share, and find"` are all banned

### When Building New Components

1. **Read** `ai/brand-context.md` §Design Philosophy before writing any component CSS
2. **Reference** `docs/INTEGRATION-GUIDE.md` for concrete code examples
3. **Use** `vaultica-keystone/dist/theme.css` CSS variables — never hardcode brand colors
4. **Borders**: Default to `border-2` with `border-vault-border-default`
5. **Surfaces**: Use `bg-vault-surface-primary`, `bg-vault-surface-secondary`, or `bg-vault-surface-tertiary` — never `bg-zinc-950` etc.

### When Updating Metadata / SEO

The canonical description for all metadata contexts is:

```
Save anything. Find something. In a blink.
```

Use this verbatim (with punctuation) in:
- `layout.tsx` `metadata.description`
- `metadata.openGraph.description`
- `metadata.twitter.description`
- `public/manifest.json` `description`
- Any `<meta name="description">` tag

---

## Verification Checklist

- [ ] `grep -r "your files, your rules" src/ public/` returns zero results
- [ ] `grep -r "store, share, and find" src/ public/` returns zero results (case-insensitive)
- [ ] `grep -r "your vault, your rules" src/ public/` returns zero results
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm check:truth -- --quiet` passes (truth docs stamped with latest schema SHA)
