/**
 * Generate sitemap.xml + robots.txt at repo root.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { HUB_URL } from "./lib/seo.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));
const today = new Date().toISOString().slice(0, 10);

function toAbsoluteLoc(href) {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href.endsWith("/") ? href : `${href}/`;
  }
  const path = href.replace(/^\.\//, "").replace(/^\//, "");
  return `${HUB_URL}/${path}${path.endsWith("/") ? "" : "/"}`;
}

const seen = new Set();
const urls = [];

function addUrl(loc, priority) {
  if (!loc || seen.has(loc)) return;
  seen.add(loc);
  urls.push({ loc, priority });
}

addUrl(`${HUB_URL}/`, "1.0");

for (const f of manifest.featured || []) {
  const loc = toAbsoluteLoc(f.href);
  if (loc) addUrl(loc, "0.9");
}

for (const s of sites) {
  const dir = join(ROOT, `${s.id}-${s.slug}`);
  if (!existsSync(dir)) continue;
  addUrl(`${HUB_URL}/${s.id}-${s.slug}/`, parseInt(s.id, 10) <= 22 ? "0.8" : "0.6");
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "sitemap.xml"), xml, "utf8");

const robots = `# ${manifest.hubUrl || HUB_URL}
User-agent: *
Allow: /

Sitemap: ${HUB_URL}/sitemap.xml
`;

writeFileSync(join(ROOT, "robots.txt"), robots, "utf8");
console.log(`sitemap.xml: ${urls.length} URLs · robots.txt updated`);
