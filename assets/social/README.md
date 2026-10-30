# Social kit

On-brand images for BlinkVault profiles and link previews. Design: "Quiet instrument" - the blink
surface (`#0E1013`), the Stacked B mark, Geist. Text comes only from `vaultica-web/src/lib/brand.ts`
(name, tagline, app host).

## Files

| PNG                  | Size      | Where it goes                                                    |
| -------------------- | --------- | ---------------------------------------------------------------- |
| `avatar.png`         | 400x400   | Profile picture (X, Discord, Telegram, any square avatar)        |
| `reddit-icon.png`    | 256x256   | Reddit community icon                                            |
| `x-header.png`       | 1500x500  | X / Twitter header                                               |
| `reddit-banner.png`  | 1920x384  | Reddit community banner                                          |
| `link-card.png`      | 1200x630  | Open Graph / link preview card                                   |

Each PNG has an SVG source in [`src/`](src/) with the same name. Fonts used for rendering are in
[`fonts/`](fonts/) (Geist, SIL OFL; licence text included).

## Safe areas

- **Avatar and Reddit icon:** the mark fills about 60% of the canvas, so circular crops keep it whole.
- **X header:** on mobile the avatar covers the bottom-left and the top and bottom edges crop. All
  content sits right of x=520 and between y=130 and y=370.
- **Reddit banner:** sides crop on narrow screens. All content is centred in the middle ~1000px.
- **Link card:** 96px padding from the edges.

## Rebuild

```bash
pnpm build:social   # scripts/build-social.ts: writes src/*.svg, renders PNGs with @resvg/resvg-js
```

Edit colours or text in `scripts/build-social.ts` (colours mirror `tokens/vault-theme.json`, theme
`blink`), then rebuild. Do not hand-edit the PNGs or SVGs.
