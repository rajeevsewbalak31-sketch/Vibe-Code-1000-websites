/**
 * Verify production URLs + monetization links. Run: node scripts/verify-live.mjs
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HUB = "https://websites-eosin-delta.vercel.app";
const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));

const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
  .map((d) => d.name)
  .sort();

const EXTERNAL = {
  "001-buy-a-square": "https://001-buy-a-square.vercel.app",
  "002-random-quote": "https://quotely.vercel.app",
};

async function check(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeout ?? 15000);
  try {
    const res = await fetch(url, {
      method: opts.method ?? "GET",
      signal: ctrl.signal,
      redirect: opts.follow === false ? "manual" : "follow",
    });
    clearTimeout(t);
    const ok = opts.accept?.includes(res.status) ?? (res.status >= 200 && res.status < 400);
    return { ok, status: res.status, url };
  } catch (e) {
    clearTimeout(t);
    return { ok: false, status: 0, url, error: e.message };
  }
}

const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
}
function fail(msg) {
  failures.push(msg);
}

console.log("── Live verification ──\n");

// Hub
for (const path of ["/", "/sitemap.xml", "/robots.txt"]) {
  const r = await check(`${HUB}${path}`);
  if (r.ok) pass(`${r.status} ${path}`);
  else fail(`${path} → ${r.status} ${r.error || ""}`);
}

const hubHtml = await (await fetch(`${HUB}/`)).text();
for (const id of ["get-a-site", "contact", "support", "sponsors", "site-grid"]) {
  if (hubHtml.includes(`id="${id}"`)) pass(`hub anchor #${id}`);
  else fail(`hub missing id="${id}"`);
}

// All static sites on hub host (skip 001 Next.js, 002 if external only)
for (const folder of folders) {
  if (folder === "001-buy-a-square") continue;
  const path = `/${folder}`;
  const r = await check(`${HUB}${path}`);
  if (r.ok) pass(`${r.status} ${path}`);
  else fail(`${path} → ${r.status} ${r.error || ""}`);
}

// External featured
for (const [folder, url] of Object.entries(EXTERNAL)) {
  const r = await check(url);
  if (r.ok) pass(`${r.status} ${folder} (${url})`);
  else {
    // Fallback: local folder on hub
    const local = `${HUB}/${folder}`;
    const r2 = await check(local);
    if (r2.ok) fail(`${folder}: external ${url} failed but local ${local} OK — update manifest`);
    else fail(`${folder}: external ${url} AND local ${local} failed`);
  }
}

// PayPal (expect redirect or 200)
for (const url of [
  "https://paypal.me/RajeevSewbalak",
  "https://paypal.me/RajeevSewbalak/49",
  "https://paypal.me/RajeevSewbalak/5",
]) {
  const r = await check(url, { follow: false, accept: [200, 301, 302, 303] });
  if (r.ok) pass(`PayPal ${url.split("/").pop() || "root"} → ${r.status}`);
  else fail(`PayPal ${url} → ${r.status}`);
}

// Sample site assets
const sample = ["003-coin-flip", "050-pulsebox", "100-bolthub"];
for (const f of sample) {
  for (const file of ["style.css", "script.js"]) {
    const r = await check(`${HUB}/${f}/${file}`);
    if (r.ok) pass(`${r.status} /${f}/${file}`);
    else fail(`/${f}/${file} → ${r.status}`);
  }
}

console.log(`\nPassed: ${passes.length}`);
if (failures.length) {
  console.error(`Failed: ${failures.length}`);
  failures.forEach((f) => console.error("  ✗", f));
  process.exit(1);
}
console.log("\nAll live checks passed.");
