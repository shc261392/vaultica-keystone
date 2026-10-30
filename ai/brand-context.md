# 🏦 Vaultica & BlinkVault Brand Context

> **For AI/LLM Context**: This document defines the complete brand soul, visual identity, and design
> principles for **BlinkVault** (by Vaultica). Reference this file when generating UI components,
> marketing copy, or any brand-related content.

**Current tagline** (source: `vaultica-web/src/lib/brand.ts`): "Dump anything. Ask anything. See the
source." Product line: forward links, PDFs, screenshots and notes from Telegram or Discord;
BlinkVault sorts them into topics and answers with citations to the exact source.

---

## Brand Architecture

| Entity          | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| **Vaultica**    | The company — solid, professional infrastructure                                      |
| **BlinkVault** | The product (official legal name) — a central vault that makes scattered content AI-ready |

**Philosophy**: **"AI-ready in a Blink."** BlinkVault brings loose digital context into one place.
Technology stays invisible, but the outcome is obvious: centralized, searchable, AI-ready content.

---

## What is BlinkVault?

**BlinkVault: One vault for everything your AI needs.**

BlinkVault is the central vault for the loose digital context spread across your tools.
Cloud drives, messaging apps, saved links, notes, PDFs, screenshots, video, and random local
files all end up in one place — and become searchable and AI-ready.

BlinkVault is not framed as a bulk-import archive system. The product model is intentional:

- **Sync** cloud drives like Dropbox and Google Drive
- **Send** specific files, links, or messages from apps like Telegram, Discord, or WhatsApp
- **Drop** anything from desktop or local storage

The user chooses what goes in. BlinkVault makes it useful immediately.

---

## Core Metaphor

### BlinkVault (the product)

The name combines:

- **Blink** — Speed, visual intuition, effortless capture
- **Vault** — Security, permanence, organized access

### Why "BlinkVault"?

- **Speed** — Saves in the blink of an eye
- **Visual** — Like blinking your eyes, capturing what you see
- **Secure** — Locked safely in your personal Vault
- **Unique** — Avoids name collision with other apps/companies

Think: one vault, many sources, zero fragmentation.

---

## Visual Aesthetic: "Quiet instrument"

### Design Philosophy

BlinkVault looks like a well-made instrument: calm, precise, tool-like. It does not decorate. The
interface steps back so the user's content and the cited source stay in front. The live source of
truth is `vaultica-web/src/styles/globals.css`; the tokens in `tokens/vault-theme.json` mirror it.

#### Key Principles

1. **Sparse structure**
   - 1px borders, used where they separate things - not on every element
   - Shadows only on overlays (menus, dialogs, popovers)
   - 8px radius family (4 / 6 / 8 / 12)
   - Generous, consistent spacing

2. **One accent, used sparingly**
   - Teal accent for the primary action, focus, active navigation and links
   - No glow, no neon, no gradient fills
   - Status colours (success, warning, critical) carry meaning only; never decoration

3. **Two themes, same design**
   - **blink** - dark, the default (surface `#0E1013`, accent `#3CC8D0`)
   - **paper** - light (surface `#FAFAFB`, accent `#0A7C86`)
   - Users choose System, Blink or Paper; every component must work in both

4. **Provenance is visible**
   - Citations are numbered pills that open a source popover
   - Vault sources and web sources use distinct, theme-aware colours, always paired with a label

### Colour

| Token                         | blink (dark)            | paper (light)           | Use                              |
| ----------------------------- | ----------------------- | ----------------------- | -------------------------------- |
| `vault-surface-primary`       | `#0E1013`               | `#FAFAFB`               | App background                   |
| `vault-surface-secondary`     | `#141619`               | `#FFFFFF`               | Cards, panels                    |
| `vault-border-default`        | `#25292F`               | `#DFE1E6`               | Hairline borders                 |
| `vault-text-primary`          | `#ECEDF0`               | `#141619`               | Body text                        |
| `vault-accent`                | `#3CC8D0`               | `#0A7C86`               | Primary action, focus, links     |
| `vault-accent-fg`             | `#04181A`               | `#FFFFFF`               | Text on accent fills             |
| `vault-accent-ring`           | `rgb(60 200 208 / 0.3)` | `rgb(10 124 134 / 0.24)`| 3px focus halo on text fields    |

