# Keystone Design System Update — Walkthrough

> **Date**: 2026-01-12
> **Scope**: Color palette, brand copy, icon button philosophy, logo refinement

---

## Quick Start

```bash
# Build tokens
pnpm build

# Start preview app
cd preview && pnpm dev
```

Open <http://localhost:3000> and explore the tabs described below.

---

## 1. Brighter Dark Color Palette

**Problem**: The previous neutral scale bottomed out at `oklch(6%)` — near-pure black that felt
harsh on screens, especially OLED.

**Solution**: Raised the entire bottom end of the neutral scale while shifting the hue
from `256` to `254` for a slightly warmer blue-grey.

| Token | Before | After |
|-------|--------|-------|
| `neutral.700` | `oklch(30% 0.016 256)` | `oklch(33% 0.015  254)` |
| `neutral.800` | `oklch(22% 0.014 256)` | `oklch(27% 0.014 254)` |
| `neutral.900` | `oklch(16% 0.012 256)` | `oklch(21% 0.012 254)` |
| `neutral.950` | `oklch(12% 0.01 256)` | `oklch(17% 0.010 254)` |
| `neutral.1000` | `oklch(6% 0.008 256)` | `oklch(10% 0.008 254)` |

**Where to verify**:

- **Colors tab** → Scroll to "Neutral Scale" — rows show new values with
  hex approximations.
- **Mock Website tab** → The entire page uses updated surfaces. Compare
  against a pure `#000` background to see the difference.
- Source of truth: [tokens/colors.json](../../tokens/colors.json)
- CSS mapping: [preview/src/app/globals.css](../../preview/src/app/globals.css)

### Semantic Surface Mapping

The vault semantic tokens reference the updated primitives:

| Semantic Token | Ref | OKLCH Value |
|---|---|---|
| `vault.surface.primary` | `neutral.950` | `oklch(17% 0.010 254)` |
| `vault.surface.secondary` | `neutral.900` | `oklch(21% 0.012 254)` |
| `vault.surface.tertiary` | `neutral.800` | `oklch(27% 0.014 254)` |
| `vault.border.default` | `neutral.700` | `oklch(33% 0.015 254)` |
| `vault.border.subtle` | `neutral.800` | `oklch(27% 0.014 254)` |
| `vault.border.strong` | `neutral.500` | `oklch(45% 0.02 230)` |

---

## 2. Brand Copy & Tone Refresh

**Problem**: Copy was functional but lacked personality. Needed to feel
confident, calm, and effortless — like Apple or Linear.

**New voice**: "Confident & Effortless"

### Key Phrases

| Context | New Copy |
|---------|----------|
| Philosophy | "Own it. Share it. Rest easy." |
| Tagline | "Zero config. Zero stress." |
| Hero | "Your files, your rules." |
| Sharing | "In a Blink." |
| Security | "Rest assured." |
| Success feedback | "Saved. In a blink. ⚡" |
| Error feedback | "Hmm, that didn't land." |

**Where to verify**:

- **Mock Website tab** → Hero shows "Your vault in the cloud", subtitle uses
  "Rest easy" phrasing, feature cards: "In a Blink", "Zero Config", "Own It".
- Updated docs:
- [ai/personality.md](../../ai/personality.md) — Full voice guide with
  sample copy strings
- [ai/brand-context.md](../../ai/brand-context.md) — Brand philosophy,
  feature naming, color psychology language

---

## 3. Icon Button Philosophy

**Problem**: No documented system for icon usage. vaultica-web used a
mix of Heroicons and text buttons inconsistently.

**Solution**: Created a comprehensive icon button design system
standardized on **Lucide React**.

### Principles

1. Icon-first — default to icon-only; add labels only
   when ambiguity exists
2. Universal symbols — widely recognized iconography
3. Consistent sizing — sm (32px), md (40px), lg (48px), xl (56px)
4. Touch-friendly — 44×44px minimum touch target
5. Accessible — every icon button includes `aria-label`

### Icon Set

Eight categories with ~80+ mapped icons covering:

