/** Shared SEO snippets for hub + generated sites. */

export const BRAND = "Vibe Code 1000";
export const HUB_URL = "https://websites-eosin-delta.vercel.app";
export const HUB_TITLE = `${BRAND} — Hub`;
export const GITHUB_URL =
  "https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites";

export function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function siteCanonical(id, slug) {
  return `${HUB_URL}/${id}-${slug}/`;
}

export function siteTitle(name) {
  return `${name} | ${BRAND}`;
}

export function siteDescription(name, tagline) {
  return `Free ${name} tool — ${tagline} Built with ${BRAND}.`;
}

/** Extra <head> tags for a generated mini-site. */
export function siteHeadMeta(site) {
  const url = siteCanonical(site.id, site.slug);
  const title = siteTitle(site.name);
  const desc = siteDescription(site.name, site.tagline);
  const keywords = [site.name, site.logic, BRAND, "free web tool"].join(", ");
  return `
  <meta name="description" content="${escapeAttr(desc)}" />
  <meta name="keywords" content="${escapeAttr(keywords)}" />
  <meta name="author" content="Rajeev Sewbalak" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${escapeAttr(BRAND)}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeAttr(title)}" />
  <meta name="twitter:description" content="${escapeAttr(desc)}" />`;
}

export function hubJsonLd(siteCount) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    alternateName: "1000 Websites Challenge",
    url: HUB_URL,
    description: `${siteCount} free mini web tools — built by a site generation engine.`,
    author: { "@type": "Person", name: "Rajeev Sewbalak" },
  });
}
