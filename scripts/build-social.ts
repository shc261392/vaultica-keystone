/**
 * Social kit builder: writes SVG sources to assets/social/src/ and renders PNGs
 * to assets/social/. Text comes from BRAND (mirrors vaultica-web/src/lib/brand.ts).
 * Run: pnpm build:social
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOCIAL = join(ROOT, 'assets', 'social');
const SRC = join(SOCIAL, 'src');

// Source: vaultica-web/src/lib/brand.ts (BRAND, BRAND_LINKS.app)
const BRAND = {
  name: 'BlinkVault',
  tagline: 'Dump anything. Ask anything. See the source.',
  lines: ['Dump anything.', 'Ask anything.', 'See the source.'],
  host: 'blink.vaultica.io',
};

// Source: tokens/vault-theme.json, theme.blink
const C = {
  surface: '#0E1013',
  border: '#25292F',
  text: '#ECEDF0',
  textSecondary: '#9CA1AB',
  accent: '#3CC8D0',
};

const FONT = "Geist, 'Geist Variable', sans-serif";

// Inner elements of the Stacked B mark (32x32 viewBox) from assets/logos/mark.svg.
const markSvg = readFileSync(join(ROOT, 'assets', 'logos', 'mark.svg'), 'utf8');
const markInner = markSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

/** Place the mark with its top-left at (x, y), `size` px wide. */
const mark = (x: number, y: number, size: number): string =>
  `<g transform="translate(${x} ${y}) scale(${size / 32})">${markInner}</g>`;

const svg = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
  `<rect width="${w}" height="${h}" fill="${C.surface}"/>\n${body}\n</svg>\n`;

const text = (
  x: number,
  y: number,
  size: number,
  weight: number,
  fill: string,
  content: string,
  anchor: 'start' | 'middle' = 'start',
  spacing = 0
): string =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" ` +
  `fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${content}</text>`;

interface Asset {
  file: string;
  w: number;
  h: number;
  body: string;
}

const assets: Asset[] = [
  // Profile avatar: mark centred, ~60% of the canvas (survives circular crops).
  { file: 'avatar', w: 400, h: 400, body: mark(80, 80, 240) },
  // Reddit community icon: mark ~58% of the canvas (survives circular crops).
  { file: 'reddit-icon', w: 256, h: 256, body: mark(54, 54, 148) },
  // X header: avatar overlaps the bottom-left on mobile and top/bottom edges crop,
  // so everything sits right of x=520 and between y=130 and y=370.
  {
    file: 'x-header',
    w: 1500,
    h: 500,
    body: [
      mark(560, 150, 104),
      text(690, 222, 64, 600, C.text, BRAND.name, 'start', -1.5),
      text(560, 310, 30, 400, C.textSecondary, BRAND.tagline),
      `<rect x="560" y="338" width="64" height="2" fill="${C.accent}"/>`,
    ].join('\n'),
  },
  // Reddit banner: sides crop on narrow screens, so everything is centred in the middle ~1000px.
  {
    file: 'reddit-banner',
    w: 1920,
    h: 384,
    body: [
      mark(960 - 36, 88, 72),
      text(960, 214, 56, 600, C.text, BRAND.name, 'middle', -1.5),
      text(960, 270, 28, 400, C.textSecondary, BRAND.tagline, 'middle'),
    ].join('\n'),
  },
  // Generic link card (Open Graph size).
  {
    file: 'link-card',
    w: 1200,
    h: 630,
    body: [
      `<rect x="40" y="40" width="1120" height="550" rx="12" fill="none" stroke="${C.border}" stroke-width="1"/>`,
      mark(96, 96, 72),
      text(188, 148, 40, 600, C.text, BRAND.name, 'start', -1),
      text(96, 300, 76, 600, C.text, BRAND.lines[0], 'start', -2),
      text(96, 392, 76, 600, C.text, BRAND.lines[1], 'start', -2),
      text(96, 484, 76, 600, C.accent, BRAND.lines[2], 'start', -2),
      text(96, 548, 26, 400, C.textSecondary, BRAND.host),
    ].join('\n'),
  },
];

mkdirSync(SRC, { recursive: true });
for (const a of assets) {
  const source = svg(a.w, a.h, a.body);
  writeFileSync(join(SRC, `${a.file}.svg`), source);
  const png = new Resvg(source, {
    fitTo: { mode: 'original' },
    font: {
      loadSystemFonts: false,
      fontFiles: [
        join(SOCIAL, 'fonts', 'Geist-Regular.ttf'),
        join(SOCIAL, 'fonts', 'Geist-SemiBold.ttf'),
      ],
      defaultFontFamily: 'Geist',
    },
  })
    .render()
    .asPng();
  writeFileSync(join(SOCIAL, `${a.file}.png`), png);
  console.log(`✓ ${a.file}.png ${a.w}x${a.h} (${png.length} bytes)`);
}
