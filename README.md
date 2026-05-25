# Vibecode1000

**1 website. 1000 tools. Everything you need in one place.**

[![Live](https://img.shields.io/badge/Live-vibecode1000.com-e8a87c?style=for-the-badge)](https://vibecode1000.com)

Vibecode1000 is a single hub where everyday utilities, creative helpers, and lightweight apps live together — searchable, categorized, and free to use. No app store maze: open one site, pick a tool, get on with your day.

Built as a public build-in-progress project in the Netherlands. The “1000” is the north star behind the system, not clutter on the page.

## Who it’s for

- People who want **fast, simple tools** (dice, passwords, timers, generators, games)
- Builders and employers reviewing a **real shipped product** — hub UX, SEO, payments, and scale
- Anyone curious about **learning in public** while consolidating useful micro-apps

## Features

- **Unified tool hub** — one homepage, one search, one gallery
- **Categories that make sense** — utilities, tools, games, and more (not a flat dump)
- **Featured starting points** — dice roller, motivation quotes, password generator, and standout games
- **Always expanding** — new tools plug into the same chrome and deploy pipeline

## Start here

| | |
|---|---|
| **Live site** | [vibecode1000.com](https://vibecode1000.com) |
| **Try a tool** | [Roll a Dice](https://vibecode1000.com/004-dice-roll/) · [Motivation Generator](https://vibecode1000.com/003-motivation-generator/) · [KeyForge passwords](https://vibecode1000.com/007-password-gen/) |
| **Custom site** | [Get yours from €49](https://vibecode1000.com/#get-a-site) |

## Tool categories (conceptual)

Individual tools are deployed as static mini-apps. In the repo they share one generator; on the site they’re grouped for humans:

| Category | Examples |
|----------|----------|
| **Utilities** | Passwords, timers, converters, counters |
| **Productivity** | Pomodoro, tips, planners |
| **Creativity** | Quotes, colors, generators |
| **Developer tools** | Formatters, encoders, small dev helpers |
| **Fun** | Dice, games, quick decisions |

You won’t find 1000 folders listed here — see [docs/structure.md](./docs/structure.md) for how the repo is organized.

## For developers

```bash
npm install
npm run engine:hub      # rebuild homepage from manifest
npm run validate        # sanity-check routes
```

Push to `main` → Vercel deploys the hub and tools. Flagship Next.js app: `001-buy-a-square/`.

| Doc | Purpose |
|-----|---------|
| [Repo structure](./docs/structure.md) | What lives where (without noise) |
| [Deploy](./docs/deployment.md) | Vercel + domain |
| [Monetization](./docs/monetization.md) | Tips, sponsors, micro-sites |
| [Contributing](./CONTRIBUTING.md) | PRs and hub config |

## Built in public

Progress, experiments, and engine work are documented lightly in [`docs/`](./docs/). Legacy planning files live in [`_archive/`](./_archive/) so the main tree stays product-focused.

## Support

[PayPal tips](https://paypal.me/RajeevSewbalak) · [GitHub](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites)

MIT — see [LICENSE](./LICENSE).
