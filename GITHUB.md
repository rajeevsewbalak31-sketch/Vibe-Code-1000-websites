# GitHub setup (one-time)

This folder is the git repo for the challenge. Follow these steps if push did not complete automatically.

## 1. Create the repo on GitHub (if needed)

1. Open [github.com/new](https://github.com/new)
2. Name: `Vibe-Code-1000-websites` (or `websites`)
3. **Do not** add README, .gitignore, or license (this folder already has them)
4. Create repository

## 2. Push from your PC

```powershell
cd C:\Users\srsew\websites

git remote add origin https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites.git
git branch -M main
git push -u origin main
```

If `origin` already exists:

```powershell
git remote set-url origin https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites.git
git push -u origin main
```

Use **GitHub Desktop** or **Cursor Source Control** if you prefer a GUI.

## 3. Vercel ↔ GitHub (connected)

Both projects are linked to `rajeevsewbalak31-sketch/Vibe-Code-1000-websites` on branch `main`:

| Vercel project | Root directory | Production URL |
|----------------|----------------|----------------|
| **websites** | `.` (repo root) | [websites-eosin-delta.vercel.app](https://websites-eosin-delta.vercel.app) |
| **001-buy-a-square** | `001-buy-a-square` | [001-buy-a-square.vercel.app](https://001-buy-a-square.vercel.app) |

Every `git push` to `main` triggers a new deployment automatically.

## 4. Pin the hub on GitHub

Edit the repo **About** box (right sidebar):

- Website: `https://websites-eosin-delta.vercel.app`
- Topics: `1000-websites`, `side-project`, `paypal`, `vercel`, `site-generator`, `portfolio`

## 5. Site generation engine

Phase 2 target: **100 sites** from one pipeline (not 100 hand-builds).

```bash
npm run engine:status
npm run engine:all      # catalog 023–100 → folders → hub sync
npm run validate
```

Roadmap: [docs/roadmap.md](./docs/roadmap.md)
