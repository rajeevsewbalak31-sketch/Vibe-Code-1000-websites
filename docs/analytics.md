# Analytics — Vibe Code 1000

Vibe Code 1000 uses **Vercel Web Analytics** for pageviews on the hub and every numbered mini-site. Outbound clicks (links leaving the deployment hostname) are sent as custom events.

Optional **Plausible** remains configurable in `scripts/manifest.json` for a second, privacy-focused view.

---

## Enable in Vercel (required once)

1. Open the [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the **websites** project (`websites-eosin-delta`).
3. Go to **Analytics** in the sidebar → click **Enable** for Web Analytics.
4. Redeploy `main` so `/_vercel/insights/script.js` is served (added automatically when analytics is enabled).

Without enabling in the dashboard, the script tags in HTML will not receive data.

---

## Where to view analytics

| What | Where |
|------|--------|
| Pageviews, visitors, referrers | Project → **Analytics** → **Web Analytics** |
| Filters (path, country, device) | Analytics → **Filtering** panels |
| Custom outbound events | Analytics → **Events** (Pro / Enterprise) |

Direct link pattern: `https://vercel.com/<team>/<project>/analytics`

Data usually appears within minutes of the first production visits after enable + deploy.

---

## How pageviews are tracked

Every `index.html` includes (via `scripts/lib/analytics.mjs`):

- Vercel insights loader: `/_vercel/insights/script.js`
- Outbound helper: `/_shared/vercel-outbound.js`

**Covered routes:**

- Hub homepage: `/`
- All numbered sites: `/002-daily-ai-tools/`, `/101-egg-balance/`, … `/1000-…/` (paths match folder slugs)

Regenerate or patch HTML after hub changes:

```bash
npm run engine:hub          # hub markers only
node scripts/inject-vercel-analytics.mjs   # all NNN-slug/index.html + hub
```

New sites from generators (`generate-sites`, `generate-games`, `generate-apps`, batch2/3) already embed the snippet in `app-shell` / `game-shell`.

---

## Identifying top-performing sites

1. In **Web Analytics**, open the **Pages** (or **Paths**) panel.
2. Sort by **Visitors** or **Page views**.
3. Focus on paths like `/101-egg-balance/`, `/002-daily-ai-tools/` — the folder slug after the numeric prefix is the site ID.
4. Map slug → name using the hub gallery or `scripts/sites.json` (`id` + `slug` fields).
5. For outbound interest (PayPal, GitHub, Buy a Square, external tools), filter **Events** for `Outbound Link` and inspect `url` / `page` in event properties.

**Quick wins to compare:**

- Hub `/` vs game paths `/101-*`, `/102-*`
- Featured strip clicks (often outbound to `001-buy-a-square.vercel.app`)
- Labs band (#501–1000) vs games (#101–200) traffic share

---

## Outbound click tracking

`_shared/vercel-outbound.js` listens for clicks on `<a href>` whose hostname differs from the current page. It sends:

```js
va('event', { name: 'Outbound Link', data: { url, text, page } });
```

Examples tracked from the hub: PayPal tip links, GitHub repo, external featured sites.

---

## Package & repo layout

| File | Role |
|------|------|
| `@vercel/analytics` | Declared in `package.json` (framework apps; static sites use the script tag) |
| `scripts/lib/analytics.mjs` | Shared head snippet + inject helper |
| `scripts/inject-vercel-analytics.mjs` | Bulk-update existing `index.html` files |
| `scripts/sync-hub.mjs` | Keeps hub `<!-- VERCEL_ANALYTICS_* -->` block in sync |

Disable Vercel Analytics on the hub only: set `"vercelAnalytics": false` under `hub` in `scripts/manifest.json`, then `npm run engine:hub`.

---

## Plausible (optional)

1. Create a site at [plausible.io](https://plausible.io).
2. Set `"plausibleDomain": "websites-eosin-delta.vercel.app"` in `scripts/manifest.json` (already set).
3. Run `npm run engine:hub` — script is injected via `<!-- PLAUSIBLE_START -->` markers.

Use Plausible for simple path rankings; use Vercel Analytics for the same deployment-native view and outbound events.
