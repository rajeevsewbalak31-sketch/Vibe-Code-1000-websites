/**
 * Merge auto-generated catalog entries (023+) into sites.json.
 * Usage: node scripts/expand-catalog.mjs [--from=23] [--to=100]
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildCatalogRange } from "./lib/catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITES_PATH = join(__dirname, "sites.json");

function parseArg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? parseInt(hit.split("=")[1], 10) : fallback;
}

const from = parseArg("from", 23);
const to = parseArg("to", 100);

const existing = JSON.parse(readFileSync(SITES_PATH, "utf8"));
const ids = new Set(existing.map((s) => s.id));
const incoming = buildCatalogRange(from, to);
let added = 0;

for (const entry of incoming) {
  if (ids.has(entry.id)) continue;
  existing.push(entry);
  ids.add(entry.id);
  added++;
}

existing.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(SITES_PATH, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`sites.json: ${existing.length} entries (+${added} new, range ${String(from).padStart(3, "0")}–${String(to).padStart(3, "0")})`);
