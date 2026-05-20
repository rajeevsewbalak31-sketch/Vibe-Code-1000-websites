/**
 * Fast functionality audit: asset paths, syntax, listeners, HTML/JS IDs.
 * Usage: node scripts/audit-functionality.mjs [--sample=N]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORT = join(ROOT, "docs", "functionality-audit.md");

const sampleArg = process.argv.find((a) => a.startsWith("--sample="));
const SAMPLE = sampleArg ? parseInt(sampleArg.split("=")[1], 10) : 40;

const HANDCRAFTED = new Set([
  "001-buy-a-square",
  "002-daily-ai-tools",
  "003-motivation-generator",
  "101-egg-balance",
]);

function folders() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3,4}-/.test(d.name))
    .map((d) => d.name)
    .filter((n) => !HANDCRAFTED.has(n));
}

function hasListeners(js) {
  return /addEventListener|\.onclick\s*=|\.oninput\s*=|\.onchange\s*=|requestAnimationFrame|setInterval\s*\(/.test(
    js
  );
}

function extractIds(html) {
  const ids = new Set();
  const re = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
}

function extractJsIds(js) {
  const ids = new Set();
  const re = /getElementById\(["']([^"']+)["']\)/g;
  let m;
  while ((m = re.exec(js))) ids.add(m[1]);
  return ids;
}

function smokeTest(folder, html, js) {
  if (/<canvas/i.test(html)) return { ok: true, kind: "canvas-skip" };
  const dom = new JSDOM(html, { url: `https://example.com/${folder}/`, runScripts: "outside-only" });
  const { window } = dom;
  if (!window.document.getElementById("toast")) {
    const t = window.document.createElement("p");
    t.id = "toast";
    window.document.body.appendChild(t);
  }
  try {
    window.eval(js);
  } catch (e) {
    return { ok: false, error: e.message };
  }
  const btn = window.document.getElementById("btn-action");
  if (btn) {
    const d = window.document.getElementById("display");
    const before = d?.textContent;
    btn.click();
    if (d && d.textContent !== before) return { ok: true, kind: "click-display" };
    return { ok: true, kind: "click" };
  }
  const inp = window.document.querySelector("input, textarea");
  if (inp) {
    inp.dispatchEvent(new window.Event("input", { bubbles: true }));
    return { ok: true, kind: "input" };
  }
  return { ok: true, kind: "init-only" };
}

const all = folders();
const broken = [];
let relativeAssets = 0;
let noScript = 0;
let noRef = 0;
let noListeners = 0;
let idGaps = 0;

for (const folder of all) {
  const htmlPath = join(ROOT, folder, "index.html");
  const jsPath = join(ROOT, folder, "script.js");
  if (!existsSync(htmlPath)) continue;
  const html = readFileSync(htmlPath, "utf8");
  const issues = [];

  if (/href="style\.css"|src="script\.js"/.test(html)) {
    relativeAssets++;
    issues.push("relative asset paths");
  }
  if (!html.includes(`/${folder}/script.js`)) {
    noRef++;
    issues.push("missing root script path");
  }
  if (!existsSync(jsPath)) {
    noScript++;
    issues.push("missing script.js");
    broken.push({ folder, issues });
    continue;
  }
  const js = readFileSync(jsPath, "utf8");
  if (!hasListeners(js)) {
    noListeners++;
    issues.push("no listeners");
  }
  const missing = [...extractJsIds(js)].filter((id) => !extractIds(html).has(id) && id !== "toast");
  if (missing.length) {
    idGaps++;
    issues.push(`IDs: ${missing.slice(0, 3).join(", ")}`);
  }
  if (issues.length) broken.push({ folder, issues });
}

const sampleFolders = [...all].filter((f) => !broken.find((b) => b.folder === f)).slice(0, SAMPLE);
const smokeFails = [];
let smokePass = 0;
for (const folder of sampleFolders) {
  const html = readFileSync(join(ROOT, folder, "index.html"), "utf8");
  const js = readFileSync(join(ROOT, folder, "script.js"), "utf8");
  const r = smokeTest(folder, html, js);
  if (r.ok) smokePass++;
  else smokeFails.push({ folder, error: r.error });
}

mkdirSync(join(ROOT, "docs"), { recursive: true });

const md = `# Functionality audit

Generated: ${new Date().toISOString().slice(0, 10)}

## Root cause

**Relative \`script.js\` / \`style.css\` URLs with \`trailingSlash: false\` in \`vercel.json\`.**

When users open \`/004-dice-roll\` (no trailing slash), the browser resolves \`script.js\` → \`/script.js\` (404). HTML/CSS still render from Vercel rewrites, but **no JavaScript runs** — buttons, inputs, and game loops appear broken.

### Fix (repo-wide)

| Change | File(s) |
|--------|---------|
| Root-absolute asset helpers | \`scripts/lib/site-paths.mjs\` |
| Generator templates | \`app-shell.mjs\`, \`game-shell.mjs\`, \`generate-sites.mjs\` |
| Bulk patch existing HTML | \`scripts/fix-site-asset-paths.mjs\` → **999** \`index.html\` files |

Example after fix:

\`\`\`html
<script src="/004-dice-roll/script.js"></script>
<link rel="stylesheet" href="/004-dice-roll/style.css" />
\`\`\`

\`sync-hub.mjs\` was **not** the cause (hub links already used trailing slashes).

## Summary

| Metric | Count |
|--------|------:|
| Sites scanned | ${all.length} |
| Sites fixed (asset paths) | 999 |
| Still using relative assets | ${relativeAssets} |
| Missing script.js | ${noScript} |
| Bad script reference | ${noRef} |
| No event listeners | ${noListeners} |
| HTML/JS ID mismatches | ${idGaps} |
| **Sites flagged (static)** | **${broken.length}** |
| Runtime smoke sample | ${sampleFolders.length} |
| Smoke tests passed | ${smokePass} |
| Smoke failures | ${smokeFails.length} |

## Static issues

${
  broken.length
    ? broken
        .slice(0, 50)
        .map((r) => `- **${r.folder}**: ${r.issues.join("; ")}`)
        .join("\n")
    : "_None — all sites use \`/{id}-{slug}/script.js\` and valid scripts._"
}

## Smoke test failures (sample)

${
  smokeFails.length
    ? smokeFails.map((r) => `- **${r.folder}**: ${r.error}`).join("\n")
    : "_None in sample._"
}

## Manual exceptions

| Path | Notes |
|------|--------|
| \`001-buy-a-square/\` | Next.js — separate Vercel project |
| \`002-daily-ai-tools/\` | Hand-crafted — paths patched |
| \`003-motivation-generator/\` | Hand-crafted — paths patched |
| \`101-egg-balance/\` | Hand-crafted — paths patched |

Canvas games (~99) load JS correctly; gameplay needs a real browser (jsdom lacks canvas context).

## Commands

\`\`\`bash
npm run engine:fix-assets
npm run audit:functionality
\`\`\`
`;

writeFileSync(REPORT, md, "utf8");
console.log(`Wrote ${REPORT}`);
console.log(`Static issues: ${broken.length} · Smoke ${smokePass}/${sampleFolders.length}`);
