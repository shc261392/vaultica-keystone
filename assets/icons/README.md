# 🎯 Vaultica Icon Set

This directory contains the custom icon set for Vaultica, designed to match the Industrial Elegance aesthetic.

## Icon Design Specifications

### Style

- **Stroke-based** (not filled)
- **Stroke width**: 2px consistent
- **Line caps**: Round
- **Line joins**: Round
- **Grid**: 24×24 with 2px padding (20×20 live area)

### Sizes

Export each icon at:

- 16×16 (compact UI)
- 20×20 (default)
- 24×24 (comfortable)
- 32×32 (large/touch)

## Required Icons

### Navigation

- [ ] `home.svg` - Vault/home
- [ ] `search.svg` - Magnifying glass
- [ ] `upload.svg` - Arrow up into tray
- [ ] `settings.svg` - Gear/cog
- [ ] `help.svg` - Question mark circle

### Actions

- [ ] `share.svg` - Arrow from box
- [ ] `delete.svg` - Trash can
- [ ] `edit.svg` - Pencil
- [ ] `copy.svg` - Overlapping squares
- [ ] `link.svg` - Chain links
- [ ] `download.svg` - Arrow down to tray

### File Types

- [ ] `image.svg` - Landscape/photo
- [ ] `document.svg` - Page with lines
- [ ] `video.svg` - Play button
- [ ] `audio.svg` - Sound waves

### Status

- [ ] `success.svg` - Checkmark circle
- [ ] `error.svg` - X circle
- [ ] `warning.svg` - Triangle alert
- [ ] `info.svg` - Info circle
- [ ] `loading.svg` - Spinner

### Security/Privacy

- [ ] `lock.svg` - Closed padlock
- [ ] `unlock.svg` - Open padlock
- [ ] `shield.svg` - Shield
- [ ] `key.svg` - Key
- [ ] `timer.svg` - Clock for expiring links

### UI Controls

- [ ] `chevron-up.svg`
- [ ] `chevron-down.svg`
- [ ] `chevron-left.svg`
- [ ] `chevron-right.svg`
- [ ] `close.svg` - X
- [ ] `menu.svg` - Hamburger
- [ ] `more.svg` - Three dots

## Usage in Code

```jsx
// Import as React component
import { IconSearch } from '@vaultica/icons';

// Or use as image
<img src="/icons/search.svg" alt="" role="presentation" />
```

## 🚨 TODO

Icons need to be designed following the specification above. Consider:

- Using Lucide or Heroicons as a base, customized for stroke weight
- Creating a custom set in Figma
- Generating an icon font for performance
