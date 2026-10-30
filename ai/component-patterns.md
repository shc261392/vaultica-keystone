# 🧩 Blink Component Patterns

> **For AI/LLM Context**: Reference this document when generating UI for BlinkVault. It describes
> the **"Quiet instrument"** design that went live in the web app on 2026-10-30: calm, tool-like,
> sparse 1px borders, no glow or neon, shadows only on overlays, 8px radius family. Geist /
> Geist Mono. Earlier guidance (Industrial Elegance, 3px borders, `#27abec`, Electric-Blue
> `#00F0FF`) is retired.
>
> **Where the tokens live:** `tokens/vault-theme.json` (this repo) builds to `dist/theme.css`; the web
> app imports it and layers app-level rules in `src/styles/globals.css`. Two themes ship: **`blink`**
> (dark, default, accent `#3CC8D0`) and **`paper`** (light, accent `#0A7C86`). Users pick System,
> Blink or Paper.
>
> **Primitive component library** (web, `src/lib/components/ui/`, Svelte 5): `Button`, `Card`,
> `Input`, `Textarea`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState`, `StreamingState`, plus
> `Icon`, `Modal`, `TierBadge`, `ThemeSwitcher`, `FilterMenu`, `ActionMenu`. Use semantic `vault-*`
> token utilities only - never hardcoded hex.

---

## Design Principles

1. **Sparse hairlines** - 1px `vault-border-default`, only where it separates things.
2. **Shadows only on overlays** - menus, dialogs and popovers. Resting surfaces are flat.
3. **One accent** - teal (`#3CC8D0` blink / `#0A7C86` paper) for the primary action, focus, active
   navigation and links. No glow, no neon, no gradient fills.
4. **8px radius family** - `--radius-sm` 6px, `--radius-md` 8px, `--radius-lg` 12px.
5. **Provenance colours** - `--color-cite-vault` and `--color-cite-web` mark citation sources,
   always paired with a label or icon (never colour alone).
6. **Both themes, always** - tag colours are `light-dark()` pairs; test blink and paper.

---

## Current Patterns

Each pattern: what it is, then do and don't.

### Focus system

A text field **owns its focus ring**: border turns `vault-accent` and a 3px halo
`--color-vault-accent-ring` follows the field's radius (blink `rgb(60 200 208 / 0.3)`, paper
`rgb(10 124 134 / 0.24)`). Buttons, links and rows get a 2px outline in `vault-border-focus`.
A wrapper around a borderless input takes the class `.field` and shows the ring via `:focus-within`.

- Do: let the field draw the ring; mark wrappers with `.field`.
- Do: use 16px text in inputs on phones (prevents iOS zoom).
- Don't: add a second outline on the inner input, or a 3px border as the focus state.

### App shell and navigation

Persistent sidebar, 240px wide, collapsing to a 56px rail. The command palette opens with Cmd/Ctrl+K;
`?` opens the keyboard-shortcuts sheet. Library holds three views: **Files / Topics / Threads**.

- Do: keep the current location marked with the accent.
- Don't: hide primary navigation behind a hamburger on desktop.

### Ask

Ask shows live progress ("Searched your vault ✓ · Reading 2 sources · Writing…") and a **Stop**
button while it runs. Answers carry numbered citation pills; selecting one opens a source popover.
After an answer: three suggested follow-up chips and thumbs feedback.

- Do: show what is happening in plain words; keep Stop reachable.
- Do: cite every claim with a numbered pill.
- Don't: explain how search works (see the "Invisible Librarian" rule) or show internal names.

### Filter pills (`FilterMenu`)

A pill that opens a dropdown on desktop and a **bottom sheet on phones**.

- Do: show the active value in the pill.
- Don't: use a native `<select>` for filters.

### Action menu (`ActionMenu`)

A ⋯ button opens the menu. **Destructive actions go last, behind a divider**, in the critical colour.

- Do: confirm destructive actions that cannot be undone.
- Don't: place Delete first or style it like a normal action.

### Error pages

One branded 404 / 5xx page in the same calm voice: what happened, one clear way back.

- Don't: use jokes, stack traces or illustrations.

### Tags

Tag colours are `light-dark()` pairs, so one definition serves both themes.

### Product words

A test forbids internal names in UI text. Write what the user sees, in the terms in
`ai/personality.md`.

---

## Core Components

> **Single accent.** Indigo was removed entirely — teal (`#3CC8D0` on `blink`,
> `#0A7C86` on `paper`) is the
> only interactive accent. All colors below are semantic `vault-*` utilities (never raw palette scale
> like `neutral-700`, `accent-900`, or hardcoded hex). Class maps mirror `variants.ts`.

### Button

**Base** (`BUTTON_BASE`):

```text
inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap
transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none
```

`rounded-md` = `--radius-md` (8px). Keyboard focus is handled globally by
`:focus-visible { outline: 2px solid var(--color-vault-border-focus); outline-offset: 2px }`.

