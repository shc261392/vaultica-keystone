# 🧩 Blink Component Patterns

> **For AI/LLM Context**: Reference this document when generating UI components for Blink. These
> patterns ensure visual consistency with the current **calm / trust-first Electric-Blue** system
> (workflow `full-ui-ux-redesign`). The older "Industrial Elegance / brutalist 3px border / #27abec"
> guidance below has been superseded — see the reconciled principles.
>
> **Where the tokens live:** the working token source of truth is `src/styles/globals.css` `@theme`
> (the keystone `dist/theme.css` is imported but overridden). Two themes ship: **`blink`** (dark,
> Electric-Blue `#00F0FF`, default) and **`paper`** (light, on-brand teal `#007f8a`). `aurora` was removed.
>
> **Primitive component library** (`src/lib/components/ui/`, Svelte 5): `Button`, `Card`, `Input`,
> `Textarea`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState`, `StreamingState`, plus `Icon`, `Modal`,
> `TierBadge`, `ThemeSwitcher`. Variant/size class maps live in `variants.ts`; `cn()` in `src/lib/cn.ts`.
> Convention: `interface Props { …; class?: string }` + `$props()`; callback-prop events (no dispatcher);
> Snippets for slots; semantic `vault-*` token utilities only (never hardcoded hex).

---

## Design Principles Recap (reconciled — calm / trust-first)

1. **Hairline borders + elevation** — 1px `vault-border-default` + soft shadow (not 3px brutalist).
2. **Comfortable contrast** — dark surfaces `#070d10`/`#0c1820`, text `#e4f8ff`; AA-verified on both themes.
3. **Focused accent** — Electric-Blue `#00F0FF` (dark) / teal `#007f8a` (light) reserved for CTAs, focus ring, active nav — not large fills; reduced glow.
4. **Precision** — clean geometry, purposeful spacing, generous whitespace.
5. **Provenance colors** — fixed & theme-independent: `--color-cite-vault` (blue) / `--color-cite-web` (ember) for citation source signals; always paired with a label/icon (never color alone).

> _Legacy note: the section below (#27abec, 3px borders, `#1e2329`) reflects the retired
> "Industrial Elegance" system and is kept only for historical reference._

---

## Core Components

> **Single accent.** Indigo was removed entirely — Electric-Blue (`blink`) / teal (`paper`) is the
> only interactive accent. All colors below are semantic `vault-*` utilities (never raw palette scale
> like `neutral-700`, `accent-900`, or hardcoded hex). Class maps mirror `variants.ts`.

### Button

**Base** (`BUTTON_BASE`):

```text
inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap
transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none
```

`rounded-md` = `--radius-md` (10px). Keyboard focus is handled globally by
`:focus-visible { outline: 2px solid var(--color-vault-border-focus); outline-offset: 2px }`.

**Variants:**

| Variant   | Classes                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Primary   | `bg-vault-accent text-vault-accent-fg hover:bg-vault-accent-hover active:bg-vault-accent-active border border-transparent`   |
| Secondary | `bg-transparent text-vault-text-primary border border-vault-border-strong hover:bg-vault-surface-tertiary`                   |
| Ghost     | `bg-transparent text-vault-text-secondary border border-transparent hover:bg-vault-surface-tertiary hover:text-vault-text-primary` |
| Danger    | `bg-vault-status-critical-subtle text-vault-status-critical border border-vault-status-critical-subtle hover:bg-vault-status-critical/15` |

> **Primary text is `text-vault-accent-fg`** — dark navy (`#070d10`) on the `blink` dark theme, white
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
rounded-lg                           /* --radius-lg = 16px */
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
rounded-md                           /* --radius-md = 10px */
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
rounded-lg                           /* --radius-lg = 16px */

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
rounded-lg                           /* --radius-lg = 16px */
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
rounded-lg                           /* --radius-lg = 16px */
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
rounded-md                           /* --radius-md = 10px */
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
rounded-md                           /* internal, --radius-md = 10px */

/* NO metadata labels by default (Visual Gallery). */
/* On hover / detail view: */
text-xs text-vault-text-secondary    /* date, subtle */

/* Container */
bg-vault-surface-secondary
border border-vault-border-default   /* 1px hairline — NOT 3px */
rounded-lg                           /* --radius-lg = 16px */
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
rounded-lg                                         /* --radius-lg = 16px */
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
| Blink Vault/Home   | Vault, stack, or central hub      |
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
