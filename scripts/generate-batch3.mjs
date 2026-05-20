import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { BATCH3_LOGIC_SET } from "./lib/batch3-catalog.mjs";
import { BATCH3_TEMPLATES } from "./lib/batch3-templates.mjs";
import { appHtml, accentCss, toastHelper } from "./lib/app-shell.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FORCE = process.argv.includes("--force");
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));

let created = 0;
let updated = 0;

for (const site of sites) {
  if (!BATCH3_LOGIC_SET.has(site.logic)) continue;
  const tpl = BATCH3_TEMPLATES[site.logic];
  if (!tpl) {
    console.error("No batch3 template:", site.logic, site.id);
    process.exit(1);
  }
  const dir = join(ROOT, `${site.id}-${site.slug}`);
  const exists = existsSync(dir);
  if (exists && !FORCE) continue;
  if (!exists) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), appHtml(site, tpl.body), "utf8");
  writeFileSync(join(dir, "style.css"), [accentCss(site), tpl.style || ""].join("\n"), "utf8");
  writeFileSync(join(dir, "script.js"), `${toastHelper()}\n${tpl.script(site)}`, "utf8");
  if (exists) updated++;
  else {
    created++;
    if (created % 50 === 0) console.log("Created:", site.id);
  }
}

console.log(`Batch3 done. Created ${created}, updated ${updated}${FORCE ? " (force)" : ""}.`);
