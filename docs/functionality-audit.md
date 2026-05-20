# Functionality audit

Generated: 2026-05-20

## Root cause

**Relative `script.js` / `style.css` URLs with `trailingSlash: false` in `vercel.json`.**

When users open `/004-dice-roll` (no trailing slash), the browser resolves `script.js` → `/script.js` (404). HTML/CSS still render from Vercel rewrites, but **no JavaScript runs** — buttons, inputs, and game loops appear broken.

### Fix (repo-wide)

| Change | File(s) |
|--------|---------|
| Root-absolute asset helpers | `scripts/lib/site-paths.mjs` |
| Generator templates | `app-shell.mjs`, `game-shell.mjs`, `generate-sites.mjs` |
| Bulk patch existing HTML | `scripts/fix-site-asset-paths.mjs` → **999** `index.html` files |

Example after fix:

```html
<script src="/004-dice-roll/script.js"></script>
<link rel="stylesheet" href="/004-dice-roll/style.css" />
```

`sync-hub.mjs` was **not** the cause (hub links already used trailing slashes).

## Summary

| Metric | Count |
|--------|------:|
| Sites scanned | 996 |
| Sites fixed (asset paths) | 999 |
| Still using relative assets | 0 |
| Missing script.js | 0 |
| Bad script reference | 0 |
| No event listeners | 0 |
| HTML/JS ID mismatches | 0 |
| **Sites flagged (static)** | **0** |
| Runtime smoke sample | 40 |
| Smoke tests passed | 40 |
| Smoke failures | 0 |

## Static issues

_None — all sites use `/{id}-{slug}/script.js` and valid scripts._

## Smoke test failures (sample)

_None in sample._

## Manual exceptions

| Path | Notes |
|------|--------|
| `001-buy-a-square/` | Next.js — separate Vercel project |
| `002-daily-ai-tools/` | Hand-crafted — paths patched |
| `003-motivation-generator/` | Hand-crafted — paths patched |
| `101-egg-balance/` | Hand-crafted — paths patched |

Canvas games (~99) load JS correctly; gameplay needs a real browser (jsdom lacks canvas context).

## Commands

```bash
npm run engine:fix-assets
npm run audit:functionality
```
