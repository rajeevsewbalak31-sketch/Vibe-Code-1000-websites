# Sequential auto-generator

Fills **missing** numbered slots `001`–`1000` without overwriting existing folders.

## Commands

```bash
npm run engine:sequential:status   # scan occupied / pending gaps
npm run engine:sequential          # create missing sites, commit every 10, push
node scripts/run-sequential-auto.mjs --max=20 --no-push
```

## Rules

1. Scans `NNN-slug/` and `1000-slug/` folders on disk.
2. **Never** writes into an existing numbered folder.
3. Skips occupied IDs; only creates **gaps**.
4. After each new site: updates `scripts/sites.json`, `scripts/manifest.json` (`generation` block), runs `sync-hub.mjs`.
5. Git commit every **10** sites: `add websites 003-012`.
6. On interrupt (Ctrl+C): prints `Last completed: ###` and saves `scripts/.sequential-checkpoint.json`.

## Resume

If the run stops, check the checkpoint file or console line:

```
Last completed: 042
```

Re-run `npm run engine:sequential` — it will continue from the next **free** slot only.

## Current repo state

If all 1000 folders exist, status shows:

```
Pending gaps: 0
Last completed: 1000
```

No files are created until a numbered folder is removed or a slot is empty.
