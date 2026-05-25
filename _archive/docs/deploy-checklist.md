# Deploy checklist (100 sites on Vercel)

Vercel deploys **only what is committed and pushed** to `main`. Generated folders that exist only on your PC are not live.

## Before every production deploy

```bash
npm run verify:all
git status
```

Expect:

- **100** folders on disk (`001`–`100`)
- **98** entries in `scripts/sites.json` (003–100)
- **98** hub links to `./NNN-slug/` paths
- **0** untracked `0xx-` folders

## Push

```bash
git add -A
git commit -m "Deploy: sites 023-100 and hub updates"
git push origin main
```

Wait for Vercel **websites** project build, then spot-check:

- `https://websites-eosin-delta.vercel.app/023-swiftlab/`
- `https://websites-eosin-delta.vercel.app/100-bolthub/`

`001-buy-a-square` is a **separate** Vercel project (`001-buy-a-square` root).
