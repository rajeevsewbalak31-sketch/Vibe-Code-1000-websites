/**
 * Regenerate hub: featured strip, gallery cards, progress, SEO meta.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getCategory, isFeaturedId } from "./lib/categories.mjs";
import { HUB_URL, BRAND, HUB_TITLE, HUB_DESCRIPTION, hubJsonLd, escapeAttr } from "./lib/seo.mjs";
import { vercelAnalyticsScripts } from "./lib/analytics.mjs";
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
const appCount = allEntries.filter((e) => {
  const n = parseInt(e.id, 10);
  return n >= 201 && n <= 300;
}).length;
const creativeCount = allEntries.filter((e) => {
  const n = parseInt(e.id, 10);
  return n >= 301 && n <= 500;
}).length;
const labsCount = allEntries.filter((e) => parseInt(e.id, 10) >= 501).length;
const brand = manifest.branding || {};
const PROGRESS_CURRENT = brand.progressCurrent ?? count;
const PROGRESS_GOAL = brand.progressGoal ?? GOAL;
const HERO_TITLE = brand.heroTitle || "VibeCode 1000";
const HERO_SUBTITLE = brand.heroSubtitle || "1000 AI-built websites. Built in public.";
const ogUrl = `${HUB_URL}${OG_IMAGE.startsWith("/") ? OG_IMAGE : `/${OG_IMAGE}`}`;
const plausibleDomain = manifest.hub?.plausibleDomain || "";
const vercelAnalyticsEnabled = manifest.hub?.vercelAnalytics !== false;

function resolveEntry(id) {
  const f = manifest.featured?.find((x) => x.id === id);
  if (f) return buildEntryFromFeatured(f);
  const s = sitesById[id];
  if (s && folderExists(s.id, s.slug)) return buildEntryFromSite(s);
  return allEntries.find((e) => e.id === id);
}

const spotlightEntries = (manifest.spotlight || [])
  .map((id) => resolveEntry(id))
  .filter(Boolean);

const homeFeaturedIds = manifest.homeFeatured || ["004", "003", "007", "101", "104", "001"];
const homeFeaturedEntries = homeFeaturedIds.map((id) => resolveEntry(id)).filter(Boolean);
const latestId = manifest.latestProject || homeFeaturedIds[0] || "004";
const latestEntry = resolveEntry(latestId);

const gridCards = allEntries.map((e) => cardHtml(e)).join("\n\n");

const filterButtons = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "tools", label: "Tools" },
  { id: "games", label: "Games" },
  { id: "utilities", label: "Utilities" },
  { id: "landing-pages", label: "Landing Pages" },
  { id: "experiments", label: "Experiments" },
  { id: "creative", label: "Creative" },
  { id: "labs", label: "Labs" },
]
  .map(
    (c) =>
      `        <button type="button" class="filter${c.id === "all" ? " is-active" : ""}" data-category="${c.id}">${c.label}</button>`
  )
  .join("\n");

function heroHtml() {
  const pct = Math.min(100, Math.round((PROGRESS_CURRENT / PROGRESS_GOAL) * 1000) / 10);
  const pctDisplay = Number.isInteger(pct) ? `${pct}` : pct.toFixed(1);
  const welcomeTitle = brand.heroWelcomeTitle || "Hi, I'm building 1000 things.";
  const welcomeSub = brand.heroWelcomeSubtitle || "One project a day. Learning in public.";
  const who = brand.aboutBuiltBy || "Ui";
  const loc = brand.aboutLocation || "the Netherlands";
  const latestHref = latestEntry?.href || "#home-featured";
  const latestName = latestEntry?.name || "latest project";
  return `    <section class="hero hero--welcome" id="home" aria-labelledby="hero-title">
      <div class="hero-personal">
        <span class="hero-avatar" aria-hidden="true">${escapeAttr(who.slice(0, 1).toUpperCase())}</span>
        <p class="hero-eyebrow">Built in ${escapeAttr(loc)} 🇳🇱 · learning in public</p>
      </div>
      <h1 id="hero-title">${escapeAttr(welcomeTitle)}</h1>
      <p class="hero-lead">${escapeAttr(welcomeSub)}</p>
      <p class="hero-progress-text" id="progress">
        Progress: <strong id="progress-count">${PROGRESS_CURRENT}</strong> / <span id="progress-goal">${PROGRESS_GOAL}</span> projects completed (<span id="progress-pct">${pctDisplay}</span>%)
      </p>
      <div class="progress-wrap progress-wrap--hero" aria-hidden="true">
        <div class="progress-bar" role="progressbar" aria-valuenow="${PROGRESS_CURRENT}" aria-valuemin="0" aria-valuemax="${PROGRESS_GOAL}" aria-label="Challenge progress" style="--progress-pct:${Math.min(100, pct)}%">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
      <div class="hero-cta">
        <a class="btn btn--primary btn--lg" href="#home-featured">Start here</a>
        <a class="btn btn--ghost btn--lg" href="${escapeAttr(latestHref)}">View latest project</a>
      </div>
      <p class="hero-latest-note">Latest: <a href="${escapeAttr(latestHref)}">${escapeAttr(latestName)}</a></p>
    </section>`;
}

function whatIsHtml() {
  return `    <section class="what-is" id="what-is" aria-labelledby="what-is-heading">
      <h2 id="what-is-heading" class="section-title">What is this?</h2>
      <p class="what-is-text">A public build log where I create 1000 small apps, tools, and experiments while learning in public.</p>
    </section>`;
}

function homeCardHtml(e) {
  const base = cardHtml({ ...e, compact: false });
  return base.replace('class="card"', 'class="card card--home"');
}

function homeFeaturedHtml() {
  const cards = homeFeaturedEntries.map((e) => homeCardHtml(e)).join("\n\n");
  return `    <section class="home-featured" id="home-featured" aria-labelledby="home-featured-heading">
      <div class="home-featured-head">
        <h2 id="home-featured-heading" class="section-title">Featured projects</h2>
        <p class="section-lead">Good places to start — try a tool, play a game, or see how payments work.</p>
      </div>
      <div class="home-featured-grid">
${cards}
      </div>
      <p class="home-featured-more">
        <a class="btn btn--ghost btn--lg" href="#projects">View all ${count} projects →</a>
      </p>
    </section>`;
}

function aboutHtml() {
  const who = brand.aboutBuiltBy || "Ui";
  const loc = brand.aboutLocation || "the Netherlands";
  const challenge = brand.aboutChallenge || "Public challenge to build 1000 websites using AI.";
  return `    <section class="about-panel" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading" class="section-title">About</h2>
      <p class="about-text">Built by <strong>${escapeAttr(who)}</strong> in ${escapeAttr(loc)}.</p>
      <p class="about-text">${escapeAttr(challenge)}</p>
      <p class="about-text about-text--muted">This hub tracks the challenge — each entry is a small site you can open, use, and share.</p>
    </section>`;
}

function newsletterHtml() {
  const heading = brand.newsletterHeading || "Follow the journey";
  const lead = brand.newsletterLead || "Get updates as new sites ship.";
  const formspree = (brand.newsletterFormspree || "").trim();
  const endpoint = formspree
    ? formspree.startsWith("http")
      ? formspree
      : `https://formspree.io/f/${formspree}`
    : "";
  const dataEndpoint = endpoint ? ` data-endpoint="${escapeAttr(endpoint)}"` : "";
  const xUrl = (brand.social?.x || "").trim();
  const fallbackNote = endpoint
    ? ""
    : xUrl
      ? `        <p class="newsletter-fine newsletter-fine--setup">No mailing provider yet — sign-ups save on this device. <a href="${escapeAttr(xUrl)}" target="_blank" rel="noopener noreferrer">Follow on X</a> for live updates.</p>\n`
      : `        <p class="newsletter-fine newsletter-fine--setup">No mailing provider yet — sign-ups save on this device until Formspree is connected.</p>\n`;
  return `    <section class="newsletter-panel" id="newsletter" aria-labelledby="newsletter-heading">
      <div class="newsletter-inner">
        <h2 id="newsletter-heading" class="section-title">${escapeAttr(heading)}</h2>
        <p class="section-lead">${escapeAttr(lead)}</p>
        <form class="newsletter-form" id="newsletter-form" novalidate${dataEndpoint}>
          <label class="newsletter-label" for="newsletter-email">Email</label>
          <div class="newsletter-row">
            <input class="newsletter-input" id="newsletter-email" name="email" type="email" required autocomplete="email" placeholder="you@email.com" />
            <button type="submit" class="btn btn--primary">Subscribe</button>
          </div>
          <p class="newsletter-fine" id="newsletter-status" role="status" aria-live="polite"></p>
        </form>
${fallbackNote}      </div>
    </section>`;
}

function footerHtml() {
  const social = brand.social || {};
  const x = social.x || "#";
  const linkedin = social.linkedin || "#";
  const github = social.github || "https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites";
  const loc = brand.aboutLocation || "the Netherlands";
  const who = brand.aboutBuiltBy || "Ui";
  return `    <footer class="footer site-footer">
      <nav class="footer-social" aria-label="Social links">
        <a href="${escapeAttr(x)}" class="footer-social-link" aria-label="X (Twitter)">X</a>
        <a href="${escapeAttr(linkedin)}" class="footer-social-link" aria-label="LinkedIn">LinkedIn</a>
        <a href="${escapeAttr(github)}" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
      </nav>
      <p class="footer-brand">${escapeAttr(HERO_TITLE)} · Built by ${escapeAttr(who)}</p>
      <p class="footer-location">Built in ${escapeAttr(loc)} 🇳🇱</p>
      <p class="footer-meta">
        <a href="#get-a-site">Get your own site</a>
        · <a href="https://paypal.me/RajeevSewbalak" target="_blank" rel="noopener noreferrer">PayPal</a>
      </p>
    </footer>`;
}

function batchBannersHtml() {
  const inner = [gamesBannerHtml(), appsBannerHtml(), creativeBannerHtml(), labsBannerHtml(), milestoneBannerHtml()]
    .filter(Boolean)
    .join("\n\n");
  if (!inner) return "";
  return `    <section class="hub-batches" aria-label="Browse by batch">
      <details class="batches-details">
        <summary class="batches-summary">Browse collections (games, apps, labs)</summary>
        <div class="batches-inner">
${inner}
        </div>
      </details>
    </section>`;
}

function topBarHtml() {
  return `    <header class="top-bar">
      <a class="brand" href="#home">
        <span class="brand-mark">VC</span>
        <span class="brand-text">${escapeAttr(HERO_TITLE)}</span>
      </a>
      <nav class="top-nav" aria-label="Main">
        <a class="top-nav-link" href="#home">Home</a>
        <a class="top-nav-link" href="#projects">Projects</a>
        <a class="top-nav-link" href="#progress">Progress</a>
        <a class="top-nav-link" href="#about">About</a>
      </nav>
      <div class="top-actions">
        <a class="btn btn--ghost btn--sm" href="#newsletter">Updates</a>
        <a class="btn btn--buy btn--sm" href="#get-a-site">Get your site (€49)</a>
      </div>
    </header>`;
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
          <p><strong>EggBalance</strong> — chaotic 3D wobble survival. <strong>NestRun</strong> — polished snake with best score. Plus stack, breakout, memory & more.</p>
        </div>
        <div class="games-banner-actions">
          <a class="btn btn--primary" href="./101-egg-balance/">Play EggBalance</a>
          <a class="btn btn--ghost" href="./104-nestrun/">Play NestRun</a>
          <button type="button" class="btn btn--ghost" data-filter-games>All games</button>
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

function vercelAnalyticsBlock() {
  if (!vercelAnalyticsEnabled) return "";
  return vercelAnalyticsScripts();
}

function creativeBannerHtml() {
  if (creativeCount === 0) return "";
  return `    <section class="games-banner games-banner--apps" id="creative-launch" aria-labelledby="creative-banner-heading">
      <div class="games-banner-inner">
        <span class="games-banner-badge">Batch #4</span>
        <div class="games-banner-copy">
          <h2 id="creative-banner-heading">${creativeCount} creative tools (#301–500)</h2>
          <p>QR codes, UUIDs, contrast checker, typing test, pixel doodle, tone generator, lorem ipsum, and more.</p>
        </div>
        <div class="games-banner-actions">
          <a class="btn btn--primary" href="#site-grid" data-filter-creative>Explore creative</a>
        </div>
      </div>
    </section>`;
}

function labsBannerHtml() {
  if (labsCount === 0) return "";
  return `    <section class="games-banner games-banner--apps" id="labs-launch" aria-labelledby="labs-banner-heading">
      <div class="games-banner-inner">
        <span class="games-banner-badge">Final batch</span>
        <div class="games-banner-copy">
          <h2 id="labs-banner-heading">${labsCount} micro-labs (#501–1000)</h2>
          <p>Habits, notes, metronome, polls, compound interest, Caesar cipher, meme text, and more — the home stretch to 1000.</p>
        </div>
        <div class="games-banner-actions">
          <a class="btn btn--primary" href="#site-grid" data-filter-labs>Browse labs</a>
        </div>
      </div>
    </section>`;
}

function milestoneBannerHtml() {
  if (count < GOAL) return "";
  return `    <section class="games-banner" style="border-color:color-mix(in srgb,var(--accent-2) 50%,var(--border));background:linear-gradient(135deg,color-mix(in srgb,var(--accent-2) 18%,transparent),color-mix(in srgb,var(--accent) 12%,transparent))" aria-label="Milestone reached">
      <div class="games-banner-inner" style="justify-content:center;text-align:center">
        <div>
          <h2 style="font-family:var(--font-display);font-size:1.75rem;margin-bottom:.35rem">🎉 ${GOAL} websites milestone</h2>
          <p style="color:var(--muted);max-width:32rem;margin:0 auto">The 1000 Websites Challenge engine delivered ${count} live mini-apps. Play EggBalance, explore the gallery, or order your own from €49.</p>
        </div>
      </div>
    </section>`;
}

let index = readFileSync(INDEX_PATH, "utf8");

function replaceBlock(start, end, content) {
  if (!index.includes(start) || !index.includes(end)) {
    throw new Error(`index.html missing ${start}`);
  }
  index = index.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n    ${end}`);
}

replaceBlock("<!-- TOP_BAR_START -->", "<!-- TOP_BAR_END -->", topBarHtml());
replaceBlock("<!-- HERO_START -->", "<!-- HERO_END -->", heroHtml());
replaceBlock("<!-- WHAT_IS_START -->", "<!-- WHAT_IS_END -->", whatIsHtml());
replaceBlock("<!-- HOME_FEATURED_START -->", "<!-- HOME_FEATURED_END -->", homeFeaturedHtml());
replaceBlock("<!-- NEWSLETTER_START -->", "<!-- NEWSLETTER_END -->", newsletterHtml());
replaceBlock("<!-- BATCH_BANNERS_START -->", "<!-- BATCH_BANNERS_END -->", batchBannersHtml());
replaceBlock("<!-- ABOUT_START -->", "<!-- ABOUT_END -->", aboutHtml());
replaceBlock("<!-- SITE_GRID_START -->", "<!-- SITE_GRID_END -->", gridCards);
replaceBlock("<!-- CATEGORY_FILTERS_START -->", "<!-- CATEGORY_FILTERS_END -->", filterButtons);
replaceBlock("<!-- MONETIZE_START -->", "<!-- MONETIZE_END -->", hubMonetizationHtml(manifest));
replaceBlock("<!-- FOOTER_START -->", "<!-- FOOTER_END -->", footerHtml());

replaceBlock("<!-- PLAUSIBLE_START -->", "<!-- PLAUSIBLE_END -->", plausibleHead());
replaceBlock("<!-- VERCEL_ANALYTICS_START -->", "<!-- VERCEL_ANALYTICS_END -->", vercelAnalyticsBlock());

const desc = HUB_DESCRIPTION;
index = index.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(HUB_TITLE)}</title>`);
index = index.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(desc)}"`);
index = index.replace(
  /<meta property="og:title" content="[^"]*"/,
  `<meta property="og:title" content="${escapeAttr(HUB_TITLE)}"`
);
index = index.replace(
  /<meta property="og:description" content="[^"]*"/,
  `<meta property="og:description" content="${escapeAttr(desc)}"`
);
index = index.replace(
  /<meta property="og:site_name" content="[^"]*"/,
  `<meta property="og:site_name" content="${escapeAttr(BRAND)}"`
);
if (!index.includes('property="og:site_name"')) {
  index = index.replace(
    /<meta property="og:url"/,
    `<meta property="og:site_name" content="${escapeAttr(BRAND)}" />\n  <meta property="og:url"`
  );
}
index = index.replace(
  /<meta name="twitter:title" content="[^"]*"/,
  `<meta name="twitter:title" content="${escapeAttr(HUB_TITLE)}"`
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
    `<script type="application/ld+json" id="json-ld">${hubJsonLd(count, gameCount, labsCount)}</script>`
  );
}

writeFileSync(INDEX_PATH, index, "utf8");

let hubJs = readFileSync(HUB_JS_PATH, "utf8");
hubJs = hubJs.replace(/const COMPLETED = \d+;/, `const COMPLETED = ${PROGRESS_CURRENT};`);
hubJs = hubJs.replace(/const TOTAL = \d+;/, `const TOTAL = ${PROGRESS_GOAL};`);
const popularIds = [...new Set([...homeFeaturedIds, ...spotlightIds])];
hubJs = hubJs.replace(/const POPULAR_IDS = \[.*?\];/, `const POPULAR_IDS = ${JSON.stringify(popularIds)};`);
writeFileSync(HUB_JS_PATH, hubJs, "utf8");

console.log(
  `Hub synced: ${count} sites (${gameCount} games, ${labsCount} labs), ${homeFeaturedEntries.length} home featured (${HUB_URL})`
);
