## Description

<!-- Describe the changes you're making -->

## Type of Change

- [ ] 🎨 Token update (colors, typography, spacing, effects)
- [ ] 📝 AI context update (brand-context, personality, patterns)
- [ ] 🖼️ Asset update (logos, icons, social)
- [ ] 🔧 Build/script update
- [ ] 📚 Documentation update
- [ ] 🐛 Bug fix

## Checklist

### Quality Gates (Required for All PRs)

- [ ] ✅ ESLint passes with no errors (`npm run lint`)
- [ ] ✅ Prettier formatting applied (`npm run format:check`)
- [ ] ✅ No spelling errors (`npm run lint:spell`)
- [ ] ✅ Commit messages follow conventional commit format
- [ ] ✅ TypeScript type checking passes (if preview app changes: `cd preview && pnpm type-check`)

### For Token Changes

- [ ] I have tested the build script locally (`npm run build`)
- [ ] I have validated the tokens (`npm run validate`)
- [ ] New colors meet WCAG 2.2 AA contrast requirements (4.5:1 minimum)
- [ ] Changes are reflected in semantic tokens, not just primitives

### For AI Context Changes

- [ ] Changes align with the Vaultica brand voice (Stoic & Precise)
- [ ] Changes don't contradict existing brand guidelines
- [ ] I have reviewed the impact on component patterns

### For Asset Changes

- [ ] SVG files are optimized
- [ ] Assets follow the naming convention
- [ ] README in the asset folder is updated

### For Code Changes (Scripts, Preview App)

- [ ] Code follows the project's coding standards
- [ ] Build succeeds (`npm run build` and/or `pnpm preview:build`)
- [ ] Changes tested locally
- [ ] Inline comments added for complex logic

## Visual Preview

<!-- If applicable, add screenshots or examples of the changes -->

## Notes for Reviewers

<!-- Any additional context or areas to focus review on -->

---

**Remember**: This is an SSoT repo. Changes here propagate to all consuming projects.
