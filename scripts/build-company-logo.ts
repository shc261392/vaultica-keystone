/**
 * Vaultica company mark ("Chevron shield") builder: writes the SVG logos to
 * assets/logos/, the PNG icon set to assets/logos/vaultica/ and the Stripe
 * branding PNGs to assets/stripe/. Vaultica is the company; BlinkVault (the
 * Stacked B, assets/logos/mark.svg) is the product and is not touched here.
 * Run: pnpm build:logo
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGOS = join(ROOT, 'assets', 'logos');
const ICONS = join(LOGOS, 'vaultica');
const STRIPE = join(ROOT, 'assets', 'stripe');

// Source: tokens/vault-theme.json (paper = light, blink = dark)
const C = {
  accent: '#0A7C86',
  accentDark: '#3CC8D0',
  ink: '#141619',
  textDark: '#ECEDF0',
  surfaceDark: '#0E1013',
  white: '#FFFFFF',
};

/**
 * The "Chevron shield" on a 64-unit grid: a closed, flat-topped shield (the
 * outline is never broken) with a V chevron cut through it. One even-odd
 * path, so the chevron is a real hole in transparent and one-colour uses.
 * Corners are rounded at r = 1.5; visible bounds x 10.5–53.5, y 7.5–56.5.
 * The chevron is a 6.5-unit stroke along (20.5,19)–(32,36.5)–(43.5,19),
 * cut flat at y = 19 with a mitred point.
 */
const SHIELD_OUTLINE =
  'M10.5 9A1.5 1.5 0 0 1 12 7.5H52A1.5 1.5 0 0 1 53.5 9V28' +
  'C53.5 42.8 44.6 51.6 32.55 56.3Q32 56.5 31.45 56.3C19.4 51.6 10.5 42.8 10.5 28Z';
const CHEVRON = 'M16.61 19H24.39L32 30.58L39.61 19H47.39L32 42.42Z';
const SHIELD_BOX = { x: 10.5, y: 7.5, w: 43, h: 49 };

const shield = (fill: string): string =>
  `<path d="${SHIELD_OUTLINE}${CHEVRON}" fill="${fill}" fill-rule="evenodd"/>`;

/** Shield scaled by `s` about the centre of the 64 grid. */
const shieldAt = (s: number, fill: string): string =>
  `<g transform="translate(${32 - 32 * s} ${32 - 32 * s}) scale(${s})">${shield(fill)}</g>`;

/** App tile: same 4/56/16 rounded square as the BlinkVault mark (2/28/8 on 32). */
const tile = (bg: string, fg: string): string =>
  `<rect x="4" y="4" width="56" height="56" rx="16" fill="${bg}"/>${shieldAt(0.7, fg)}`;

const wordmark = JSON.parse(readFileSync(join(LOGOS, 'src', 'vaultica-wordmark.json'), 'utf8')) as {
  capHeight: number;
  bbox: [number, number, number, number];
  d: string;
};

const svg = (w: number, h: number, body: string, label = 'Vaultica'): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`;

// Horizontal lockup, same ratios as the BlinkVault wordmark:
// mark height = 1.5 × cap height, gap = 0.4 × mark width, cap centred on the mark.
const MARK_H = 1.5 * wordmark.capHeight;
const K = MARK_H / SHIELD_BOX.h;
const MARK_W = SHIELD_BOX.w * K;
const GAP = 0.4 * MARK_W;
const TEXT_X = MARK_W + GAP - wordmark.bbox[0];
const BASELINE = MARK_H / 2 + wordmark.capHeight / 2;
const LOCKUP_W = Math.ceil(TEXT_X + wordmark.bbox[2]);
const LOCKUP_H = Math.ceil(MARK_H);

const lockupBody = (mark: string, text: string): string =>
  `<g transform="scale(${K.toFixed(5)}) translate(${-SHIELD_BOX.x} ${-SHIELD_BOX.y})">${shield(mark)}</g>\n` +
  `<path transform="translate(${TEXT_X.toFixed(2)} ${BASELINE.toFixed(2)})" d="${wordmark.d}" fill="${text}"/>`;

/** Place a W×H lockup or 64-grid art inside a canvas, centred, `frac` of the canvas width/height. */
const fit = (cw: number, ch: number, w: number, h: number, frac: number, body: string): string => {
  const s = Math.min((cw * frac) / w, (ch * frac) / h);
  const x = (cw - w * s) / 2;
  const y = (ch - h * s) / 2;
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(5)})">${body}</g>`;
};

/** Shield glyph centred on its visible box, filling `frac` of a square canvas. */
const shieldIn = (size: number, frac: number, fill: string): string =>
  fit(
    size,
    size,
    SHIELD_BOX.w,
    SHIELD_BOX.h,
    frac,
    `<g transform="translate(${-SHIELD_BOX.x} ${-SHIELD_BOX.y})">${shield(fill)}</g>`
  );

const bg = (w: number, h: number, fill: string | null): string =>
  fill ? `<rect width="${w}" height="${h}" fill="${fill}"/>` : '';

const png = (source: string, width: number): Buffer =>
  new Resvg(source, { fitTo: { mode: 'width', value: width } }).render().asPng();

