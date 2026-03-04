# 🎯 Icon Button Philosophy & Icon Set

> **For AI/LLM Context**: This document defines the complete icon button design system for Blink
> Vault. Reference this when implementing any UI actions, buttons, or interactive elements.

---

## Philosophy: Less is More

### Philosophy: Less is More

Show, don't tell. Graphic over textual. Intuitive and zero friction.

Icons are the primary language of action in Blink Vault. They communicate instantly, transcend
language barriers, and keep the interface clean.

### Core Principles

1. **Icon-First** — Default to icon-only; add labels only when ambiguity exists
2. **Universal Symbols** — Use widely recognized iconography (trash = delete, heart = favorite)
3. **Consistent Sizing** — Maintain visual rhythm across the interface
4. **Touch-Friendly** — All interactive elements meet 44×44px minimum touch target
5. **Accessible Always** — Every icon button includes a proper `aria-label`

---

## Icon Library Standard

**Library**: [Lucide React](https://lucide.dev/) (`lucide-react`)

- 1000+ icons with consistent 2px stroke weight
- Matches Industrial Elegance aesthetic
- Tree-shakeable, actively maintained

---

## Design Specifications

### Sizing Scale

| Size | Icon | Button | Use Case                                    |
| ---- | ---- | ------ | ------------------------------------------- |
| `sm` | 16px | 32px   | Dense toolbars, inline actions               |
| `md` | 20px | 40px   | **Default** — primary actions, navigation    |
| `lg` | 24px | 48px   | Hero actions, mobile CTA                     |
| `xl` | 32px | 56px   | FABs, splash screens                         |

### Spacing

```text
Icon-only padding:   (button-size − icon-size) / 2
Icon + Label gap:    8px
```

### Touch Targets

Minimum touch target: **44×44px**. For `sm` buttons (32px), expand the clickable area:

```css
position: relative;
::before { content: ''; position: absolute; inset: -6px; }
```

---

## State Definitions

| State    | Color                       | Background                  | Scale  | Transition |
| -------- | --------------------------- | --------------------------- | ------ | ---------- |
| Default  | `--vault-text-secondary`    | `transparent`               | 1      | 150ms ease |
| Hover    | `--vault-text-primary`      | `--vault-surface-tertiary`  | 1.05   | 150ms ease |
| Active   | `--vault-accent`            | `--vault-surface-tertiary`  | 0.98   | 50ms ease  |
| Focus    | —                           | 2px outline `--vault-accent`| —      | —          |
| Disabled | `--vault-text-tertiary`     | `transparent`               | —      | —          |
| Loading  | `--vault-text-tertiary`     | `transparent`               | —      | spin       |
| Selected | `--vault-accent`            | `brand-blue/10`             | —      | 150ms ease |

---

## Complete Icon Set

### File Operations

| Action           | Lucide Icon       | Variant      | Size  |
| ---------------- | ----------------- | ------------ | ----- |
| Upload           | `Upload`          | Icon + Label | md/lg |
| Download         | `Download`        | Icon-only    | md    |
| Copy             | `Copy`            | Icon-only    | sm/md |
| Paste            | `ClipboardPaste`  | Icon-only    | md    |
| Delete           | `Trash2`          | Icon-only    | md    |
| Permanent Delete | `Trash`           | Icon + Label | md    |
| Duplicate        | `CopyPlus`        | Icon-only    | md    |
| Move             | `FolderInput`     | Icon + Label | md    |
| Rename           | `Edit3`           | Icon-only    | sm/md |
| Export           | `PackageOpen`     | Icon + Label | md    |
| Import           | `PackageDown`     | Icon + Label | md    |

### Navigation

| Action            | Lucide Icon                           | Variant   | Size |
| ----------------- | ------------------------------------- | --------- | ---- |
| Home              | `Home`                                | Icon-only | md   |
| Back              | `ArrowLeft`                           | Icon-only | md   |
| Forward           | `ArrowRight`                          | Icon-only | md   |
| Menu              | `Menu`                                | Icon-only | md   |
| Close             | `X`                                   | Icon-only | md   |
| Expand            | `Expand`                              | Icon-only | sm   |
| Collapse          | `Shrink`                              | Icon-only | sm   |
| Fullscreen        | `Maximize2`                           | Icon-only | sm   |
| Sidebar Toggle    | `PanelLeftOpen` / `PanelLeftClose`    | Icon-only | md   |
| External Link     | `ExternalLink`                        | Icon-only | sm   |
| Chevron Up/Down   | `ChevronUp` / `ChevronDown`          | Icon-only | sm   |

### Communication & Sharing

| Action    | Lucide Icon | Variant      | Size |
| --------- | ----------- | ------------ | ---- |
| Share     | `Share2`    | Icon + Label | md   |
| Copy Link | `Link`      | Icon + Label | md   |
| Unlink    | `Unlink`    | Icon-only    | md   |
| Email     | `Mail`      | Icon-only    | md   |
| QR Code   | `QrCode`    | Icon + Label | md   |
| Embed     | `Code2`     | Icon + Label | md   |

### Content Management

| Action       | Lucide Icon      | Variant      | Size  |
| ------------ | ---------------- | ------------ | ----- |
| Edit         | `Edit`           | Icon-only    | md    |
| Save         | `Save`           | Icon + Label | md    |
| Undo         | `Undo2`          | Icon-only    | md    |
| Redo         | `Redo2`          | Icon-only    | md    |
| Pin / Unpin  | `Pin` / `PinOff` | Icon-only    | md    |
| Bookmark     | `Bookmark`       | Icon-only    | md    |
| Archive      | `Archive`        | Icon-only    | md    |
| Tag          | `Tag`            | Icon + Label | md    |
| Filter       | `Filter`         | Icon + Label | md    |
| Sort         | `ArrowUpDown`    | Icon + Label | sm/md |
| Search       | `Search`         | Icon-only    | md    |
| Clear Search | `X`              | Icon-only    | sm    |

### Vault-Specific Actions

| Action         | Lucide Icon   | Variant      | Size  |
| -------------- | ------------- | ------------ | ----- |
| Blink (save)   | `Zap`         | Icon + Label | lg/xl |
| Vault Home     | `Vault`       | Icon + Label | md    |
| Lock           | `Lock`        | Icon-only    | md    |
| Unlock         | `LockOpen`    | Icon-only    | md    |
| Shield         | `Shield`      | Icon-only    | md    |
| Key            | `Key`         | Icon + Label | md    |
| Preview        | `Eye`         | Icon-only    | md    |
| Hide           | `EyeOff`      | Icon-only    | md    |
| New Collection | `FolderPlus`  | Icon + Label | md    |

### System

| Action        | Lucide Icon      | Variant   | Size  |
| ------------- | ---------------- | --------- | ----- |
| Settings      | `Settings`       | Icon-only | md    |
| Preferences   | `Sliders`        | Icon + Label | md |
| Notifications | `Bell`           | Icon-only | md    |
| User Profile  | `User`           | Icon-only | md    |
| Help          | `HelpCircle`     | Icon-only | md    |
| Info          | `Info`           | Icon-only | sm    |
| Refresh       | `RefreshCw`      | Icon-only | md    |
| Sync          | `RefreshCcw`     | Icon-only | md    |
| Check         | `Check`          | Icon-only | sm/md |
| Warning       | `AlertTriangle`  | Icon-only | sm/md |
| Error         | `XCircle`        | Icon-only | sm/md |
| More          | `MoreVertical`   | Icon-only | md    |

### Media & View

| Action     | Lucide Icon       | Variant   | Size  |
| ---------- | ----------------- | --------- | ----- |
| Play       | `Play`            | Icon-only | md    |
| Pause      | `Pause`           | Icon-only | md    |
| Image      | `Image`           | Label-only| sm    |
| Video      | `Video`           | Label-only| sm    |
| Document   | `FileText`        | Label-only| sm    |
| Grid View  | `LayoutGrid`      | Icon-only | md    |
| List View  | `LayoutList`      | Icon-only | md    |
| Gallery    | `Images`          | Icon-only | md    |
| Zoom In    | `ZoomIn`          | Icon-only | sm    |
| Zoom Out   | `ZoomOut`         | Icon-only | sm    |
| Rotate     | `RotateCw`        | Icon-only | sm    |

### Social

| Action  | Lucide Icon      | Variant      | Size |
| ------- | ---------------- | ------------ | ---- |
| Like    | `Heart`          | Icon-only    | md   |
| Comment | `MessageSquare`  | Icon + Label | md   |
| Flag    | `Flag`           | Icon-only    | md   |
| Report  | `AlertOctagon`   | Icon + Label | md   |
| Star    | `Star`           | Icon-only    | sm   |

---

## Usage Guide

### Icon-Only — for universal actions

Use when the action is instantly recognizable. Always include `aria-label`.

### Icon + Label — for CTAs and ambiguous actions

Use for primary actions (Upload, Share, Blink) or when the icon alone may be unclear.

### Label-Only — for descriptive actions

Use when no icon adds clarity ("Download All as ZIP").

---

## Accessibility

- Every icon-only button requires `aria-label`
- Toggle buttons use `aria-pressed`
- Loading buttons use `aria-busy="true"`
- Focus ring: `2px solid var(--vault-accent)` with `2px` offset
- Tab order follows logical reading flow
- Enter/Space activates; Escape dismisses dialogs

---

_Icons are the fastest interface. When in doubt, let the icon speak._
