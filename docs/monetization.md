# Monetization

Revenue options for **Vibecode1000**, configured in [`scripts/manifest.json`](../scripts/manifest.json) under `monetization`.

## Live today

| Stream | Where | Config |
|--------|--------|--------|
| **Tips** | Hub + every generated site | `paypal`, `tipPresets` |
| **Sponsor slots** | Hub `#sponsors` | `monetization.sponsors[]` |
| **Micro-site sales** | Hub `#get-a-site` | `monetization.microsites[]` |
| **Pay-per-square** | [Buy a Square](https://001-buy-a-square.vercel.app) | Flagship #001 |

## Update pricing or sponsors

1. Edit `scripts/manifest.json`
2. Run `npm run engine:hub` (rebuilds monetization HTML on the hub)
3. For site footers: `npm run engine:seo` (regenerates tip chips on all tools)

## Sponsor slots

Replace `placeholder: true` entries with real sponsors:

```json
{
  "name": "Acme DevTools",
  "tagline": "Ship faster with Acme",
  "href": "https://acme.example",
  "cta": "Try free",
  "placeholder": false
}
```

Inquiries: GitHub issue template **Sponsor inquiry** or `sponsorInquiry` URL in manifest.

## Micro-site packages

Default tiers: **Starter €49**, **Pro €149**, **Flagship €499+**.

CTAs open a prefilled GitHub issue. When you use PayPal invoicing or Cal.com, swap `href` in `sync-hub` / `monetization.mjs` to your checkout link.

## Per-site lead gen

Every generated tool footer includes:

- Quick tip chips (€3 / €5 / €10)
- Link to hub `#get-a-site`

High-traffic tools (password, pomodoro, RPS) are good candidates for custom sponsor copy later.

## What to track

- PayPal incoming (tips + Buy a Square)
- GitHub issues labeled `sponsor`
- Hub clicks on `#get-a-site` (add Plausible/Umami later)

## Next upgrades

- [ ] `og:image` + newsletter for sponsors
- [ ] “Tool of the week” paid feature
- [ ] Affiliate links on utility tools (password managers, etc.)
- [ ] Stripe for micro-site deposits
