# Stripe Branding Assets

Assets for Stripe Dashboard branding settings. These meet Stripe's requirements:

- **Format**: PNG
- **Size**: ≥128x128 pixels, <512kb
- **Icon**: Square, digital-friendly
- **Logo**: Can be non-square

## Recommended Files for Stripe

### Icon (Required - Square)

Use ONE of these as your Stripe **Icon**:

| File                                | Description                             | Best For                                     |
| ----------------------------------- | --------------------------------------- | -------------------------------------------- |
| `vaultica-stripe-icon-light-bg.png` | Black icon on white background          | **Recommended** - Best for Stripe's light UI |
| `vaultica-stripe-icon-dark-bg.png`  | White icon on dark (#0a0a0a) background | Dark themes, high contrast                   |
| `vaultica-stripe-icon-dark.png`     | Black icon on transparent background    | Flexible placement                           |

**Recommended**: Use `vaultica-stripe-icon-light-bg.png` for Stripe's light dashboard.

### Logo (Optional - Non-Square)

Use ONE of these as your Stripe **Logo**:

| File                              | Dimensions | Description                                   |
| --------------------------------- | ---------- | --------------------------------------------- |
| `vaultica-stripe-logo-wide.png`   | 244x128    | Full Vaultica wordmark logo (recommended)     |
| `vaultica-stripe-logo-square.png` | 128x128    | Logo fitted into square with white background |
| `vaultica-stripe-logo.png`        | 128x128    | Logo scaled to fit 128x128                    |

**Recommended**: Use `vaultica-stripe-logo-wide.png` for checkout pages and
`vaultica-stripe-icon-light-bg.png` as the icon.

## Where These Are Used (Stripe)

| Setting  | Emails | Checkout & Payment Links | Customer Portal | Hosted Invoice Page | Invoice PDFs |
| -------- | ------ | ------------------------ | --------------- | ------------------- | ------------ |
| **Icon** | ✓      | ✓                        | ✓               | ✓                   | ✓            |
| **Logo** | ✗      | ✓                        | ✗               | ✗                   | ✓            |

## Source Files

- Black icon generated from: `../logos/vaultica-logo.svg` (lock icon portion)
- White icon generated from: `../logos/vaultica-white-icon.svg`
- Full logo generated from: `../logos/vaultica-logo.svg`

## Upload Location

Upload these at: <https://dashboard.stripe.com/settings/branding>
