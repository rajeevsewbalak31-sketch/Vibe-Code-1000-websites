/**
 * Validate sites.json and that each entry has a folder (or is featured-only).
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));
const featuredIds = new Set((manifest.featured || []).map((f) => f.id));

let errors = 0;
const seen = new Set();

for (const s of sites) {
  if (seen.has(s.id)) {
    console.error(`Duplicate id: ${s.id}`);
    errors++;
  }
  seen.add(s.id);
  for (const key of ["id", "slug", "name", "tagline", "logic", "accent", "accent2"]) {
    if (!s[key]) {
      console.error(`Missing ${key} on site ${s.id}`);
      errors++;
    }
  }
  const dir = join(ROOT, `${s.id}-${s.slug}`);
  if (!existsSync(dir) && !featuredIds.has(s.id)) {
    console.error(`Missing folder: ${s.id}-${s.slug}`);
    errors++;
  } else if (existsSync(dir)) {
    for (const f of ["index.html", "style.css", "script.js"]) {
      if (!existsSync(join(dir, f))) {
        console.error(`Missing ${f} in ${s.id}-${s.slug}`);
        errors++;
      }
    }
  }
}

const folders = readdirSync(ROOT).filter((n) => /^\d{3,4}-/.test(n));
for (const folder of folders) {
  const id = folder.match(/^(\d{3,4})-/)[1];
  if (!seen.has(id) && !featuredIds.has(id)) {
    console.error(`Folder not in sites.json: ${folder}`);
    errors++;
  }
}

if (errors) {
  console.error(`\nValidation failed: ${errors} issue(s)`);
  process.exit(1);
}
console.log(`OK — ${sites.length} registry entries, ${folders.length} folders`);
