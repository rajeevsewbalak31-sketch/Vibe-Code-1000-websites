/**
 * Sequential Vibe Code 1000 generator — never overwrites existing numbered folders.
 *
 * Usage:
 *   node scripts/run-sequential-auto.mjs              # fill gaps 001–1000, commit every 10
 *   node scripts/run-sequential-auto.mjs --status     # scan only
 *   node scripts/run-sequential-auto.mjs --max=50     # stop after 50 creations
 *   node scripts/run-sequential-auto.mjs --no-push    # commit batches without push
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  formatSiteId,
  getPendingIds,
  highestOccupiedId,
  scanOccupiedIds,
  folderExistsForId,
} from "./lib/sequential-scan.mjs";
import { buildSiteForId } from "./lib/sequential-meta.mjs";
import { writeSiteIfAbsent } from "./lib/write-site.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITES_PATH = join(__dirname, "sites.json");
const MANIFEST_PATH = join(__dirname, "manifest.json");
const CHECKPOINT_PATH = join(__dirname, ".sequential-checkpoint.json");

const BATCH_SIZE = 10;
const STATUS_ONLY = process.argv.includes("--status");
const NO_PUSH = process.argv.includes("--no-push");
const maxArg = process.argv.find((a) => a.startsWith("--max="));
const maxCreate = maxArg ? parseInt(maxArg.split("=")[1], 10) : Infinity;

let lastCompleted = highestOccupiedId(ROOT);
let createdThisRun = 0;
let batchStart = null;
let batchEnd = null;

function saveCheckpoint(extra = {}) {
  writeFileSync(
    CHECKPOINT_PATH,
    JSON.stringify(
      {
        lastCompleted: formatSiteId(lastCompleted),
        lastCompletedNum: lastCompleted,
        updatedAt: new Date().toISOString(),
        occupied: scanOccupiedIds(ROOT).size,
        ...extra,
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

function printLastCompleted() {
  console.log(`Last completed: ${formatSiteId(lastCompleted)}`);
}

function upsertSitesJson(site) {
  const sites = JSON.parse(readFileSync(SITES_PATH, "utf8"));
  const idx = sites.findIndex((s) => s.id === site.id);
  if (idx >= 0) sites[idx] = site;
  else sites.push(site);
  sites.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  writeFileSync(SITES_PATH, JSON.stringify(sites, null, 2) + "\n", "utf8");
}

function updateManifest(site) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  manifest.generation = {
    ...(manifest.generation || {}),
    lastCompleted: site.id,
    lastFolder: `${site.id}-${site.slug}`,
    lastRun: new Date().toISOString(),
    occupiedSlots: scanOccupiedIds(ROOT).size,
  };
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

function syncHub() {
  execSync("node scripts/sync-hub.mjs", { cwd: ROOT, stdio: "inherit" });
  if (existsSync(join(ROOT, "scripts/generate-sitemap.mjs"))) {
    execSync("node scripts/generate-sitemap.mjs", { cwd: ROOT, stdio: "pipe" });
  }
}

function gitCommitBatch(fromId, toId) {
  const msg = `add websites ${formatSiteId(fromId)}-${formatSiteId(toId)}`;
  execSync("git add .", { cwd: ROOT, stdio: "pipe" });
  try {
    execSync(`git commit -m "${msg}"`, { cwd: ROOT, stdio: "inherit" });
  } catch {
    console.log("Nothing to commit for batch", msg);
    return;
  }
  if (!NO_PUSH) {
    execSync("git push origin main", { cwd: ROOT, stdio: "inherit" });
  }
}

function flushBatch() {
  if (batchStart == null) return;
  gitCommitBatch(batchStart, batchEnd);
  batchStart = null;
  batchEnd = null;
}

function onSignal() {
  saveCheckpoint({ interrupted: true });
  flushBatch();
  printLastCompleted();
  process.exit(130);
}

process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);

const occupied = scanOccupiedIds(ROOT);
const pending = getPendingIds(ROOT, 1, 1000);
const high = highestOccupiedId(ROOT);
const nextSlot = pending[0] ?? (high >= 1000 ? null : high + 1);

console.log("── Sequential auto-generator ──");
console.log(`Occupied slots: ${occupied.size} / 1000`);
console.log(`Highest folder:  ${formatSiteId(high)}`);
console.log(`Next free slot:  ${nextSlot != null ? formatSiteId(nextSlot) : "(none up to 1000)"}`);
console.log(`Pending gaps:    ${pending.length}`);

if (STATUS_ONLY) {
  printLastCompleted();
  process.exit(0);
}

if (pending.length === 0) {
  lastCompleted = high;
  saveCheckpoint({ complete: true });
  console.log("\nAll slots 001–1000 already have folders. Nothing to create.");
  printLastCompleted();
  process.exit(0);
}

for (const idNum of pending) {
  if (createdThisRun >= maxCreate) {
    console.log(`\nStopped at --max=${maxCreate} creations.`);
    break;
  }

  if (folderExistsForId(ROOT, idNum)) {
    console.log(`Skip ${formatSiteId(idNum)} — folder already exists`);
    lastCompleted = idNum;
    continue;
  }

  const site = buildSiteForId(idNum);
  if (!site) {
    console.log(`Skip ${formatSiteId(idNum)} — no generator (reserved slot)`);
    lastCompleted = idNum;
    continue;
  }

  const result = writeSiteIfAbsent(site, ROOT);
  if (result === "skipped" || result === "handcrafted") {
    console.log(`Skip ${formatSiteId(idNum)} — ${result}`);
    lastCompleted = idNum;
    continue;
  }
  if (result === "error") {
    console.error(`Failed ${formatSiteId(idNum)} — missing template for ${site.logic}`);
    saveCheckpoint({ lastError: site.id });
    printLastCompleted();
    process.exit(1);
  }

  upsertSitesJson(site);
  updateManifest(site);
  syncHub();

  lastCompleted = idNum;
  createdThisRun++;
  console.log(`Created #${site.id} → ${site.id}-${site.slug} (${site.name})`);

  if (batchStart == null) batchStart = idNum;
  batchEnd = idNum;

  if (createdThisRun % BATCH_SIZE === 0) {
    flushBatch();
    saveCheckpoint();
  }
}

flushBatch();
saveCheckpoint({ complete: pending.length <= createdThisRun });

console.log(`\nCreated ${createdThisRun} site(s) this run.`);
printLastCompleted();
