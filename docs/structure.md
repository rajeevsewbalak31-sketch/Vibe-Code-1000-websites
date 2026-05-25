# Repository structure

Vibecode1000 is **one product** (the hub) plus **many small tools** generated from a shared system. The layout is optimized for deployment, not for reading every folder name on GitHub.

## What you see on GitHub

```
vibecode1000/
├── index.html          # Hub homepage
├── hub.js / hub.css    # Hub UI (search, filters)
├── _shared/            # Shared styles, analytics helpers
├── NNN-tool-slug/      # Individual tools (e.g. 004-dice-roll/)
├── 001-buy-a-square/   # Flagship Next.js app (separate Vercel project)
├── scripts/            # Generator + hub sync (source of truth)
│   ├── manifest.json   # Branding, featured tools, monetization
│   └── sites.json      # Tool catalog (metadata only)
├── docs/               # Short product & ops guides
└── _archive/           # Retired experiments (not deployed)
```

## Important rules

1. **Do not list 1000 tools in the README** — categories and featured links are enough.
2. **Tool folders stay at repo root** — URLs are `vibecode1000.com/004-dice-roll/`, etc. Moving them would break production.
3. **`scripts/sites.json` is the catalog** — names, slugs, and templates; not a browsing UI.
4. **`npm run engine:hub`** rebuilds the homepage from `scripts/manifest.json`.

## Categories (site + catalog)

| Hub filter | Typical tools |
|------------|----------------|
| Utilities | Passwords, timers, converters |
| Tools | Generators, AI lists, daily helpers |
| Games | EggBalance, NestRun, arcade-style |
| Landing pages | Buy a Square, promos |
| Experiments / Creative / Labs | Batches from the generator |

## What was archived

See [`_archive/README.md`](../_archive/README.md) for old `sites/`, `websites/`, and verbose docs removed from the main tree.
