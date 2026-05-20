/** Shared SEO snippets for hub + generated sites. */

export const BRAND = "Vibe Code 1000";
export const HUB_URL = "https://websites-eosin-delta.vercel.app";
export const HUB_TITLE = `${BRAND} — 1000 Free Mini Apps & Games`;
export const HUB_DESCRIPTION =
  "Browse 1000 free browser mini-apps: 100 games, 500 labs, tools, and utilities. Play EggBalance, spin up randomizers, and explore the Vibe Code 1000 gallery.";
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

export function hubJsonLd(siteCount, gameCount = 0, labsCount = 0) {
  const desc = `${siteCount} free mini web apps in one gallery${gameCount ? `, including ${gameCount} games` : ""}${labsCount ? ` and ${labsCount} micro-labs` : ""}.`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${HUB_URL}/#website`,
        name: BRAND,
        alternateName: "1000 Websites Challenge",
        url: HUB_URL,
        description: desc,
        inLanguage: "en",
        publisher: { "@type": "Person", name: "Rajeev Sewbalak" },
        potentialAction: {
          "@type": "SearchAction",
          target: `${HUB_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${HUB_URL}/#collection`,
        name: BRAND,
        url: HUB_URL,
        description: desc,
        isPartOf: { "@id": `${HUB_URL}/#website` },
        about: {
          "@type": "CreativeWorkSeries",
          name: "Vibe Code 1000 mini-apps",
          numberOfItems: siteCount,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${HUB_URL}/#sitelist`,
        name: `${BRAND} directory`,
        numberOfItems: siteCount,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: {
          "@type": "ListItem",
          position: 1,
          name: "Site gallery",
          url: `${HUB_URL}/#site-grid`,
        },
      },
    ],
  });
}
