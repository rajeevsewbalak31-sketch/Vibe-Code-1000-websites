# Vercel deploy — 500 static sites

If the live hub still shows ~100 cards after pushing to GitHub, the Vercel project may not be linked to auto-deploy.

## Fix in 2 minutes

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) → project **websites-eosin-delta** (or your hub project).
2. **Settings → Git** → connect `rajeevsewbalak31-sketch/Vibe-Code-1000-websites`, branch **main**.
3. **Settings → General** → Framework Preset: **Other** (static). Build Command: empty. Output Directory: `.` (repo root).
4. **Deployments** → **Redeploy** latest commit (`main`).
5. After deploy, run locally: `npm run verify:live`

## What should be live

| URL | Expected |
|-----|----------|
| `/` | ~500 gallery cards |
| `/101-egg-balance/` | EggBalance game |
| `/_shared/tool.css` | 200 |
| `/_shared/game.css` | 200 |
| `/_shared/app.css` | 200 |
| `/og.svg` | 200 |
| `/301-*` sample | 200 |

## GitHub Actions auto-deploy (optional)

1. Get IDs from Vercel → Project → Settings.
2. Add secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
3. Push to `main` — workflow `.github/workflows/vercel-deploy.yml` deploys automatically.

## Repo layout

Vercel serves the repo root: each `NNN-slug/index.html` folder is a route. No build step required.

`vercel.json` sets `framework: null` so Vercel does not look for Next.js at the root (only `001-buy-a-square/` uses Next.js on its own project).
