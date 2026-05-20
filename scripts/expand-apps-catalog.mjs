/**
 * Add interactive apps #201–300 to sites.json
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildAppsRange } from "./lib/apps-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITES_PATH = join(__dirname, "sites.json");

function parseArg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? parseInt(hit.split("=")[1], 10) : fallback;
}

const from = parseArg("from", 201);
const to = parseArg("to", 300);

const existing = JSON.parse(readFileSync(SITES_PATH, "utf8"));
let added = 0;
let updated = 0;

for (const entry of buildAppsRange(from, to)) {
  const idx = existing.findIndex((s) => s.id === entry.id);
  if (idx >= 0) {
    existing[idx] = entry;
    updated++;
  } else {
    existing.push(entry);
    added++;
  }
}

existing.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(SITES_PATH, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`sites.json: ${existing.length} entries (+${added} new, ${updated} updated, apps ${String(from).padStart(3, "0")}–${String(to).padStart(3, "0")})`);
