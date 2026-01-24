# 🚨 Human Review Required

> **Vaultica Keystone SSoT - Critical Items for Human Decision**  
> Generated: 2026-01-12

This document lists items that require human lead review and decision before the design system can
be considered production-ready.

---

## 🎨 1. Visual Identity Decisions

### 1.1 Primary Accent Color

**Current**: Brand Blue (`oklch(0.7031 0.1426 236.68)` / `#27abec`)

**Decision Needed**: Is this the final brand accent color?

- [x] Approved: Brand blue #27abec (updated 2026-01-16)
- [ ] Provide alternative hue/saturation values
- [ ] Request color exploration options

> ✅ **RESOLVED**: Primary accent color updated to match logo brand blue.

**Impact**: All CTAs, focus states, links, and interactive highlights.

---

### 1.2 Typography Selection

**Current**: Inter (primary) + JetBrains Mono (code)

**Decision Needed**: Final font family selection

- [x] Approve Inter as primary typeface
- [ ] Consider Geist (Vercel's font) as alternative
- [ ] Commission custom typeface
- [ ] Other: **\*\***\_\_\_**\*\***

**Impact**: All text rendering, brand recognition, readability.

---

### 1.3 Logo Design

**Current**: Placeholder SVGs with vault door concept

**Decision Needed**: Professional logo artwork required

- [ ] Engage design agency/freelancer
- [x] Internal design team assignment
- [ ] Provide design brief based on `ai/brand-context.md`

**Deliverables Required**:

- [x] Primary wordmark + icon (`vaultica-logo.svg`)
- [x] Icon-only mark (`vaultica-white-icon.svg`)
- [x] Monochrome version (black version in `vaultica-logo.svg`)
- [x] Reversed (light on dark) version (`vaultica-logo-white.svg`)
- [ ] App icon variants (iOS, Android requirements)
- [x] Favicon set (`favicon.ico`)

> ✅ **IN PROGRESS**: Logo assets added. Use preview tool at `pnpm preview` to review.

---

## 🎯 2. Brand Strategy Decisions

### 2.1 Theme Support

**Current**: Dark theme primary, light theme tokens defined

**Decision Needed**: Light mode support strategy

- [x] Dark-only product (no light mode)
- [ ] User-selectable themes
- [ ] System preference detection
- [ ] Time-based auto-switching

---

### 2.2 Naming Conventions

**Current**: "Vault" terminology (fragments, vault, locker)

**Decision Needed**: Final product vocabulary

- [ ] Review `ai/personality.md` word choices
- [ ] Approve "fragment" as term for saved items
- [ ] Approve terminology table

---

## 🔧 3. Technical Decisions

### 3.1 Repository Setup

**Current**: Package defined as `@vaultica/keystone`

**Decision Needed**: npm registry and access

- [ ] Private npm registry (paid npm, Artifactory, etc.)
- [ ] GitHub Packages
- [x] Git submodule only (no npm)
- [ ] Public npm (if open-sourcing)

---

### 3.2 GitHub Organization

**Current**: CODEOWNERS references `@vaultica/*` teams

**Decision Needed**: Create GitHub teams and assign members

- [ ] `@vaultica/design-system` - DSM owners
- [ ] `@vaultica/design` - Design team
- [ ] `@vaultica/brand` - Brand/marketing
- [ ] `@vaultica/engineering` - Engineers
- [ ] `@vaultica/leads` - Leadership

---

### 3.3 Contrast Verification

**Current**: Colors designed for WCAG AA (4.5:1)

**Action Needed**: Manual verification required

- [ ] Test all text/background combinations
- [ ] Verify focus state visibility
- [ ] Test in colorblind simulation modes
- [ ] Document results

**Tools**: WebAIM Contrast Checker, Stark, or similar.

---

## 📱 4. Platform Integration

### 4.1 Native Platform Assets

**Decision Needed**: iOS/Android-specific requirements

**iOS**:

- [ ] SF Symbols integration or custom icons?
- [ ] Dynamic Type support considerations?

**Android**:

- [ ] Material You / Material Design alignment?
- [ ] Adaptive icons required?

---

### 4.2 Share Extension Appearance

From product spec: "Vaultica appears as a native folder"

**Decision Needed**: Platform-specific share UI design

- [ ] Design share extension UI for iOS
- [ ] Design share target UI for Android
- [ ] Ensure brand consistency in constrained contexts

---

## 💼 5. Business Decisions

### 5.1 Open Source vs. Proprietary

**Current**: Private repository, UNLICENSED

**Decision Needed**: Licensing strategy

- [x] Remain private/proprietary
- [ ] Open source design tokens (MIT/Apache)
- [ ] Provide design system for community use

---

### 5.2 External Tooling

**Decision Needed**: Third-party design tool sync

- [ ] Figma Token Studio integration?
- [ ] Style Dictionary migration for more robust builds?
- [ ] Storybook for component documentation?

---

## ✅ Immediate Actions

| Priority  | Action                | Owner         | Due Date     |
| --------- | --------------------- | ------------- | ------------ |
| 🔴 High   | Approve accent color  | Design Lead   | **\_\_\_\_** |
| 🔴 High   | Initiate logo design  | Brand Team    | **\_\_\_\_** |
| 🟠 Medium | Create GitHub teams   | Engineering   | **\_\_\_\_** |
| 🟠 Medium | Contrast verification | Accessibility | **\_\_\_\_** |
| 🟢 Low    | Decide npm strategy   | Engineering   | **\_\_\_\_** |
| 🟢 Low    | Light mode decision   | Product       | **\_\_\_\_** |

---

## 📋 Sign-off

| Role             | Name                   | Approved | Date         |
| ---------------- | ---------------------- | -------- | ------------ |
| Design Lead      | **\*\***\_\_\_**\*\*** | ☐        | **\_\_\_\_** |
| Engineering Lead | **\*\***\_\_\_**\*\*** | ☐        | **\_\_\_\_** |
| Product Lead     | **\*\***\_\_\_**\*\*** | ☐        | **\_\_\_\_** |
| Brand Lead       | **\*\***\_\_\_**\*\*** | ☐        | **\_\_\_\_** |

---

_This document should be reviewed in a kickoff meeting and updated as decisions are made._
