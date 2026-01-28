# 🏦 Vaultica & Blink Vault Brand Context

> **For AI/LLM Context**: This document defines the complete brand soul, visual identity, and design
> principles for **Blink Vault** (by Vaultica). Reference this file when generating UI components,
> marketing copy, or any brand-related content.

---

## Brand Architecture

| Entity          | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| **Vaultica**    | The company — solid, professional infrastructure and "hardened" backend               |
| **Blink Vault** | The product (official legal name) — lightning-fast tool for saving visual inspiration |

**Philosophy**: "See it. Blink it. Find it." Technology must be invisible. We provide a sense of
_collection_, not "data processing."

---

## What is Blink Vault?

**Blink Vault: See it. Blink it. Find it.**

Blink Vault is the intelligent visual collection tool for people who save inspiration but have no
time to organize. It is designed for the **Creative Collector** — designers, artists, and visual
thinkers who save screenshots, references, mood boards, and inspiration constantly.

### The Problem We Solve: The "Visual Haystack"

You constantly save images, screenshots, and visual references. But finding them later is
impossible. You scroll through thousands of files, searching for that one design you saw.

**Blink Vault makes your collection searchable. Instantly. By what you remember.**

---

## Core Metaphor

### Blink Vault (the product)

The name combines:

- **Blink** — Speed, visual intuition, effortless capture
- **Vault** — Security, permanence, organized access

### Why "Blink Vault"?

- **Speed** — Saves in the blink of an eye
- **Visual** — Like blinking your eyes, capturing what you see
- **Secure** — Locked safely in your personal Vault
- **Unique** — Avoids name collision with other apps/companies

Think: Swift capture into an impenetrable vault. Speed meets security.

---

## Visual Aesthetic: "Industrial Elegance"

### Design Philosophy

Vaultica's visual language is **Industrial Elegance** — the intersection of brutalist precision and
refined sophistication.

#### Key Principles

1. **Visual Weight**
   - Heavy borders (2-4px) that anchor UI elements
   - Substantial typography that commands attention
   - Deliberate use of negative space

2. **High Contrast**
   - Dark surfaces with bright, clean text
   - Accent colors that pop against neutral backgrounds
   - Clear distinction between interactive and static elements

3. **Brutalist Precision**
   - Clean, geometric shapes
   - Minimal decorative elements
   - Function-first design decisions

4. **Security Aesthetic**
   - Lock/vault iconography where appropriate
   - Strong borders suggest containment and protection
   - Stable, grounded layouts (nothing feels fragile)

### Color Psychology

| Token           | Purpose                                                  | Feeling                |
| --------------- | -------------------------------------------------------- | ---------------------- |
| `vault-surface` | Deep, dark backgrounds                                   | Security, depth, focus |
| `brand-blue`    | Primary accent `#27abec` / `oklch(0.7031 0.1426 236.68)` | Speed, clarity, trust  |
| `vault-border`  | Heavy visible borders                                    | Containment, structure |
| `vault-text`    | High-contrast text (brand white `#f0fbff`)               | Clarity, readability   |

### Typography Philosophy

- **Headlines**: Bold/Heavy weights — authoritative, unmistakable
- **Body**: Regular weight — readable, efficient, scannable
- **Labels**: Medium weight with letter-spacing — precise, structured
- **Monospace**: For technical content — authenticity, precision

---

## Target Users

### 1. The Creative Professional (Primary)

- Needs a "mood board" that populates itself
- Saves design inspiration constantly
- Searches by **visual vibe** and content
- Values **flow** and zero friction
- Power user who appreciates speed

### 2. The Everyday User

- Wants to find an image in seconds
- Values simplicity and speed
- Non-technical, needs invisible tech

### 3. The Forum Power-User

- Needs to find and share the perfect image instantly
- Values quick sharing and link generation
- Active on design communities, Discord, social

---

## Core Features (Design Context)

### 1. Blink It. Zero Effort

**UI Implication**: One-tap save, minimal friction, instant feedback ("Blinked to your Vault. ⚡")

### 2. Invisible Understanding

**UI Implication**: NO indicators of "indexing" or "processing." It just works. The system
"understands."

### 3. Find by Memory

**UI Implication**: Natural language search bar as hero element, type-ahead suggestions, visual
results

### 4. Visual Gallery

**UI Implication**: Edge-to-edge image display, no text labels or tags, clean grid of Blinks

### 5. Instant Links

**UI Implication**: Link generation UI, expiration controls, privacy settings

### 6. Locked by Vaultica

**UI Implication**: Subtle security indicators, "Your Vault is private" messaging, solid feeling

---

## Brand Don'ts

### The "Invisible Librarian" Rule

**NEVER explain how search works.** The user should feel the system simply "understands" their
intent. No mentions of:

- ❌ Indexing, mapping, OCR, vector search
- ❌ Database, processing, recognition
- ❌ How the AI works

### Visual Don'ts

1. **Don't use playful/casual design** — No rounded bubbly shapes, no rainbow gradients
2. **Don't use weak borders** — Always visible, intentional containment
3. **Don't sacrifice clarity for aesthetics** — Function first
4. **Don't use decorative illustrations** — Icons should be geometric and purposeful
5. **Don't imply insecurity** — Nothing should feel fragile or ephemeral

### Terminology Don'ts

- ❌ "Capture" (legal issues)
- ❌ "Asset" (corporate jargon)
- ❌ "Snippet" (lacks emotional weight)
- ❌ "Fragment" (deprecated, use "Blink")

---

## Component Patterns

### Buttons

- Primary: Solid accent background, heavy weight
- Secondary: Transparent with thick border
- Always have visible focus states

### Cards

- 2-3px solid borders
- Dark surface background
- Clear content hierarchy

### Inputs

- Thick border on focus
- Dark background
- High-contrast placeholder

### Navigation

- Clear active states
- Accent color for current item
- Substantial touch targets

---

## Quick Reference Tokens

When generating CSS or styling:

```css
--vault-surface-primary     → Main background
--vault-surface-secondary   → Card/panel background
--vault-border-strong       → Heavy brutalist borders
--vault-accent-default      → Primary CTA color
--vault-text-primary        → Main text color
--vault-text-secondary      → Subdued text
```

---

## Accessibility Requirements

- All color combinations MUST meet WCAG 2.2 AA (4.5:1 contrast minimum)
- Focus states MUST be clearly visible
- Interactive elements MUST have adequate touch targets (44x44px minimum)
- Motion can be reduced based on user preference

---

_This document is the source of truth for Blink Vault's brand expression. When in doubt: make the
technology invisible, emphasize speed, and keep it visual._
