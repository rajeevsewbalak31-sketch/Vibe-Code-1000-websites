# Deployment

## Hub + tools (main repo)

1. Connect the repo to [Vercel](https://vercel.com).
2. Production branch: **`main`**.
3. Root directory: **`.`** (repository root).
4. Framework: **Other** (static) — no build command required for the gallery.

Push to `main` → automatic deploy to [vibecode1000.com](https://vibecode1000.com).

After hub changes:

```bash
npm run engine:hub
npm run engine:sitemap
git add index.html sitemap.xml hub.js
git commit -m "Sync hub"
git push
```

## Custom domain

See [vibecode1000-domain.md](./vibecode1000-domain.md) for DNS and redirects from the old `*.vercel.app` hostname.

## Flagship: Buy a Square

`001-buy-a-square/` is a **separate** Vercel project (Next.js). Deploy from that folder; hub links to `https://001-buy-a-square.vercel.app/`.

## Checks

```bash
npm run validate
npm run verify:routes
npm run verify:live    # optional HTTP smoke test
```
