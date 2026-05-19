# 1000 Websites Challenge

**Live hub:** **[websites-eosin-delta.vercel.app](https://websites-eosin-delta.vercel.app)** — browse all 22 tools, search, and tip via PayPal.

[![PayPal](https://img.shields.io/badge/PayPal-Tip-blue?style=for-the-badge)](https://paypal.me/RajeevSewbalak)
[![GitHub](https://img.shields.io/badge/GitHub-Vibe--Code--1000--websites-181717?style=for-the-badge&logo=github)](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites)

Building **1000** small, useful websites — vibe code → deploy free → repeat.

## Progress

| Metric | Status |
|--------|--------|
| Sites in repo | **22 / 1000** |
| Hub | [Live](https://websites-eosin-delta.vercel.app) |
| PayPal tips | On every site |

## Live sites

| # | Name | URL |
|---|------|-----|
| Hub | 1000 Websites | [websites-eosin-delta.vercel.app](https://websites-eosin-delta.vercel.app) |
| 001 | Buy a Square | [001-buy-a-square.vercel.app](https://001-buy-a-square.vercel.app) |
| 002 | Quotely | [quotely.vercel.app](https://quotely.vercel.app) |
| 003–022 | FlipCoin … ThankDrop | [Browse on hub](https://websites-eosin-delta.vercel.app) |

## All sites (local paths)

| # | Folder | Name | Stack |
|---|--------|------|-------|
| 001 | [001-buy-a-square](./001-buy-a-square/) | Buy a Square | Next.js |
| 002 | [002-random-quote](./002-random-quote/) | Quotely | HTML/CSS/JS |
| 003 | [003-coin-flip](./003-coin-flip/) | FlipCoin | HTML/CSS/JS |
| 004 | [004-dice-roll](./004-dice-roll/) | RollDice | HTML/CSS/JS |
| 005 | [005-yes-or-no](./005-yes-or-no/) | YesNo | HTML/CSS/JS |
| 006 | [006-random-color](./006-random-color/) | HueDrop | HTML/CSS/JS |
| 007 | [007-password-gen](./007-password-gen/) | KeyForge | HTML/CSS/JS |
| 008 | [008-countdown](./008-countdown/) | TickDown | HTML/CSS/JS |
| 009 | [009-pomodoro](./009-pomodoro/) | FocusTomato | HTML/CSS/JS |
| 010 | [010-tip-calc](./010-tip-calc/) | TipQuick | HTML/CSS/JS |
| 011 | [011-compliment](./011-compliment/) | Brighten | HTML/CSS/JS |
| 012 | [012-magic-8ball](./012-magic-8ball/) | Oracle8 | HTML/CSS/JS |
| 013 | [013-rps](./013-rps/) | RPS Arena | HTML/CSS/JS |
| 014 | [014-lucky-number](./014-lucky-number/) | LuckyDraw | HTML/CSS/JS |
| 015 | [015-word-counter](./015-word-counter/) | WordScope | HTML/CSS/JS |
| 016 | [016-stopwatch](./016-stopwatch/) | SwiftLap | HTML/CSS/JS |
| 017 | [017-breathing](./017-breathing/) | BreatheFlow | HTML/CSS/JS |
| 018 | [018-spin-wheel](./018-spin-wheel/) | SpinPick | HTML/CSS/JS |
| 019 | [019-unit-convert](./019-unit-convert/) | MetricMate | HTML/CSS/JS |
| 020 | [020-mood-picker](./020-mood-picker/) | MoodMap | HTML/CSS/JS |
| 021 | [021-name-picker](./021-name-picker/) | NameHat | HTML/CSS/JS |
| 022 | [022-gratitude](./022-gratitude/) | ThankDrop | HTML/CSS/JS |

## Run locally

**Hub:** open [`index.html`](./index.html) or run a static server in this folder.

**Site #001 (Next.js):**

```bash
cd 001-buy-a-square
npm install
npm run dev
```

## Deploy

Already on Vercel. To redeploy:

```bash
# Hub + static sites 003–022
npx vercel deploy --prod

# Buy a Square (from 001-buy-a-square/)
cd 001-buy-a-square && npx vercel deploy --prod
```

Connect this repo in [Vercel](https://vercel.com) → Import Git → root = `.` for auto-deploy on push.

## Add more sites

1. Add entries to [`scripts/sites.json`](./scripts/sites.json)
2. Run [`RUN-BUILD.cmd`](./RUN-BUILD.cmd) or `powershell -File scripts/build-all.ps1`
3. Add a card in [`index.html`](./index.html) (hub)
4. Commit and push

## Support

Tips help build the next sites: **[paypal.me/RajeevSewbalak](https://paypal.me/RajeevSewbalak)**
