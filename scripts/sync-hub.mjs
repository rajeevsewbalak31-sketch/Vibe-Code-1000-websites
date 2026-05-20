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
const spotlightIds = new Set(manifest.spotlight || ["001", "002", "101"]);
const popularRank = Object.fromEntries([...spotlightIds].map((id, i) => [id, i]));
const OG_IMAGE = manifest.hub?.ogImage || "/og.svg";

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
    live: folderExists(s.id, s.slug),
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
const gameCount = allEntries.filter(
  (e) => e.category === "games" && parseInt(e.id, 10) >= 101 && parseInt(e.id, 10) <= 200
).length;
const appCount = allEntries.filter((e) => parseInt(e.id, 10) >= 201).length;
const ogUrl = `${HUB_URL}${OG_IMAGE.startsWith("/") ? OG_IMAGE : `/${OG_IMAGE}`}`;
const plausibleDomain = manifest.hub?.plausibleDomain || "";

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

function heroHtml() {
  return `    <section class="hero">
      <p class="hero-eyebrow">${count} sites live · ${gameCount} games · ${appCount} interactive apps · From €49</p>
      <h1>1000 Websites Challenge</h1>
      <p class="hero-lead">
        Browse <strong>${count} free mini-apps</strong> — tools, games, calculators, and experiments — or <strong>get your own site built in 24h</strong>.
      </p>
      <ul class="trust-bar trust-bar--hero" aria-label="Trust signals">
        <li><span class="trust-num">${count}</span> sites</li>
        <li><span class="trust-num">${gameCount}</span> games</li>
        <li><span class="trust-num">${appCount}</span> apps</li>
      </ul>
      <div class="progress-wrap">
        <div class="progress-label">
          <span>Progress</span>
          <span><strong id="progress-count">${count}</strong> / ${GOAL}</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${GOAL}" aria-label="Sites completed">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
      <div class="hero-cta">
        <a class="btn btn--buy btn--lg" href="#get-a-site">Get your own website (€49)</a>
        <a class="btn btn--ghost" href="./101-egg-balance/">Play EggBalance</a>
        <a class="btn btn--ghost" href="#site-grid" data-filter-games>Browse games</a>
      </div>
    </section>`;
}

function gamesBannerHtml() {
  const batchSize = allEntries.filter(
    (e) => e.category === "games" && parseInt(e.id, 10) >= 101
  ).length;
  return `    <section class="games-banner" id="games-launch" aria-labelledby="games-banner-heading">
      <div class="games-banner-inner">
        <span class="games-banner-badge">New batch</span>
        <div class="games-banner-copy">
          <h2 id="games-banner-heading">${batchSize} vibe-coded games (#101–200)</h2>
          <p>Start with <strong>EggBalance</strong> — place eggs in the carton, feel the tilt, don’t let it tip. Plus snake, stack, breakout, memory & more.</p>
        </div>
        <div class="games-banner-actions">
          <a class="btn btn--primary" href="./101-egg-balance/">Play EggBalance</a>
          <button type="button" class="btn btn--ghost" data-filter-games>Filter: Games</button>
        </div>
      </div>
    </section>`;
}

function appsBannerHtml() {
  if (appCount === 0) return "";
  return `    <section class="games-banner games-banner--apps" id="apps-launch" aria-labelledby="apps-banner-heading">
      <div class="games-banner-inner">
        <span class="games-banner-badge">Batch #3</span>
        <div class="games-banner-copy">
          <h2 id="apps-banner-heading">${appCount} interactive apps (#201–300)</h2>
          <p>Gradient & shadow CSS builders, BMI & percent calculators, JSON formatter, Markdown preview, Morse code, and more.</p>
        </div>
        <div class="games-banner-actions">
          <a class="btn btn--primary" href="#site-grid" data-filter-experiments>Explore apps</a>
        </div>
      </div>
    </section>`;
}

function plausibleHead() {
  if (!plausibleDomain) return "";
  return `  <script defer data-domain="${escapeAttr(plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`;
}

let index = readFileSync(INDEX_PATH, "utf8");

function replaceBlock(start, end, content) {
  if (!index.includes(start) || !index.includes(end)) {
    throw new Error(`index.html missing ${start}`);
  }
  index = index.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n    ${end}`);
}

replaceBlock("<!-- HERO_START -->", "<!-- HERO_END -->", heroHtml());
replaceBlock("<!-- GAMES_BANNER_START -->", "<!-- GAMES_BANNER_END -->", gamesBannerHtml());
replaceBlock("<!-- APPS_BANNER_START -->", "<!-- APPS_BANNER_END -->", appsBannerHtml());
replaceBlock("<!-- FEATURED_STRIP_START -->", "<!-- FEATURED_STRIP_END -->", featuredCards);
replaceBlock("<!-- SITE_GRID_START -->", "<!-- SITE_GRID_END -->", gridCards);
replaceBlock("<!-- CATEGORY_FILTERS_START -->", "<!-- CATEGORY_FILTERS_END -->", filterButtons);
replaceBlock("<!-- MONETIZE_START -->", "<!-- MONETIZE_END -->", hubMonetizationHtml(manifest));

replaceBlock("<!-- PLAUSIBLE_START -->", "<!-- PLAUSIBLE_END -->", plausibleHead());

const desc = `${count} free mini-apps — ${gameCount} games, ${appCount} interactive apps, tools & utilities. Built with ${BRAND}. Tip via PayPal.`;
index = index.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(desc)}"`);
index = index.replace(
  /<meta property="og:description" content="[^"]*"/,
  `<meta property="og:description" content="${escapeAttr(desc)}"`
);
index = index.replace(
  /<meta name="twitter:description" content="[^"]*"/,
  `<meta name="twitter:description" content="${escapeAttr(desc)}"`
);
if (!index.includes("og:image")) {
  index = index.replace(
    /<meta property="og:url"/,
    `<meta property="og:image" content="${escapeAttr(ogUrl)}" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta name="twitter:image" content="${escapeAttr(ogUrl)}" />\n  <meta property="og:url"`
  );
} else {
  index = index.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${escapeAttr(ogUrl)}"`);
  index = index.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${escapeAttr(ogUrl)}"`);
}
index = index.replace(
  /<span class="count-pill" id="visible-count">[^<]*<\/span>/,
  `<span class="count-pill" id="visible-count">${count} sites</span>`
);

if (index.includes('id="json-ld"')) {
  index = index.replace(
    /<script type="application\/ld\+json" id="json-ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="json-ld">${hubJsonLd(count, gameCount)}</script>`
  );
}

writeFileSync(INDEX_PATH, index, "utf8");

let hubJs = readFileSync(HUB_JS_PATH, "utf8");
hubJs = hubJs.replace(/const COMPLETED = \d+;/, `const COMPLETED = ${count};`);
hubJs = hubJs.replace(/const POPULAR_IDS = \[.*?\];/, `const POPULAR_IDS = ${JSON.stringify([...spotlightIds])};`);
writeFileSync(HUB_JS_PATH, hubJs, "utf8");

console.log(
  `Hub synced: ${count} sites (${gameCount} games, ${appCount} apps), ${spotlightEntries.length} featured (${HUB_URL})`
);
