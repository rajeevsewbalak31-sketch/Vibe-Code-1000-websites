/**
 * Fix root-relative script/style paths for Vercel trailingSlash: false.
 * Relative "script.js" resolves to /script.js when URL has no trailing slash.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let updated = 0;
let skipped = 0;

for (const ent of readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory() || !/^\d{3,4}-/.test(ent.name)) continue;
  const folder = ent.name;
  const htmlPath = join(ROOT, folder, "index.html");
  if (!existsSync(htmlPath)) continue;

  let html = readFileSync(htmlPath, "utf8");
  const base = `/${folder}`;
  const styleHref = `${base}/style.css`;
  const scriptSrc = `${base}/script.js`;

  const next = html
    .replace(/href="style\.css"/g, `href="${styleHref}"`)
    .replace(/src="script\.js"/g, `src="${scriptSrc}"`);

  if (next === html) {
    skipped++;
    continue;
  }
  writeFileSync(htmlPath, next, "utf8");
  updated++;
}

console.log(`Asset paths: ${updated} updated, ${skipped} already correct`);