// ── SVG logos (assets/logos/) ────────────────────────────────────────────────
const svgs: Record<string, string> = {
  'vaultica-mark.svg': svg(64, 64, tile(C.accent, C.white)),
  'vaultica-mark-dark.svg': svg(64, 64, tile(C.accentDark, C.surfaceDark)),
  'vaultica-mark-mono.svg': svg(64, 64, shield('currentColor')),
  'vaultica-white-icon.svg': svg(64, 64, shield(C.white)),
  'vaultica-logo.svg': svg(LOCKUP_W, LOCKUP_H, lockupBody(C.accent, C.ink)),
  'vaultica-logo-white.svg': svg(LOCKUP_W, LOCKUP_H, lockupBody(C.accentDark, C.textDark)),
};

// Stacked lockup (mark above wordmark) for square slots: a larger mark (2.6 × cap height).
const STACK_MARK_H = 2.6 * wordmark.capHeight;
const STACK_K = STACK_MARK_H / SHIELD_BOX.h;
const STACK_MARK_W = SHIELD_BOX.w * STACK_K;
const STACK_GAP = 0.45 * wordmark.capHeight;
const STACK_W = Math.ceil(wordmark.bbox[2] - wordmark.bbox[0]);
const STACK_H = Math.ceil(STACK_MARK_H + STACK_GAP + wordmark.capHeight);
const stackBody = (mark: string, text: string): string =>
  `<g transform="translate(${((STACK_W - STACK_MARK_W) / 2).toFixed(2)} 0) scale(${STACK_K.toFixed(5)}) translate(${-SHIELD_BOX.x} ${-SHIELD_BOX.y})">${shield(mark)}</g>\n` +
  `<path transform="translate(${(-wordmark.bbox[0]).toFixed(2)} ${(STACK_MARK_H + STACK_GAP + wordmark.capHeight).toFixed(2)})" d="${wordmark.d}" fill="${text}"/>`;

mkdirSync(ICONS, { recursive: true });
for (const [file, source] of Object.entries(svgs)) writeFileSync(join(LOGOS, file), source);

// ── PNG icon set (assets/logos/vaultica/) ────────────────────────────────────
for (const size of [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024]) {
  writeFileSync(join(ICONS, `vaultica-mark-${size}.png`), png(svgs['vaultica-mark.svg'], size));
}
// Maskable: full-bleed accent, shield inside the central 80% safe zone.
writeFileSync(
  join(ICONS, 'vaultica-mark-maskable-512.png'),
  png(svg(512, 512, bg(512, 512, C.accent) + shieldIn(512, 0.5, C.white)), 512)
);
writeFileSync(join(ICONS, 'vaultica-logo-1200.png'), png(svgs['vaultica-logo.svg'], 1200));
writeFileSync(
  join(ICONS, 'vaultica-logo-white-1200.png'),
  png(svgs['vaultica-logo-white.svg'], 1200)
);

// ── Stripe branding (assets/stripe/) ─────────────────────────────────────────
// Stripe: JPG or PNG, < 512 KB, ≥ 128×128; icon square, logo non-square
// (docs.stripe.com/get-started/account/branding). 512 px icons stay sharp on retina.
const ICON = 512;
const stripe: Record<string, string> = {
  // Recommended icon: full-bleed accent survives Stripe's round and square crops.
  'vaultica-stripe-icon.png': svg(
    ICON,
    ICON,
    bg(ICON, ICON, C.accent) + shieldIn(ICON, 0.56, C.white)
  ),
  'vaultica-stripe-icon-light-bg.png': svg(
    ICON,
    ICON,
    bg(ICON, ICON, C.white) + shieldIn(ICON, 0.56, C.accent)
  ),
  'vaultica-stripe-icon-dark-bg.png': svg(
    ICON,
    ICON,
    bg(ICON, ICON, C.surfaceDark) + shieldIn(ICON, 0.56, C.accentDark)
  ),
  'vaultica-stripe-icon-dark.png': svg(ICON, ICON, shieldIn(ICON, 0.7, C.ink)),
  'vaultica-stripe-icon-light.png': svg(ICON, ICON, shieldIn(ICON, 0.7, C.white)),
  // Recommended logo: wide lockup on transparent, 1200×256.
  'vaultica-stripe-logo-wide.png': svg(
    1200,
    256,
    fit(1200, 256, LOCKUP_W, LOCKUP_H, 0.8, lockupBody(C.accent, C.ink))
  ),
  'vaultica-stripe-logo.png': svg(
    ICON,
    ICON,
    fit(ICON, ICON, STACK_W, STACK_H, 0.72, stackBody(C.accent, C.ink))
  ),
  'vaultica-stripe-logo-square.png': svg(
    ICON,
    ICON,
    bg(ICON, ICON, C.white) + fit(ICON, ICON, STACK_W, STACK_H, 0.72, stackBody(C.accent, C.ink))
  ),
};
for (const [file, source] of Object.entries(stripe)) {
  const out = png(source, Number(/viewBox="0 0 (\d+)/.exec(source)?.[1]));
  if (out.length >= 512 * 1024)
    throw new Error(`${file} is ${out.length} bytes; Stripe needs < 512 KB`);
  writeFileSync(join(STRIPE, file), out);
}

console.log(
  `Vaultica logo: ${Object.keys(svgs).length} SVGs, 13 PNGs, ${Object.keys(stripe).length} Stripe PNGs (lockup ${LOCKUP_W}×${LOCKUP_H})`
);
