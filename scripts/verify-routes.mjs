/**
 * Verify all site folders exist and hub cards point to real paths.
 * Run before deploy: node scripts/verify-routes.mjs
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INDEX = join(ROOT, "index.html");
const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));

const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
  .map((d) => d.name)
  .sort();

let errors = 0;
const missing = [];

const SKIP_INDEX = new Set(["001-buy-a-square"]); // Next.js — separate Vercel project

for (const folder of folders) {
  if (SKIP_INDEX.has(folder)) continue;
  const indexPath = join(ROOT, folder, "index.html");
  if (!existsSync(indexPath)) {
    errors++;
    missing.push(`${folder}/index.html`);
  }
}

const html = readFileSync(INDEX, "utf8");
const hrefRe = /href="\.\/(\d{3}-[^/]+)\/?"/g;
const hubPaths = new Set();
let m;
while ((m = hrefRe.exec(html)) !== null) hubPaths.add(m[1]);

for (const path of hubPaths) {
  if (!existsSync(join(ROOT, path, "index.html"))) {
    errors++;
    missing.push(`hub link → ${path}/ (missing on disk)`);
  }
}

const onDisk = new Set(folders);
for (const path of hubPaths) {
  if (!onDisk.has(path)) {
    errors++;
    missing.push(`hub link → ${path}/ (folder missing)`);
  }
}

const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));
for (const s of sites) {
  const dir = `${s.id}-${s.slug}`;
  if (!onDisk.has(dir)) {
    errors++;
    missing.push(`sites.json ${s.id} → ${dir} missing`);
  }
}

console.log("── Route verification ──");
console.log(`Folders on disk:     ${folders.length}`);
console.log(`Hub relative links:  ${hubPaths.size}`);
console.log(`sites.json entries:  ${sites.length}`);
console.log(`Featured (external): ${manifest.featured?.length ?? 0}`);

if (errors) {
  console.error(`\nFAILED: ${errors} issue(s)`);
  missing.forEach((x) => console.error("  -", x));
  process.exit(1);
}
console.log("\nOK — all hub paths resolve to index.html on disk");
