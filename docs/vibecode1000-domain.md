# Custom domain — vibecode1000.com

Canonical hub URL: **https://vibecode1000.com**

## 1. Vercel (project settings)

1. Open the Vibe Code 1000 project on [Vercel](https://vercel.com).
2. **Settings → Domains**
3. Add:
   - `vibecode1000.com`
   - `www.vibecode1000.com` (optional; redirect www → apex in Vercel if you prefer one hostname)
4. Note the DNS records Vercel shows (usually **A** `76.76.21.21` and/or **CNAME** `cname.vercel-dns.com`).

Set **vibecode1000.com** as the **Primary** domain when both apex and `www` are connected.

## 2. Porkbun DNS

In Porkbun → **vibecode1000.com** → DNS:

| Type  | Host | Value                    |
|-------|------|--------------------------|
| A     | @    | `76.76.21.21`            |
| CNAME | www  | `cname.vercel-dns.com`   |

(Use exactly what Vercel displays if it differs.)

Propagation can take a few minutes up to 48 hours.

## 3. After DNS is live

- [ ] **Google Search Console** — add property `https://vibecode1000.com`, verify, submit `sitemap.xml`
- [ ] **Plausible** — add site `vibecode1000.com` (manifest already uses this domain)
- [ ] **X / LinkedIn** — bio links to `https://vibecode1000.com`
- [ ] Old Vercel URL redirects automatically (`vercel.json` → `vibecode1000.com`)

## 4. Repo updates (already in manifest)

- `scripts/manifest.json` → `hubUrl`, `hub.plausibleDomain`
- Regenerate: `npm run engine:hub` and `npm run engine:sitemap`
- Full site canonicals: `npm run engine:seo` (rewrites meta on all generated sites)

## 5. SSL

Vercel provisions HTTPS once DNS points correctly. No extra step on Porkbun beyond the records above.

## 6. After deploy (checklist)

- [ ] Open https://vibecode1000.com — hero, footer X/LinkedIn/GitHub work
- [ ] Old URL https://websites-eosin-delta.vercel.app redirects to vibecode1000.com
- [ ] Google Search Console — add property, submit sitemap
- [ ] Plausible — add `vibecode1000.com`
- [ ] GitHub repo About → Website `https://vibecode1000.com`
- [ ] Newsletter — see [newsletter-setup.md](./newsletter-setup.md) (Formspree id in manifest)
