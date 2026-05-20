/**
 * Add games #101–200 to sites.json
 * Usage: node scripts/expand-games-catalog.mjs [--from=101] [--to=200]
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildGamesRange } from "./lib/games-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITES_PATH = join(__dirname, "sites.json");

function parseArg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? parseInt(hit.split("=")[1], 10) : fallback;
}

const from = parseArg("from", 101);
const to = parseArg("to", 200);

const existing = JSON.parse(readFileSync(SITES_PATH, "utf8"));
const ids = new Set(existing.map((s) => s.id));
const incoming = buildGamesRange(from, to);
let added = 0;
let updated = 0;

for (const entry of incoming) {
  const idx = existing.findIndex((s) => s.id === entry.id);
  if (idx >= 0) {
    existing[idx] = entry;
    updated++;
  } else {
    existing.push(entry);
    ids.add(entry.id);
    added++;
  }
}

existing.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(SITES_PATH, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`sites.json: ${existing.length} entries (+${added} new, ${updated} updated, games ${String(from).padStart(3, "0")}–${String(to).padStart(3, "0")})`);
