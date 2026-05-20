import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GAME_LOGIC_SET } from "./lib/games-catalog.mjs";
import { GAME_TEMPLATES } from "./lib/games-templates.mjs";
import { gameHtml, accentCss, toastHelper } from "./lib/game-shell.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FORCE = process.argv.includes("--force");
const SKIP_HANDCRAFTED = new Set(["egg-balance"]);
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));

let created = 0;
let updated = 0;
let skipped = 0;

for (const site of sites) {
  if (!GAME_LOGIC_SET.has(site.logic)) continue;

  const dir = join(ROOT, `${site.id}-${site.slug}`);
  if (SKIP_HANDCRAFTED.has(site.logic)) {
    if (existsSync(dir)) {
      console.log("Skip handcrafted:", dir);
      skipped++;
      continue;
    }
    console.error("Missing handcrafted game folder:", dir);
    process.exit(1);
  }

  const tpl = GAME_TEMPLATES[site.logic];
  if (!tpl) {
    console.error("No template for logic:", site.logic, site.id);
    process.exit(1);
  }

  const exists = existsSync(dir);
  if (exists && !FORCE && !SKIP_HANDCRAFTED.has(site.logic)) {
    console.log("Skip (exists):", dir);
    continue;
  }

  if (!exists) mkdirSync(dir, { recursive: true });

  const script = `${toastHelper()}\n${tpl.script(site)}`;
  const style = [accentCss(site), tpl.style || ""].filter(Boolean).join("\n");

  writeFileSync(join(dir, "index.html"), gameHtml(site, tpl.body), "utf8");
  writeFileSync(join(dir, "style.css"), style, "utf8");
  writeFileSync(join(dir, "script.js"), script, "utf8");

  if (exists) {
    updated++;
    console.log("Updated:", site.id, site.slug, site.logic);
  } else {
    created++;
    console.log("Created:", site.id, site.slug, site.logic);
  }
}

console.log(`Games done. Created ${created}, updated ${updated}, skipped handcrafted ${skipped}${FORCE ? " (force)" : ""}.`);
