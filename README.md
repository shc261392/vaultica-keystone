# 🏛️ Vaultica: Keystone SSoT

![Quality Gate](https://github.com/vaultica/keystone/actions/workflows/quality-gate.yml/badge.svg)
![Build Tokens](https://github.com/vaultica/keystone/actions/workflows/build.yml/badge.svg)
![Validate](https://github.com/vaultica/keystone/actions/workflows/validate.yml/badge.svg)

This repository is the **Keystone**—the Single Source of Truth (SSoT) for the **Vaultica** brand. It
is designed to treat brand assets as version-controlled code, ensuring consistency across Web,
Mobile, and AI-driven development.

> **For AI Agents & Contributors**: See [AI-AGENTS.md](AI-AGENTS.md) for quality tools and workflow
> guide.

## 🛡️ Brand Soul: Vaultica

- **Core Metaphor**: The Vault—Absolute security, organized complexity, and timeless stability.
- **Visual Aesthetic**: "Industrial Elegance." High-contrast, brutalist precision, and a focus on
  "Visual Weight."
- **Tone**: Secure, Authoritative, and Effortless.

---

## 📂 Repository Structure

````text
/
├── .github/                # Automation (JSON to CSS/Tailwind builds)
├── ai/
│   ├── brand-context.md    # The Vaultica "Soul" for LLM context
│   └── personality.md      # Voice & Tone rules for AI copy
├── tokens/                 # Design Tokens (The Truth)
│   ├── colors.json         # OKLCH/HSL values (Functional naming)
│   ├── typography.json     # Font scales for the Vaultica identity
│   └── effects.json        # Shadow and border definitions
├── assets/
│   ├── logos/              # SVG Primary & Monochrome assets
│   └── social/             # Brand-aligned OG images and avatars
├── dist/                   # Generated build artifacts (theme.css)
├── scripts/                # Token transformation scripts
└── README.md               # Documentation
## 🛠️ Development Setup

This project uses **mise** for runtime version management.

### Prerequisites

1. Install [mise](https://mise.jdx.dev/) (or use any Node 24 setup)
2. Run the setup commands:

```bash
mise install        # Installs Node.js 24
pnpm install        # Installs dependencies
````

---

## 🚀 The Vaultica Sync Flow

### 1. The "Set Once" Rule

All style changes must happen in `/tokens/`. Never edit `theme.css` directly.

### 2. The Build Process

Run the transformation script to propagate token changes:

```bash
pnpm run build      # Syncs JSON tokens to CSS and Tailwind
pnpm run validate   # Validates token structure
```

### 3. Consumption (Single Dev Workflow)

Project Integration: Add this repo as a Git Submodule: git submodule add [URL] vaultica-brand

AI Integration: Point Cursor/Copilot to vaultica-brand/ai/brand-context.md for styling logic.

✅ Consistency Checklist [ ] Contrast: All action tokens must meet WCAG 2.2 AA standards.

[ ] Scalability: All logo assets in /assets/logos/ must be optimized SVGs.

[ ] AI Alignment: Ensure .cursorrules in your main project points to this repo.
