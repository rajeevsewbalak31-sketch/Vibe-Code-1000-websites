# Roadmap — from challenge to engine

The goal is not to hand-build 1000 pages. The goal is to build a **machine** that can produce a portfolio at scale — then monetize it.

## What actually matters

| Asset | Why it matters |
|--------|----------------|
| **Generation engine** | One pipeline → many sites |
| **Gallery / hub** | Portfolio + discovery |
| **Deploy automation** | Push → live (Vercel + GitHub) |
| **Monetization layer** | PayPal tips, ads, leads, sold sites |

“1000 websites” is a **milestone**, not the product.

---

## Phases

### Phase 1 — Prove the concept ✅

- ~22 hand-crafted mini-tools (003–022)
- Custom builds: **Buy a Square** (Next.js), **Quotely**
- Hub gallery, PayPal on every site
- Free deploy via Vercel

### Phase 2 — Automate to 100 sites ✅

### Phase 2b — Vibe-coded games (#101–200) ✅

- Catalog-driven registry (`scripts/sites.json`)
- `node scripts/engine.mjs all --from=23 --to=100`
- Hub auto-syncs from disk + manifest
- Reuse 20 logic templates with unique branding (name, colors, copy)

### Phase 2b — Games batch (#101–200)

- **#101 EggBalance** — Rajeev's egg carton physics game (hand-crafted)
- 9 playable templates × 10 variants: stack, catch, snake, breakout, memory, reaction, flappy, whack, 2048-style merge
- `npm run engine:games:all` — expand catalog, generate, sync hub, sitemap
- Hub category **Games** for all `#101+`

### Phase 3 — Launch the gallery ✅

- [x] Hub categories: Tools · Games · Utilities · Landing Pages · Experiments · Featured
- [x] Search + sort (default / newest / popular)
- [x] Featured spotlight strip (5 picks in `manifest.json`)
- [x] Per-site SEO: `Name | Vibe Code 1000`, Open Graph, canonical
- [x] `sitemap.xml` + `robots.txt`
- [x] README + launch post template ([docs/announce.md](./announce.md))
- [x] Games launch banner + hero stats synced from engine
- [x] `og.svg` social preview card
- [x] Custom domain for the hub (`vibecode1000.com` — connect DNS in Vercel + Porkbun)
- [ ] Plausible analytics ([docs/analytics.md](./analytics.md))

### Phase 4 — Monetize ✅

- [x] Tip tiers on hub (€5 / €10 / €25 / €50 + custom)
- [x] Sponsor strip on hub (3 slots, configurable)
- [x] Micro-site pricing (`#get-a-site`)
- [x] Per-site tip chips + “Get your own micro-site” footer link
- [x] [docs/monetization.md](./monetization.md)
- [ ] Stripe deposits · affiliate tools

### Phase 3 — Interactive apps (#201–300) ✅

- 10 app templates × 10 variants: gradients, shadows, BMI, JSON, Markdown, Morse, etc.
- `npm run engine:apps:all`
- Hub **Experiments** filter + apps launch banner
- Plausible analytics wired ([docs/analytics.md](./analytics.md))

### Phase 5 — Scale to 1000 (optional) ← **next**

- Only when Phases 2–4 earn revenue
- Batch **#301–500**: new logic types + flagship builds
- Batch **#301–500**: engine expansion with quality review
- Retire weak templates; add more flagship games like EggBalance

---

## Engine commands

```bash
npm run engine:status    # counts: registry, folders, goal
npm run engine:expand    # add 023–100 to sites.json (idempotent)
npm run engine:build     # expand + generate HTML/CSS/JS folders
npm run engine:hub       # rebuild index.html gallery from disk
npm run engine:all       # expand + build + hub (full Phase 2 run)
npm run validate         # CI: registry matches folders
```

Legacy: `RUN-BUILD.cmd` still runs the PowerShell builder for 003–022.

---

## Adding a new logic type

1. Add behavior in `scripts/generate-sites.mjs` (`LOGIC`, `EXTRA_HTML`, `EXTRA_BUTTONS`)
2. Register the logic id in `scripts/lib/catalog.mjs` → `LOGICS`
3. Add a tagline in `TAGLINES`
4. Re-run `npm run engine:all`

---

## When you upgrade to Cursor Pro

Use Pro for **new logic types** and **one-off flagship sites** (Next.js, payments, auth). Use the engine for **volume** — don’t burn Pro credits generating folder #437.

---

*Idea → engine → gallery → revenue → scale.*
