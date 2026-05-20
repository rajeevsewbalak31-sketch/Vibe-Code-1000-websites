# Vibe Code 1000 — Site Audit Report

Generated: 2026-05-20  
Method: **static analysis** of all numbered site folders + live HTTP GET (local files + hub routes).  
Audited folders: **999** (excludes `001-buy-a-square` Next.js project).

## Executive summary

| Metric | Value |
|--------|------:|
| Sites audited | 999 |
| Average quality score | 99.5 / 100 |
| Score range (low → high) | 94 – 100 |
| Hub route check | `npm run verify:routes` — OK (all local paths resolve) |
| Grade A (85+) | 999 |
| Grade B (70–84) | 0 |
| Grade C (55–69) | 0 |
| Grade D/F (&lt;55) | 0 |
| Flagged broken | 0 |
| Flagged placeholder | 0 |
| Thin / single-control template | 90 |
| Low interactivity | 0 |
| Weak mobile signals | 0 |
| No detected JS UX | 0 |

## What we checked (per site)

1. **Loads / structure** — `index.html` exists, DOCTYPE, `html`/`body`, reasonable size  
2. **Links** — relative `./` and `/_shared/` hrefs resolve on disk  
3. **Mobile** — viewport meta + responsive CSS (media queries, `clamp`, shared app/tool/game CSS)  
4. **JavaScript** — `script.js` present, event handlers or form controls, not toast-only stub  
5. **Placeholders** — “coming soon”, static `—` display, minimal script body  

> **Note:** Scores measure structure, interactivity depth, and template richness — not visual design. Almost all sites pass technical checks; the bottom 50 are **relatively** more generic (often one-button batch templates). Hand-crafted #002, #003, #101 score 100. Production hub may still show an old build (~100 cards) while individual site URLs can return 200 OK.

## Issue breakdown

| Issue type | Count |
|------------|------:|
| Broken / missing files or links | 0 |
| Placeholder copy | 0 |
| Thin / single-control template | 90 |
| Low interactivity | 0 |
| Weak mobile responsiveness | 0 |

## 50 lowest-quality sites

| Rank | ID | Folder | Name | Score | Grade | Live | Flags | Top issues |
|------|-----|--------|------|------:|-------|:----:|-------|------------|
| 1 | 306 | `306-prismkit-306` | PrismKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 2 | 326 | `326-gridkit-326` | GridKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 3 | 346 | `346-apexkit-346` | ApexKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 4 | 366 | `366-synckit-366` | SyncKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 5 | 386 | `386-questkit-386` | QuestKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 6 | 406 | `406-prismkit-406` | PrismKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 7 | 426 | `426-gridkit-426` | GridKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 8 | 446 | `446-apexkit-446` | ApexKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 9 | 466 | `466-synckit-466` | SyncKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 10 | 486 | `486-questkit-486` | QuestKit | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 11 | 501 | `501-alphamint-501` | AlphaMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 12 | 518 | `518-quietpad-518` | QuietPad | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 13 | 521 | `521-primemint-521` | PrimeMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 14 | 526 | `526-photonnode-526` | PhotonNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 15 | 543 | `543-packetforge-543` | PacketForge | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 16 | 546 | `546-clientnode-546` | ClientNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 17 | 551 | `551-alphaden-551` | AlphaDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 18 | 568 | `568-quietzone-568` | QuietZone | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 19 | 571 | `571-primeden-571` | PrimeDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 20 | 576 | `576-photonhub-576` | PhotonHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 21 | 593 | `593-packetflow-593` | PacketFlow | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 22 | 596 | `596-clienthub-596` | ClientHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 23 | 601 | `601-alphamint-601` | AlphaMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 24 | 618 | `618-quietpad-618` | QuietPad | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 25 | 621 | `621-primemint-621` | PrimeMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 26 | 626 | `626-photonnode-626` | PhotonNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 27 | 643 | `643-packetforge-643` | PacketForge | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 28 | 646 | `646-clientnode-646` | ClientNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 29 | 651 | `651-alphaden-651` | AlphaDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 30 | 668 | `668-quietzone-668` | QuietZone | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 31 | 671 | `671-primeden-671` | PrimeDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 32 | 676 | `676-photonhub-676` | PhotonHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 33 | 693 | `693-packetflow-693` | PacketFlow | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 34 | 696 | `696-clienthub-696` | ClientHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 35 | 701 | `701-alphamint-701` | AlphaMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 36 | 718 | `718-quietpad-718` | QuietPad | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 37 | 721 | `721-primemint-721` | PrimeMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 38 | 726 | `726-photonnode-726` | PhotonNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 39 | 743 | `743-packetforge-743` | PacketForge | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 40 | 746 | `746-clientnode-746` | ClientNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 41 | 751 | `751-alphaden-751` | AlphaDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 42 | 768 | `768-quietzone-768` | QuietZone | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 43 | 771 | `771-primeden-771` | PrimeDen | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 44 | 776 | `776-photonhub-776` | PhotonHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 45 | 793 | `793-packetflow-793` | PacketFlow | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 46 | 796 | `796-clienthub-796` | ClientHub | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 47 | 801 | `801-alphamint-801` | AlphaMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 48 | 818 | `818-quietpad-818` | QuietPad | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 49 | 821 | `821-primemint-821` | PrimeMint | 94 | A | OK | thin-template | Single-control template (minimal UX) |
| 50 | 826 | `826-photonnode-826` | PhotonNode | 94 | A | OK | thin-template | Single-control template (minimal UX) |

## Detail: bottom 10

### 1. #306 — PrismKit (`306-prismkit-306`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3807 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/306-prismkit-306/

### 2. #326 — GridKit (`326-gridkit-326`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/326-gridkit-326/

### 3. #346 — ApexKit (`346-apexkit-346`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/346-apexkit-346/

### 4. #366 — SyncKit (`366-synckit-366`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/366-synckit-366/

### 5. #386 — QuestKit (`386-questkit-386`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3807 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/386-questkit-386/

### 6. #406 — PrismKit (`406-prismkit-406`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3807 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/406-prismkit-406/

### 7. #426 — GridKit (`426-gridkit-426`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/426-gridkit-426/

### 8. #446 — ApexKit (`446-apexkit-446`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/446-apexkit-446/

### 9. #466 — SyncKit (`466-synckit-466`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3796 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/466-synckit-466/

### 10. #486 — QuestKit (`486-questkit-486`)

- **Score:** 94/100 (A)
- **Logic:** hsl-picker
- **HTML / JS size:** 3807 B / 453 B
- **Responsive:** yes · **Interactive:** yes
- **Issues:** Single-control template (minimal UX)
- **URL:** https://websites-eosin-delta.vercel.app/486-questkit-486/


## Recommendations

1. **Polish the bottom 50** — add one distinctive interaction or visual per site (hand-crafted #002/#003/#101 as reference).  
2. **Spot-check live** — run `npm run verify:live` after deploy; production may lag GitHub (hub still on old builds).  
3. **Re-audit with HTTP** — `node scripts/audit-all-sites.mjs --live` (checks live URLs for the bottom 50).  
4. **Spotlight refresh** — swap weakest featured cards for EggBalance, Daily AI Tools, Motivation Generator.

---

*Report generated by `scripts/audit-all-sites.mjs`*
