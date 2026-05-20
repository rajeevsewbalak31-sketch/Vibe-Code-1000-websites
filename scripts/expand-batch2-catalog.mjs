import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildBatch2Range } from "./lib/batch2-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITES_PATH = join(__dirname, "sites.json");

function parseArg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? parseInt(hit.split("=")[1], 10) : fallback;
}

const from = parseArg("from", 301);
const to = parseArg("to", 500);

const existing = JSON.parse(readFileSync(SITES_PATH, "utf8"));
let added = 0;
let updated = 0;

for (const entry of buildBatch2Range(from, to)) {
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
console.log(`sites.json: ${existing.length} entries (+${added} new, ${updated} updated, batch2 ${String(from).padStart(3, "0")}–${String(to).padStart(3, "0")})`);