**Variants:**

| Variant   | Classes                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Primary   | `bg-vault-accent text-vault-accent-fg hover:bg-vault-accent-hover active:bg-vault-accent-active border border-transparent`   |
| Secondary | `bg-transparent text-vault-text-primary border border-vault-border-strong hover:bg-vault-surface-tertiary`                   |
| Ghost     | `bg-transparent text-vault-text-secondary border border-transparent hover:bg-vault-surface-tertiary hover:text-vault-text-primary` |
| Danger    | `bg-vault-status-critical-subtle text-vault-status-critical border border-vault-status-critical-subtle hover:bg-vault-status-critical/15` |

> **Primary text is `text-vault-accent-fg`** — dark teal-black (`#04181A`) on the `blink` dark
> theme, white
> on `paper` light. Never plain white on the dark accent.

**Sizes:**

| Size | Classes                | Height           |
| ---- | ---------------------- | ---------------- |
| sm   | `h-9 px-3 text-sm gap-1.5` | 36px         |
| md   | `h-11 px-4 text-sm gap-2`  | 44px (WCAG 2.2 SC 2.5.8 target) |
| lg   | `h-12 px-5 text-base gap-2` | 48px        |

---

### Card

```text
bg-vault-surface-secondary
border border-vault-border-default   /* 1px hairline — NOT 3px brutalist */
rounded-lg                           /* --radius-lg = 12px */
p-6
shadow-sm                            /* soft elevation */

/* Card with media */
overflow-hidden                      /* for image cropping */
```

#### Card Variations

| Variant   | Border                                                          | Background                  |
| --------- | -------------------------------------------------------------- | --------------------------- |
| Default   | `border-vault-border-default`                                  | `bg-vault-surface-secondary` |
| Selected  | `border-vault-accent`                                          | `bg-vault-surface-secondary` |
| Hoverable | `border-vault-border-default hover:border-vault-border-strong` | `bg-vault-surface-secondary` |
| Elevated  | `border-vault-border-default shadow-md`                        | `bg-vault-surface-tertiary`  |

---

### Input

```text
bg-vault-surface-secondary
border border-vault-border-default   /* 1px hairline — NOT 3px */
rounded-md                           /* --radius-md = 8px */
px-4
h-11                                 /* 44px, min touch target */
text-vault-text-primary
placeholder:text-vault-text-tertiary

/* Soft focus (no hard outline on the field itself) */
focus:border-vault-accent/60 focus:ring-2 focus:ring-vault-accent/20

/* Error */
aria-invalid:border-vault-status-critical
```

> Global keyboard focus (`:focus-visible`) still applies app-wide; text/search fields opt out of the
> hard 2px outline via `.search-field` in favor of the soft accent ring above.

---

### Search Input (Hero Element)

The search bar is Vaultica's primary interaction point. The bordered wrapper carries a **1px hairline**
and shows focus with a **soft accent ring** — not a 3px border and not a 4px box-shadow.

```text
/* Wrapper (1px hairline) */
border border-vault-border-default
rounded-lg                           /* --radius-lg = 12px */

/* Soft focus-within treatment */
focus-within:border-vault-accent/60
focus-within:ring-2 focus-within:ring-vault-accent/20

/* Field */
class="search-field"                 /* opts out of the global hard :focus-visible outline */
text-vault-text-primary
placeholder:text-vault-text-tertiary
```

Search icon: 24px, left-aligned, `text-vault-text-tertiary`.

---

### Badge / Tag

**Base:** `inline-flex items-center gap-1 rounded-full font-semibold tracking-wide`

**Sizes:** sm = `px-2 py-0.5 text-[11px]`, md = `px-2.5 py-1 text-xs`

| Variant   | Classes                                                    |
| --------- | ---------------------------------------------------------- |
| Default   | `bg-vault-surface-tertiary text-vault-text-secondary`      |
| Accent    | `bg-vault-accent-subtle text-vault-accent`                 |
| Success   | `bg-vault-status-success-subtle text-vault-status-success` |
| Warning   | `bg-vault-status-warning-subtle text-vault-status-warning` |
| Critical  | `bg-vault-status-critical-subtle text-vault-status-critical` |

Semantic aliases: `private` → default; `shared` / `published` → accent.

---

### Toast / Notification

```text
bg-vault-surface-tertiary
border border-vault-border-default   /* 1px hairline — NOT 3px */
rounded-lg                           /* --radius-lg = 12px */
px-5 py-4
shadow-lg
max-w-[400px]

/* Icon on left, dismiss on right */
flex items-center gap-4
```

Variant colors follow the Badge status utilities (`bg-vault-status-*-subtle` + `text-vault-status-*`).

---

### Modal / Dialog

```text
bg-vault-surface-secondary
border border-vault-border-strong    /* 1px strong hairline — NOT 3px */
rounded-lg                           /* --radius-lg = 12px */
p-8
shadow-xl
max-w-[480px]

/* Backdrop */
bg-vault-surface-overlay             /* dimmed overlay surface */
backdrop-blur-sm
```

