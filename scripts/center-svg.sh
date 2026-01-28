#!/bin/bash
# center-svg.sh - Analyze and report SVG centering
# 
# Usage: ./scripts/center-svg.sh <svg-file> [--fix]
#
# This script uses ImageMagick to calculate the bounding box of SVG content
# and reports positioning information for manual centering adjustment.
#
# Prerequisites: ImageMagick 7+ (magick command)

set -e

if [[ -z "$1" ]]; then
  echo "Usage: $0 <svg-file> [--analyze-all]"
  echo ""
  echo "Options:"
  echo "  --analyze-all    Analyze all blink*.svg files in assets/logos/"
  exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

analyze_svg() {
  local file="$1"
  
  if [[ ! -f "$file" ]]; then
    echo -e "${RED}Error: File not found: $file${NC}"
    return 1
  fi
  
  # Get bounding box info from ImageMagick
  # Output format: filename SVG WxH ViewWxViewH+OffsetX+OffsetY ...
  local info
  info=$(magick "$file" -background none -flatten -trim info: 2>/dev/null)
  
  if [[ -z "$info" ]]; then
    echo -e "${RED}Error: Could not analyze $file${NC}"
    return 1
  fi
  
  # Parse the output
  # Example: file.svg SVG 291x172 512x512+110+170 16-bit sRGB ...
  local content_dims view_dims
  content_dims=$(echo "$info" | grep -oE '[0-9]+x[0-9]+ [0-9]+x[0-9]+\+[0-9]+\+[0-9]+' | head -1)
  
  if [[ -z "$content_dims" ]]; then
    echo -e "${YELLOW}Warning: Could not parse dimensions for $file${NC}"
    echo "  Raw info: $info"
    return 1
  fi
  
  # Extract values
  local content_w content_h view_w view_h offset_x offset_y
  content_w=$(echo "$content_dims" | sed -E 's/([0-9]+)x.*/\1/')
  content_h=$(echo "$content_dims" | sed -E 's/[0-9]+x([0-9]+) .*/\1/')
  view_w=$(echo "$content_dims" | sed -E 's/.* ([0-9]+)x.*/\1/')
  view_h=$(echo "$content_dims" | sed -E 's/.* [0-9]+x([0-9]+)\+.*/\1/')
  offset_x=$(echo "$content_dims" | sed -E 's/.*\+([0-9]+)\+.*/\1/')
  offset_y=$(echo "$content_dims" | sed -E 's/.*\+([0-9]+)$/\1/')
  
  # Calculate margins
  local left_margin right_margin top_margin bottom_margin
  left_margin=$offset_x
  right_margin=$((view_w - offset_x - content_w))
  top_margin=$offset_y
  bottom_margin=$((view_h - offset_y - content_h))
  
  # Calculate ideal centered position
  local ideal_x ideal_y delta_x delta_y
  ideal_x=$(( (view_w - content_w) / 2 ))
  ideal_y=$(( (view_h - content_h) / 2 ))
  delta_x=$((ideal_x - offset_x))
  delta_y=$((ideal_y - offset_y))
  
  # Determine if centered (within 2px tolerance)
  local h_status v_status
  if [[ ${delta_x#-} -le 2 ]]; then
    h_status="${GREEN}✓${NC}"
  else
    h_status="${RED}✗${NC}"
  fi
  
  if [[ ${delta_y#-} -le 2 ]]; then
    v_status="${GREEN}✓${NC}"
  else
    v_status="${RED}✗${NC}"
  fi
  
  # Output
  local filename
  filename=$(basename "$file")
  
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}File:${NC} $filename"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  ViewBox:      ${view_w} × ${view_h}"
  echo -e "  Content:      ${content_w} × ${content_h}"
  echo ""
  echo -e "  ${YELLOW}Horizontal:${NC} $h_status"
  echo -e "    Left margin:   ${left_margin}px"
  echo -e "    Right margin:  ${right_margin}px"
  if [[ $delta_x -ne 0 ]]; then
    echo -e "    ${YELLOW}→ Shift by: ${delta_x}px (adjust tx by ${delta_x})${NC}"
  fi
  echo ""
  echo -e "  ${YELLOW}Vertical:${NC} $v_status"
  echo -e "    Top margin:    ${top_margin}px"
  echo -e "    Bottom margin: ${bottom_margin}px"
  if [[ $delta_y -ne 0 ]]; then
    echo -e "    ${YELLOW}→ Shift by: ${delta_y}px (adjust ty by ${delta_y})${NC}"
  fi
  echo ""
  
  # Return non-zero if not centered
  if [[ ${delta_x#-} -gt 2 ]] || [[ ${delta_y#-} -gt 2 ]]; then
    return 1
  fi
  return 0
}

# Main
if [[ "$1" == "--analyze-all" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  LOGOS_DIR="$SCRIPT_DIR/../assets/logos"
  
  echo -e "${BLUE}Analyzing all blink*.svg files...${NC}"
  echo ""
  
  centered=0
  not_centered=0
  
  for svg in "$LOGOS_DIR"/blink*.svg; do
    if analyze_svg "$svg"; then
      ((centered++)) || true
    else
      ((not_centered++)) || true
    fi
  done
  
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}Summary${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "  ${GREEN}Centered:${NC}     $centered"
  echo -e "  ${RED}Not centered:${NC} $not_centered"
else
  analyze_svg "$1"
fi
