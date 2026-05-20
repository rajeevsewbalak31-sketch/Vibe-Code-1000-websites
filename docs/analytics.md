# Analytics (optional)

## Plausible — privacy-friendly

1. Create a site at [plausible.io](https://plausible.io)
2. Add your domain to `scripts/manifest.json`:

```json
"hub": {
  "ogImage": "/og.svg",
  "plausibleDomain": "websites-eosin-delta.vercel.app"
}
```

3. Re-run `npm run engine:hub` — script is injected via `<!-- PLAUSIBLE_START -->` markers

**Already configured** in `scripts/manifest.json` as `websites-eosin-delta.vercel.app`. After deploy, check Plausible dashboard for traffic.

Track hub visits, `#get-a-site` clicks, and top game paths (`/101-egg-balance/`, etc.).

## What to measure first

- Hub → EggBalance click-through
- Games filter usage
- PayPal tip / €49 order link clicks
- Top 10 game URLs by traffic