---

### Navigation Item

```text
px-4 py-3
rounded-md                           /* --radius-md = 8px */
font-medium
```

| State   | Classes                                                        |
| ------- | -------------------------------------------------------------- |
| Default | `bg-transparent text-vault-text-secondary`                     |
| Hover   | `hover:bg-vault-surface-tertiary hover:text-vault-text-primary` |
| Active  | `bg-vault-accent-subtle text-vault-accent`                     |
| Current | `bg-vault-accent-subtle text-vault-accent` (focused accent reserved for active nav) |

---

### Blink Card

For displaying saved Blinks in the Visual Gallery:

```text
/* Thumbnail area */
aspect-square or aspect-[4/3]        /* visual-first */
object-cover
rounded-md                           /* internal, --radius-md = 8px */

/* NO metadata labels by default (Visual Gallery). */
/* On hover / detail view: */
text-xs text-vault-text-secondary    /* date, subtle */

/* Container */
bg-vault-surface-secondary
border border-vault-border-default   /* 1px hairline — NOT 3px */
rounded-lg                           /* --radius-lg = 12px */
p-0                                  /* edge-to-edge imagery */

hover:border-vault-border-strong
```

> **Broken images fall back gracefully** to a file card / grid icon (`onerror`) — never the browser's
> broken-image glyph.

---

### Vault Intake Zone

```text
/* Default */
bg-vault-surface-secondary
border border-dashed border-vault-border-default   /* 1px dashed hairline — NOT 3px */
rounded-lg                                         /* --radius-lg = 12px */
p-12
text-center
Label: "Add to Vault" or "Drop files here"

/* Hover / Drag-over */
border-vault-accent
border-solid
bg-vault-accent-subtle

/* Icon */
size-12                                            /* 48px */
text-vault-text-tertiary → text-vault-accent on drag

/* Success feedback */
Toast: "Added to your Vault."
```

> **First-run onboarding coach is an in-flow card** (rendered inline in the intake flow), not a fixed
> overlay.

---

## Layout Patterns

### App Shell

```css
Display: grid
Grid-template-columns: 240px 1fr (sidebar + main)
Grid-template-rows: 64px 1fr (header + content)

/* Or for mobile-first */
Flex with collapsible sidebar
```

### Content Grid (Visual Gallery)

The Visual Gallery is Blink's signature view — clean, edge-to-edge, label-free:

```css
Display: grid
Grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
Gap: 8px (spacing.2) — tight for visual density

/* NO text labels or tags in grid view */
/* Metadata appears on hover/selection only */
```

### Stack Layout

```css
Display: flex
Flex-direction: column
Gap: 16px (spacing.4) — standard
Gap: 8px (spacing.2) — compact
Gap: 24px (spacing.6) — spacious
```

---

## Iconography Guidelines

- **Style**: Outlined, 2px stroke weight
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Color**: Inherits from text color
- **Grid**: 24x24 canvas with 2px padding

### Key Icons

| Function           | Icon Reference                    |
| ------------------ | --------------------------------- |
| BlinkVault/Home   | Vault, stack, or central hub      |
| Add to Vault       | Plus, tray, or upload arrow       |
| Sync Drive         | Refresh arrows or linked folders  |
| Send from App      | Arrow-in or forward indicator     |
| Search             | Magnifying glass                  |
| Settings           | Gear                              |
| Share              | Arrow from box                    |
| Delete             | Trash                             |
| Copy Link          | Chain links                       |
| Expire/Timer       | Clock                             |
| Lock               | Padlock                           |
| Success            | Checkmark                         |
| Error              | X or Triangle alert               |

### File-Type Icons (Assets)

Categorical, muted swatches for asset thumbnails. **PDF is neutral** —
`bg-vault-surface-tertiary text-vault-text-secondary` — never the magenta `vault-status-critical`
color (a PDF must not read as an error). Reserve `vault-status-critical` for genuine errors and
destructive actions only.

---

## Animation Guidelines

### Transitions

- Duration: 200ms (effects.motion.duration.normal)
- Easing: ease-in-out

### Micro-interactions

- Button press: Scale 0.98 on active
- Card hover: Subtle border color shift
- Focus: Smooth ring expansion

### Loading States

- Skeleton: Pulse animation between `bg-vault-surface-secondary` and `bg-vault-surface-tertiary`
- Spinner: Circular, `text-vault-accent`, smooth rotation

---

## Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Focus visible on all interactive elements
- [ ] Touch targets ≥ 44x44px
- [ ] Reduced motion respects `prefers-reduced-motion`
- [ ] All icons have aria-labels or are decorative
- [ ] Form inputs have associated labels

---

_Use these patterns as the baseline. Remember: technology is invisible, speed is paramount, visuals
come first._