- **Core Actions** — Share, Download, Upload, Copy, Delete, Edit, Settings, Search
- **Navigation** — Menu, Close, ChevronLeft/Right, ArrowUp/Down, Home, ExternalLink
- **File Management** — File, FolderOpen, Archive, FileText, Image, Paperclip
- **Communication** — Bell, Mail, MessageCircle, Send, AtSign
- **State Indicators** — Check, X, AlertTriangle, Info, Loader2, Eye/EyeOff
- **Social & Engagement** — Heart, Star, Bookmark, ThumbsUp, Flag, UserPlus
- **Vault-Specific** — Lock, Unlock, Shield, Key, QrCode, Link, RefreshCw
- **Organization** — Tag, Filter, SortAsc, Grid, List, Pin, MoreVertical

**Where to verify**:

- **Icon Buttons tab** (new) → Shows all categories in visual grid with
  interactive demos for states, sizes, and variants.
- Full specification: [ai/icon-button-philosophy.md](../../ai/icon-button-philosophy.md)

---

## 4. Blink Vault Logo Refinement

**Problem**: Flat background + text color made the wordmark look harsh and "edgy".

**Changes applied to both dark and light variants**:

### Dark Variant

| Property | Before | After |
|----------|--------|-------|
| Background | Flat `#363b42` | Linear gradient `#1e2329` → `#262c34` |
| Corner radius | `rx="8"` | `rx="16"` |
| "Vault" text | `#f0fbff` (full white) | `#d6e8f0` (softer, warmer) |

### Light Variant

| Property | Before | After |
|----------|--------|-------|
| Background | Flat `#f0fbff` | Linear gradient `#f4fbff` → `#e8f4fa` |
| Corner radius | `rx="8"` | `rx="16"` |
| "Blink" text | `#27abec` | `#2098d4` (slightly deeper blue) |
| "Vault" text | `#363b42` | `#1e2329` (richer dark) |

**Where to verify**:

- **Logos tab** → Both variants displayed side by side. Look for
  gradient backgrounds and rounded corners.
- SVG sources:
  - [preview/public/logos/blink-vault-logo-dark.svg](../../preview/public/logos/blink-vault-logo-dark.svg)
  - [preview/public/logos/blink-vault-logo-light.svg](../../preview/public/logos/blink-vault-logo-light.svg)
  - [assets/logos/blink-vault-logo-dark.svg](../../assets/logos/blink-vault-logo-dark.svg)
  - [assets/logos/blink-vault-logo-light.svg](../../assets/logos/blink-vault-logo-light.svg)

---

## Files Changed

| File | Change Type |
|------|-------------|
| `tokens/colors.json` | Modified — neutral 700-1000 brightened, hue shifted |
| `tokens/semantic.json` | Unchanged — references updated primitives automatically |
| `preview/src/app/globals.css` | Modified — CSS vars synced to new token values |
| `preview/src/app/page.tsx` | Modified — new Icon Buttons tab, updated copy, updated hex values |
| `preview/public/logos/blink-vault-logo-dark.svg` | Modified — gradient bg, rounded corners, softer text |
| `preview/public/logos/blink-vault-logo-light.svg` | Modified — gradient bg, rounded corners, deeper colors |
| `assets/logos/blink-vault-logo-dark.svg` | Modified — mirrors preview variant |
| `assets/logos/blink-vault-logo-light.svg` | Modified — mirrors preview variant |
| `ai/icon-button-philosophy.md` | Created — full icon system specification |
| `ai/personality.md` | Modified — new voice, taglines, feedback strings |
| `ai/brand-context.md` | Modified — philosophy, color psychology, feature names |
| `ai/component-patterns.md` | Modified — surface color hex reference updated |

---

## Verification Checklist

- [ ] `pnpm build` passes (tokens + dist)
- [ ] `cd preview && pnpm build` passes (Next.js static)
- [ ] Logos tab — gradient backgrounds visible, corners rounded
- [ ] Colors tab — neutral scale shows brightened bottom end
- [ ] Icon Buttons tab — all 8 categories render with correct icons
- [ ] Mock Website tab — new copy reads naturally ("Rest easy", "In a Blink")
- [ ] Dark surfaces feel comfortable, not harsh
