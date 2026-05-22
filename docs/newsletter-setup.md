# Newsletter (Follow the journey)

The hub form supports **Formspree** when configured in `scripts/manifest.json`.

## Setup (5 minutes)

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy your form id (e.g. `xyzabcde` from `https://formspree.io/f/xyzabcde`).
3. In `scripts/manifest.json` under `branding`:

```json
"newsletterFormspree": "xyzabcde"
```

4. Regenerate hub and deploy:

```bash
npm run engine:hub
git add scripts/manifest.json index.html hub.js
git commit -m "Enable newsletter via Formspree"
git push
```

Until `newsletterFormspree` is set, signups are stored in the visitor’s browser only (localStorage) as a demo fallback.