Always use the functional token name, never the hex. Tag colours are `light-dark()` pairs so one
definition serves both themes.

### Typography

- **Geist** for all UI and marketing text; **Geist Mono** for code, IDs and technical values
- Headlines: semibold, tight tracking. Body: regular. Labels: medium
- Phones use 16px text inside every input (prevents iOS zoom on focus)

---

## Target Users

### 1. Data Hoarders

- Save everything, remember nothing
- Need one searchable place for scattered files, links, and notes
- Value clarity over manual organization

### 2. AI Workers & Designers

- Need better context for AI tools
- Pull from many sources: references, briefs, notes, assets, links
- Value fast retrieval and low-friction ingestion

### 3. Digital Nomads

- Work across devices and cloud tools
- Need one place that follows them everywhere
- Value centralization more than storage itself

---

## Core Features (Design Context)

### 1. The Hub

**UI Implication**: Show BlinkVault as the center point for many sources. Platform cards,
source labels, and flow cues should reinforce centralization.

### 2. Any Format

**UI Implication**: Surface format breadth clearly — notes, URLs, images, video, PDFs, voice,
and data files all belong.

### 3. Intentional Ingestion

**UI Implication**: Distinguish between **sync**, **send**, and **drop**. Avoid interfaces that imply
bulk importing entire app histories.

### 4. AI-ready Fast

**UI Implication**: Emphasize immediacy and usability. Content should feel ready for search and AI
without exposing internals.

### 5. Private by Default

**UI Implication**: Stable layouts, strong boundaries, and calm reassurance. Privacy should feel
structural, not promotional.

---

## Brand Don'ts

### The "Invisible Librarian" Rule

**NEVER explain how search works.** The user should feel the system simply "understands" their
intent. No mentions of:

- ❌ Indexing, OCR, vector search
- ❌ Database, processing, recognition
- ❌ How the AI works
- ❌ Bulk-import language that suggests whole-chat dumping

### Visual Don'ts

1. **Don't use playful/casual design** — No bubbly shapes, no rainbow gradients, no emoji-driven UI
2. **Don't add glow, neon or gradient fills** — Calm is the point
3. **Don't put shadows on resting surfaces** — Shadows are for overlays only
4. **Don't sacrifice clarity for aesthetics** — Function first
5. **Don't use decorative illustrations** — Icons should be geometric and purposeful
6. **Don't put internal or technical names in UI text** — The product-words test enforces this

### Terminology Don'ts

- ❌ "Blink it"
- ❌ "SAFE"
- ❌ "Dump your chats"
- ❌ "Asset" (corporate jargon)
- ❌ "Snippet" (too vague)

---

## Component Patterns

Full patterns, with do and don't: [`component-patterns.md`](component-patterns.md). In short:

- Primary button: solid accent fill, `vault-accent-fg` text. Secondary: 1px border, transparent
- Cards: 1px `vault-border-default`, no resting shadow
- Text fields: the field owns its focus - accent border plus a 3px `vault-accent-ring` halo
- Navigation: persistent sidebar (240px, 56px rail); accent marks the current item

---

## Quick Reference Tokens

When generating CSS or styling (Tailwind v4 utilities `bg-vault-*`, `text-vault-*`, `border-vault-*`):

```css
--color-vault-surface-primary     /* Main background */
--color-vault-surface-secondary   /* Card/panel background */
--color-vault-border-default      /* Hairline borders */
--color-vault-accent              /* Primary action, focus, links */
--color-vault-accent-ring         /* Focus halo around text fields */
--color-vault-text-primary        /* Main text */
--color-vault-text-secondary      /* Subdued text */
```

---

## Accessibility Requirements

- All color combinations MUST meet WCAG 2.2 AA (4.5:1 contrast minimum)
- Focus states MUST be clearly visible
- Interactive elements MUST have adequate touch targets (44x44px minimum)
- Motion can be reduced based on user preference

---

_This document is the source of truth for BlinkVault's brand expression. When in doubt: centralize
the story, keep ingestion intentional, and make the result feel immediately useful to AI._
