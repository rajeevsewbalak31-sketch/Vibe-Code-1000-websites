# Contributing to Vibecode1000

Thanks for helping improve the **product** — the hub and the tools people actually click.

## Before you open a PR

```bash
npm install
npm run validate
```

## Change the homepage

Edit [`scripts/manifest.json`](scripts/manifest.json) (featured tools, copy, monetization), then:

```bash
npm run engine:hub
```

## Add or update a tool

1. Add metadata to [`scripts/sites.json`](scripts/sites.json) (or use the expand scripts for batches).
2. Ensure the folder `NNN-slug/` exists with `index.html`, `script.js`, `style.css`.
3. Run `npm run engine:hub` and `npm run engine:sitemap` if the hub should link it.
4. Keep the shared footer/tip pattern consistent with other tools.

## Flagship apps (Next.js)

Example: `001-buy-a-square/`. Add to `featured` in `manifest.json` with the live Vercel URL.

## Naming

- Use **tool**, **category**, and **hub** — avoid “experiment”, “map”, or “batch” in user-facing copy.
- Folders stay `NNN-slug` for stable URLs.

## Questions

[GitHub Discussions](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites/discussions) or an issue.
