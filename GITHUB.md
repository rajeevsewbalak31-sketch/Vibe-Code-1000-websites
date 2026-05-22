# GitHub setup

Repo: [Vibe-Code-1000-websites](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites)

## Pin the repo About (do this once)

On GitHub → repo home → **⚙️ About** (top right):

| Field | Value |
|-------|--------|
| **Description** | Site generation engine + 100 free mini-tools. Custom sites from €49. |
| **Website** | `https://vibecode1000.com` |
| **Topics** | `1000-websites`, `web-tools`, `side-project`, `vercel`, `portfolio`, `site-generator`, `paypal` |

## Live URLs

| What | URL |
|------|-----|
| Hub (100 tools) | https://vibecode1000.com |
| Order / pricing | https://vibecode1000.com/#get-a-site |
| Pay €49 (PayPal) | https://paypal.me/RajeevSewbalak/49 |
| Buy a Square (#001) | https://001-buy-a-square.vercel.app |
| Quotely (#002) | https://quotely.vercel.app |

## Vercel ↔ GitHub

| Vercel project | Root | URL |
|----------------|------|-----|
| **websites** | `.` | vibecode1000.com (+ websites-eosin-delta.vercel.app redirect) |
| **001-buy-a-square** | `001-buy-a-square` | 001-buy-a-square.vercel.app |

Push to `main` → auto-deploy.

## Verify before / after deploy

```bash
npm run verify:routes   # local folders + hub links
npm run validate
npm run verify:live     # production HTTP checks (all 100 paths)
```

## Engine (optional)

```bash
npm run engine:status
npm run engine:hub
```

Roadmap: [docs/roadmap.md](./docs/roadmap.md) · Launch copy: [docs/announce.md](./docs/announce.md)
