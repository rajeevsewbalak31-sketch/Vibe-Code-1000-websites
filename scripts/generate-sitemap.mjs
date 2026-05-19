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

const urls = [{ loc: `${HUB_URL}/`, priority: "1.0" }];

for (const f of manifest.featured || []) {
  urls.push({ loc: f.href.endsWith("/") ? f.href : `${f.href}/`, priority: "0.9" });
}

for (const s of sites) {
  const dir = join(ROOT, `${s.id}-${s.slug}`);
  if (!existsSync(dir)) continue;
  urls.push({
    loc: `${HUB_URL}/${s.id}-${s.slug}/`,
    priority: parseInt(s.id, 10) <= 22 ? "0.8" : "0.6",
  });
}

// Quotely external — already in featured
if (!urls.some((u) => u.loc.includes("quotely"))) {
  const q = manifest.featured?.find((f) => f.id === "002");
  if (q) urls.push({ loc: q.href, priority: "0.9" });
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
