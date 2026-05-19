# Contributing

Thanks for interest in the **1000 Websites Challenge**. This repo is a **site generation engine** + gallery — not 1000 hand-written pages.

## Quick start

```bash
npm run engine:status
npm run validate
```

## Adding a site manually

1. Add an entry to [`scripts/sites.json`](scripts/sites.json) (or let `expand-catalog` generate ids 101+).
2. If it is a **new logic type**, extend [`scripts/generate-sites.mjs`](scripts/generate-sites.mjs) and [`scripts/lib/catalog.mjs`](scripts/lib/catalog.mjs).
3. Run `npm run generate` (or `npm run engine:seo` to refresh SEO on all sites).
4. Run `npm run engine:hub`.
5. Open a PR.

## Hub spotlight

Edit `spotlight` ids in [`scripts/manifest.json`](scripts/manifest.json), then `npm run engine:hub`.

## Flagship apps (Next.js)

Sites like `001-buy-a-square` live outside the HTML generator. Add them under `featured` in `manifest.json` with a live Vercel URL.

## Code style

- Match existing naming: `NNN-slug` folders, PayPal tip footer on generated sites.
- Keep changes focused — one feature per PR when possible.

## Questions

Open a [GitHub Discussion](https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites/discussions) or an issue with the **Site idea** template.
