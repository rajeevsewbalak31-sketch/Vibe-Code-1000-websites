/**
 * Inject Vercel Analytics into hub + all numbered site index.html files.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { injectVercelAnalytics } from "./lib/analytics.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INDEX = join(ROOT, "index.html");

let updated = 0;
let skipped = 0;

function patch(path) {
  const html = readFileSync(path, "utf8");
  const next = injectVercelAnalytics(html);
  if (next === html) {
    skipped++;
    return;
  }
  writeFileSync(path, next, "utf8");
  updated++;
}

if (existsSync(INDEX)) patch(INDEX);

for (const name of readdirSync(ROOT, { withFileTypes: true })) {
  if (!name.isDirectory() || !/^\d{3}-/.test(name.name)) continue;
  const file = join(ROOT, name.name, "index.html");
  if (existsSync(file)) patch(file);
}

console.log(`Vercel Analytics: ${updated} updated, ${skipped} unchanged`);
