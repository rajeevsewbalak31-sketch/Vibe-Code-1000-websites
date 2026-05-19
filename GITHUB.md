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

## 3. Connect Vercel to GitHub

1. [vercel.com](https://vercel.com) → **websites** project → **Settings** → **Git**
2. Connect `rajeevsewbalak31-sketch/Vibe-Code-1000-websites`
3. Root Directory: `.` (this repo root)
4. Production branch: `main`

Repeat for project **001-buy-a-square** with root `001-buy-a-square` if you use a monorepo, or keep it as a separate Vercel project.

## 4. Pin the hub on GitHub

Edit the repo **About** box (right sidebar):

- Website: `https://websites-eosin-delta.vercel.app`
- Topics: `1000-websites`, `side-project`, `paypal`, `vercel`
