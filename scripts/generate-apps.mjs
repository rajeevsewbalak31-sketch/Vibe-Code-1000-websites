import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { APP_LOGIC_SET } from "./lib/apps-catalog.mjs";
import { APP_TEMPLATES } from "./lib/apps-templates.mjs";
import { appHtml, accentCss, toastHelper } from "./lib/app-shell.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FORCE = process.argv.includes("--force");
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));

let created = 0;
let updated = 0;

for (const site of sites) {
  if (!APP_LOGIC_SET.has(site.logic)) continue;

  const tpl = APP_TEMPLATES[site.logic];
  if (!tpl) {
    console.error("No app template:", site.logic, site.id);
    process.exit(1);
  }

  const dir = join(ROOT, `${site.id}-${site.slug}`);
  const exists = existsSync(dir);
  if (exists && !FORCE) {
    console.log("Skip (exists):", dir);
    continue;
  }
  if (!exists) mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, "index.html"), appHtml(site, tpl.body), "utf8");
  writeFileSync(join(dir, "style.css"), [accentCss(site), tpl.style || ""].filter(Boolean).join("\n"), "utf8");
  writeFileSync(join(dir, "script.js"), `${toastHelper()}\n${tpl.script(site)}`, "utf8");

  if (exists) {
    updated++;
    console.log("Updated:", site.id, site.slug);
  } else {
    created++;
    console.log("Created:", site.id, site.slug);
  }
}

console.log(`Apps done. Created ${created}, updated ${updated}${FORCE ? " (force)" : ""}.`);
