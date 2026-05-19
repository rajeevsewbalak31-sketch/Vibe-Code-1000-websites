/**
 * Regenerate hub: featured strip, gallery cards, progress, SEO meta.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getCategory, isFeaturedId } from "./lib/categories.mjs";
import { HUB_URL, BRAND, hubJsonLd, escapeAttr } from "./lib/seo.mjs";
import { hubMonetizationHtml } from "./lib/monetization.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "manifest.json");
const SITES_PATH = join(__dirname, "sites.json");
const INDEX_PATH = join(ROOT, "index.html");
const HUB_JS_PATH = join(ROOT, "hub.js");

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const sites = JSON.parse(readFileSync(SITES_PATH, "utf8"));
const sitesById = Object.fromEntries(sites.map((s) => [s.id, s]));
const GOAL = manifest.goal ?? 1000;
const spotlightIds = new Set(manifest.spotlight || ["001", "002"]);
const popularRank = Object.fromEntries([...spotlightIds].map((id, i) => [id, i]));

function folderExists(id, slug) {
  return existsSync(join(ROOT, `${id}-${slug}`));
}

function cardHtml({ id, name, tagline, href, live, search, category, featured, compact }) {
  const num = `#${id}`;
  const badge = live ? `<span class="badge">Live</span>` : "";
  const target = href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
  const foot = href.startsWith("http") ? `${new URL(href).hostname} →` : "Open site →";
  const dataName = escapeAttr((search || `${name} ${tagline}`).toLowerCase());
  const cls = compact ? "card card--compact" : "card";
  const pop = popularRank[id] !== undefined ? popularRank[id] : 999;
  const feat = featured ? ' data-featured="true"' : "";
  return `      <a class="${cls}" href="${href}"${target} data-category="${category}" data-sort-id="${id}" data-popular="${pop}"${feat} data-name="${dataName}">
        <div class="card-top"><span class="card-num">${num}</span>${badge}</div>
        <h2>${name}</h2>
        <p>${tagline}</p>
        <span class="card-foot">${foot}</span>
      </a>`;
}

function buildEntryFromFeatured(f) {
  const site = { id: f.id, logic: f.logic, slug: f.slug };
  return {
    id: f.id,
    name: f.name,
    tagline: f.tagline,
    href: f.href,
    live: !!f.live,
    search: f.search,
    category: f.category || getCategory(site),
    featured: isFeaturedId(f.id, spotlightIds),
  };
}

function buildEntryFromSite(s) {
  return {
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    href: `./${s.id}-${s.slug}/`,
    live: false,
    search: `${s.slug} ${s.name} ${s.logic}`,
    category: getCategory(s),
    featured: isFeaturedId(s.id, spotlightIds),
  };
}

const allEntries = [];

for (const f of manifest.featured) {
  allEntries.push(buildEntryFromFeatured(f));
}

for (const s of sites) {
  if (allEntries.some((e) => e.id === s.id)) continue;
  if (!folderExists(s.id, s.slug)) continue;
  allEntries.push(buildEntryFromSite(s));
}

allEntries.sort((a, b) => a.id.localeCompare(b.id));
const count = allEntries.length;

const spotlightEntries = (manifest.spotlight || [])
  .map((id) => {
    const f = manifest.featured?.find((x) => x.id === id);
    if (f) return buildEntryFromFeatured(f);
    const s = sitesById[id];
    if (s && folderExists(s.id, s.slug)) return buildEntryFromSite(s);
    return allEntries.find((e) => e.id === id);
  })
  .filter(Boolean);

const featuredCards = spotlightEntries.map((e) => cardHtml({ ...e, compact: true })).join("\n\n");
const gridCards = allEntries.map((e) => cardHtml(e)).join("\n\n");

const filterButtons = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "tools", label: "Tools" },
  { id: "games", label: "Games" },
  { id: "utilities", label: "Utilities" },
  { id: "landing-pages", label: "Landing Pages" },
  { id: "experiments", label: "Experiments" },
]
  .map(
    (c) =>
      `        <button type="button" class="filter${c.id === "all" ? " is-active" : ""}" data-category="${c.id}">${c.label}</button>`
  )
  .join("\n");

let index = readFileSync(INDEX_PATH, "utf8");

function replaceBlock(start, end, content) {
  if (!index.includes(start) || !index.includes(end)) {
    throw new Error(`index.html missing ${start}`);
  }
  index = index.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n    ${end}`);
}

replaceBlock("<!-- FEATURED_STRIP_START -->", "<!-- FEATURED_STRIP_END -->", featuredCards);
replaceBlock("<!-- SITE_GRID_START -->", "<!-- SITE_GRID_END -->", gridCards);
replaceBlock("<!-- CATEGORY_FILTERS_START -->", "<!-- CATEGORY_FILTERS_END -->", filterButtons);
replaceBlock("<!-- MONETIZE_START -->", "<!-- MONETIZE_END -->", hubMonetizationHtml(manifest));

const desc = `${count} free mini tools — games, utilities, experiments & more. Built with ${BRAND}. Tip via PayPal.`;
index = index.replace(/<strong id="progress-count">\d+<\/strong>/, `<strong id="progress-count">${count}</strong>`);
index = index.replace(/aria-valuenow="\d+"/, `aria-valuenow="${count}"`);
index = index.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(desc)}"`);
index = index.replace(
  /<meta property="og:description" content="[^"]*"/,
  `<meta property="og:description" content="${escapeAttr(desc)}"`
);
index = index.replace(
  /<meta name="twitter:description" content="[^"]*"/,
  `<meta name="twitter:description" content="${escapeAttr(desc)}"`
);
index = index.replace(
  /<span class="count-pill" id="visible-count">\d+ sites<\/span>/,
  `<span class="count-pill" id="visible-count">${count} sites</span>`
);

if (index.includes('id="json-ld"')) {
  index = index.replace(
    /<script type="application\/ld\+json" id="json-ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="json-ld">${hubJsonLd(count)}</script>`
  );
}

writeFileSync(INDEX_PATH, index, "utf8");

let hubJs = readFileSync(HUB_JS_PATH, "utf8");
hubJs = hubJs.replace(/const COMPLETED = \d+;/, `const COMPLETED = ${count};`);
hubJs = hubJs.replace(/const POPULAR_IDS = \[.*?\];/, `const POPULAR_IDS = ${JSON.stringify([...spotlightIds])};`);
writeFileSync(HUB_JS_PATH, hubJs, "utf8");

console.log(`Hub synced: ${count} sites, ${spotlightEntries.length} featured (${HUB_URL})`);
