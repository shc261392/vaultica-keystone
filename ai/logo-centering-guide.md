# SVG Logo Centering Guide

> **Purpose**: Programmatically verify and fix centering of SVG logos using ImageMagick.

---

## Quick Start

```bash
# Make script executable
chmod +x scripts/center-svg.sh

# Analyze a single file
./scripts/center-svg.sh assets/logos/blink-icon.svg

# Analyze all blink*.svg files
./scripts/center-svg.sh --analyze-all
```

---

## Prerequisites

- **ImageMagick 7+** with SVG support

```bash
# Install on macOS
brew install imagemagick

# Verify installation
magick --version
```

---

## How It Works

### 1. Get Bounding Box

ImageMagick renders the SVG and trims transparent pixels to find the actual content bounds:

```bash
magick file.svg -background none -flatten -trim info:
```

**Output format:**

```text
file.svg SVG 291x172 512x512+110+170 16-bit sRGB ...
           │     │       │      │
           │     │       │      └─ Y offset from top
           │     │       └─ X offset from left
           │     └─ ViewBox dimensions
           └─ Content dimensions (after trim)
```

### 2. Calculate Margins

```text
left_margin   = offset_x
right_margin  = view_w - offset_x - content_w
top_margin    = offset_y
bottom_margin = view_h - offset_y - content_h
```

### 3. Calculate Adjustment

```text
ideal_x = (view_w - content_w) / 2
ideal_y = (view_h - content_h) / 2

delta_x = ideal_x - offset_x  # positive = shift right
delta_y = ideal_y - offset_y  # positive = shift down
```

### 4. Apply to SVG Transform

For SVGs using `transform="translate(tx, ty) scale(sx, sy)"`:

**Empirical Approach (Recommended):** Test incrementally to find the correct adjustment ratio:

```bash
# Test a range of tx values
for tx in -50 -100 -150 -200; do
  sed "s/translate(-100/translate($tx/" file.svg > /tmp/test.svg
  magick /tmp/test.svg -background none -flatten -trim info:
done
```

Then calculate the ratio: `(offset_change) / (tx_change)` and use it to find the exact tx/ty values.

**Note:** Due to how SVG transforms compose, the relationship between translate values and rendered
position may not follow a simple `scale × delta` formula. Always verify with ImageMagick.

---

## Example: Centering blink-icon.svg

### Initial Analysis

```bash
$ magick blink-icon.svg -background none -flatten -trim info:
blink-icon.svg SVG 291x172 512x512+155+157 ...
```

**Interpretation:**

- Content: 291×172 pixels
- ViewBox: 512×512
- Position: left=155, top=157

**Margins:**

- Left: 155px, Right: 66px ❌ (difference: 89px)
- Top: 157px, Bottom: 183px ❌ (difference: 26px)

### Calculate Adjustment

```text
ideal_x = (512 - 291) / 2 = 110.5
ideal_y = (512 - 172) / 2 = 170

delta_x = 110.5 - 155 = -44.5  (shift left)
delta_y = 170 - 157 = 13       (shift down)
```

### Apply Fix

Original transform:

```xml
<g transform="translate(-152, 536) scale(0.0915, -0.0915)" ...>
```

After adjustment:

```xml
<g transform="translate(-179.5, 493) scale(0.085, -0.085)" ...>
```

### Verify

```bash
$ magick blink-icon.svg -background none -flatten -trim info:
blink-icon.svg SVG 292x172 512x512+110+170 ...
```

**Margins:**

- Left: 110px, Right: 110px ✓
- Top: 170px, Bottom: 170px ✓

---

## Text-Based SVGs

For SVGs with text elements, use `text-anchor="middle"` and `x="50%"`:

```xml
<!-- Before: manually positioned -->
<text x="40" y="100" ...>Blink</text>

<!-- After: auto-centered horizontally -->
<text x="50%" y="100" text-anchor="middle" ...>Blink</text>
```

For vertical centering, use `dominant-baseline="central"`:

```xml
<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" ...>
  Blink
</text>
```

---

## Script Reference

### center-svg.sh

| Option          | Description                    |
| --------------- | ------------------------------ |
| `<file>`        | Analyze a single SVG file      |
| `--analyze-all` | Analyze all `blink*.svg` files |

### Output Interpretation

```text
═══════════════════════════════════════════════════════════
File: blink-icon.svg
═══════════════════════════════════════════════════════════

  ViewBox:      512 × 512
  Content:      292 × 172

  Horizontal: ✓
    Left margin:   110px
    Right margin:  110px

  Vertical: ✓
    Top margin:    170px
    Bottom margin: 170px
```

- ✓ = Centered (within 2px tolerance)
- ✗ = Not centered (shows required adjustment)

---

## Common Issues

### 1. Empty or Invisible Content

If ImageMagick reports 0×0 content, the SVG may:

- Have no visible paths (check `fill` and `stroke`)
- Use external fonts that aren't loaded
- Have paths outside the viewBox

### 2. Font Rendering Differences

Text-based SVGs may render differently across systems. Use:

- Web fonts with `@import url(...)` in `<style>`
- System font fallbacks
- Convert text to paths for critical logos

**ImageMagick text rendering requires additional dependencies:**

```bash
# Install Ghostscript and FreeType for font support
brew install ghostscript freetype

# Without these, text-based SVGs will fail analysis with:
# "delegate library support not built-in 'none' (Freetype)"
# "gs: command not found"
```

### 3. Transform Order

SVG transforms are applied right-to-left:

```xml
transform="translate(tx, ty) scale(sx, sy)"
```

1. First: scale is applied
2. Then: translate is applied

---

## Files Reference

| File                      | Type       | Notes                      |
| ------------------------- | ---------- | -------------------------- |
| `blink-icon.svg`          | Path-based | Use transform adjustment   |
| `blink-logo-clean.svg`    | Path-based | Use transform adjustment   |
| `blink-logo-text.svg`     | Text-based | Use `text-anchor="middle"` |
| `blink-logo-dark.svg`     | Text-based | Use `text-anchor="middle"` |
| `blink-vault-logo-*.svg`  | Text-based | Manual positioning         |
| `blink-*-with-icon-*.svg` | Mixed      | Icon + text positioning    |
