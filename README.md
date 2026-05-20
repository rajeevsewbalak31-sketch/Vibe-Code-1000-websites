# Vibe Code 1000

**I stopped trying to hand-build 1000 websites. I built a machine that generates them.**

[![Live hub](https://img.shields.io/badge/Live-hub-5eead4?style=for-the-badge)](https://websites-eosin-delta.vercel.app)
[![Progress](https://img.shields.io/badge/Progress-1000%2F1000-e8a87c?style=for-the-badge)](https://websites-eosin-delta.vercel.app)
[![PayPal](https://img.shields.io/badge/PayPal-Tip-0070ba?style=for-the-badge)](https://paypal.me/RajeevSewbalak)
[![GitHub](https://img.shields.io/badge/GitHub-repo-181717?style=for-the-badge&logo=github)](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites)

## What it is

**Vibe Code 1000** is an open-source **site generation engine** plus a public **gallery** of free mini web tools. Each site is generated from a catalog (name, colors, logic template), deployed on Vercel, and linked from one hub with search, categories, and PayPal tips.

| | |
|---|---|
| **Live gallery** | [websites-eosin-delta.vercel.app](https://websites-eosin-delta.vercel.app) |
| **Repo** | [Vibe-Code-1000-websites](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites) |
| **Progress** | **1000 / 1000** milestone reached |
| **Stack** | HTML/CSS/JS generator · Next.js flagships · Vercel |

## Gallery preview

![Vibe Code 1000 hub — category filters, featured strip, 100 tools](docs/hub-preview.svg)

Open the **[live hub](https://websites-eosin-delta.vercel.app)** to search, filter by category (Tools · Games · Utilities · Landing Pages · Experiments), and sort by newest or popular.

### ⭐ Featured (start here)

| Site | URL |
|------|-----|
| Buy a Square | [001-buy-a-square.vercel.app](https://001-buy-a-square.vercel.app) |
| Quotely | [quotely.vercel.app](https://quotely.vercel.app) |
| **EggBalance** (physics egg carton game) | [/101-egg-balance/](https://websites-eosin-delta.vercel.app/101-egg-balance/) |
| KeyForge, RPS Arena | [Browse featured on hub](https://websites-eosin-delta.vercel.app) |

## Roadmap

| Phase | Status | Goal |
|-------|--------|------|
| 1 | ✅ | Prove concept (~22 hand-built tools) |
| 2 | ✅ | Engine → **100 tools** |
| 2b | ✅ | **100 vibe-coded games** (#101–200), EggBalance |
| 3 | ✅ | **100 interactive apps** (#201–300) |
| 3b | ✅ | Hub UX, SEO, Plausible, launch banners |
| 4 | ✅ | Monetize (tips, sponsors, micro-site packages) |
| 5 | Next | Scale **#201–1000** when revenue proves it |

Details: **[docs/roadmap.md](./docs/roadmap.md)**

## Site engine

```bash
npm run engine:status
npm run engine:scale:1000    # Complete #501–1000 + hub
npm run engine:scale:500     # Batch #301–500
npm run engine:scale:300     # Games + apps (101–300)
npm run engine:apps:all      # Apps #201–300 only
npm run validate
```

| Command | Action |
|---------|--------|
| `engine:all` | Tools #023–100: expand → generate → hub |
| `engine:games:all` | Games #101–200: expand → generate → hub |
| `engine:hub` | Rebuild gallery cards + hero + games banner |
| `engine:seo` | Regenerate tool sites with OG/canonical + sitemap |

Registry: [`scripts/sites.json`](./scripts/sites.json) · Spotlight: [`scripts/manifest.json`](./scripts/manifest.json)

## SEO

- Per-site: `Title | Vibe Code 1000`, Open Graph, canonical URLs, hub back-link
- Hub: JSON-LD, meta tags
- Root: [`sitemap.xml`](./sitemap.xml) · [`robots.txt`](./robots.txt)

## Run locally

```bash
# Hub
start index.html   # or open in browser

# Flagship Next.js app
cd 001-buy-a-square && npm install && npm run dev
```

## Deploy

Push to `main` → Vercel auto-deploys the hub and projects. Manual:

```bash
npx vercel deploy --prod
```

## Docs

- [Roadmap](./docs/roadmap.md) · [Contributing](./CONTRIBUTING.md) · [Workflow](./docs/workflow.md)
- [Deployment](./docs/deployment-guide.md) · [GitHub setup](./GITHUB.md)

## Monetization (Phase 4)

| Offer | Link |
|-------|------|
| Tip the project | [PayPal](https://paypal.me/RajeevSewbalak) · hub [#support](https://websites-eosin-delta.vercel.app/#support) |
| Sponsor the gallery | [#sponsors](https://websites-eosin-delta.vercel.app/#sponsors) |
| Buy a custom micro-site | [#get-a-site](https://websites-eosin-delta.vercel.app/#get-a-site) (from €49) |
| Pay-per-square grid | [Buy a Square](https://001-buy-a-square.vercel.app) |

Playbook: **[docs/monetization.md](./docs/monetization.md)**

## Support

**[paypal.me/RajeevSewbalak](https://paypal.me/RajeevSewbalak)** — tips fund hosting and more tools. See [SUPPORT.md](./SUPPORT.md).

MIT License — [LICENSE](./LICENSE)

*Built in public by [@rajeevsewbalak31-sketch](https://github.com/rajeevsewbalak31-sketch)*
