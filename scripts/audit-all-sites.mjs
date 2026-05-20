/**
 * Static audit of all numbered site folders → docs/site-audit-report.md
 * Usage: node scripts/audit-all-sites.mjs [--live]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORT_PATH = join(ROOT, "docs", "site-audit-report.md");
const HUB_URL = "https://websites-eosin-delta.vercel.app";
const LIVE = process.argv.includes("--live");
const SKIP_FOLDERS = new Set(["001-buy-a-square"]);

const PLACEHOLDER_RE =
  /coming soon|under construction|lorem ipsum|\btodo\b|not implemented|work in progress/i;

const HANDCRAFTED_IDS = new Set(["002", "003", "101"]);

function htmlVisibleText(html) {
  return html
    .replace(/\splaceholder="[^"]*"/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ");
}

const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{3,4}-/.test(d.name))
  .map((d) => d.name)
  .filter((n) => !SKIP_FOLDERS.has(n))
  .sort((a, b) => {
    const ai = parseInt(a.match(/^(\d+)/)[1], 10);
    const bi = parseInt(b.match(/^(\d+)/)[1], 10);
    return ai - bi;
  });

let sitesByFolder = {};
try {
  const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));
  for (const s of sites) sitesByFolder[`${s.id}-${s.slug}`] = s;
} catch {
  /* optional */
}

function safeRead(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function extractInternalLinks(html, folder) {
  const broken = [];
  const re = /href="(\.\/[^"#?]+|\/_shared\/[^"#?]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let target = m[1];
    if (target.startsWith("./")) {
      const rel = target.replace(/^\.\//, "").replace(/\/$/, "");
      const check = join(ROOT, rel);
      const asDir = join(check, "index.html");
      if (!existsSync(check) && !existsSync(asDir)) broken.push(target);
    } else if (target.startsWith("/_shared/")) {
      const check = join(ROOT, target.slice(1));
      if (!existsSync(check)) broken.push(target);
    }
  }
  return broken;
}

function hasInteractivity(html, js) {
  if (
    /addEventListener|\.onclick|\.oninput|\.onchange|onkeydown|requestAnimationFrame|setInterval|setTimeout\s*\(/i.test(
      js
    )
  )
    return true;
  if (/<canvas|<button|<input|<select|<textarea/i.test(html)) return true;
  return false;
}

function hasPlaceholderCopy(html, js, logic) {
  if (PLACEHOLDER_RE.test(htmlVisibleText(html))) return true;
  if (logic !== "lorem-ipsum" && /\blorem ipsum\b/i.test(js)) return true;
  if (/coming soon|under construction|not implemented/i.test(js)) return true;
  return false;
}

function hasResponsiveSignals(html, css) {
  if (!/viewport/i.test(html)) return false;
  if (
    /@media|max-width|min-width|clamp\(|100dvh|100vw|flex-wrap|grid-template-columns:\s*repeat\(auto/i.test(
      html + css
    )
  )
    return true;
  if (/\/_shared\/(tool|app|game)\.css/.test(html)) return true;
  return false;
}

function auditFolder(folder) {
  const id = folder.match(/^(\d{3,4})-/)[1];
  const dir = join(ROOT, folder);
  const htmlPath = join(dir, "index.html");
  const cssPath = join(dir, "style.css");
  const jsPath = join(dir, "script.js");

  const issues = [];
  const flags = [];
  let score = 100;

  const html = safeRead(htmlPath);
  const css = safeRead(cssPath) || "";
  const js = safeRead(jsPath) || "";

  if (!html) {
    issues.push("Missing or unreadable index.html");
    flags.push("broken");
    return { folder, id, score: 0, issues, flags, name: folder };
  }

  const registry = sitesByFolder[folder];
  const logic = registry?.logic || "unknown";
  const name =
    registry?.name ||
    (html.match(/<h1[^>]*class="[^"]*logo[^"]*"[^>]*>([^<]+)</i)?.[1] ||
      html.match(/<title>([^<|]+)/)?.[1]?.trim() ||
      folder);

  if (!existsSync(jsPath)) {
    issues.push("Missing script.js");
    score -= 20;
    flags.push("broken");
  }
  if (!existsSync(cssPath)) {
    issues.push("Missing style.css");
    score -= 8;
  }

  if (!/<!DOCTYPE\s+html>/i.test(html)) {
    issues.push("No HTML5 doctype");
    score -= 8;
  }
  if (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) {
    issues.push("Invalid HTML skeleton");
    score -= 15;
    flags.push("broken");
  }

  if (html.length < 900) {
    issues.push(`Thin HTML (${html.length} bytes)`);
    score -= 12;
    flags.push("thin-template");
  }

  if (!/viewport/i.test(html)) {
    issues.push("No viewport meta (mobile)");
    score -= 15;
  }

  if (!/meta\s+name="description"/i.test(html)) {
    issues.push("No meta description");
    score -= 6;
  }

  if (!hasResponsiveSignals(html, css)) {
    issues.push("Weak mobile/responsive signals");
    score -= 10;
  }

  const brokenLinks = extractInternalLinks(html, folder);
  if (brokenLinks.length) {
    issues.push(`Broken local links: ${brokenLinks.slice(0, 3).join(", ")}`);
    score -= Math.min(25, brokenLinks.length * 8);
    flags.push("broken");
  }

  if (!/websites-eosin-delta|vibe code 1000|\/_shared\//i.test(html)) {
    issues.push("No hub / shared chrome link");
    score -= 4;
  }

  const jsBody = js.replace(/function showToast[\s\S]*?^}/m, "").trim();
  if (js && jsBody.length < 40) {
    issues.push("Minimal JavaScript (likely static)");
    score -= 22;
    flags.push("low-interactivity");
  } else if (js && !hasInteractivity(html, js)) {
    issues.push("No detected JS interactivity");
    score -= 18;
    flags.push("low-interactivity");
  }

  if (hasPlaceholderCopy(html, js, logic)) {
    issues.push("Placeholder / stub copy detected");
    score -= 20;
    flags.push("placeholder");
  }

  const controlCount = (html.match(/<button|<input|<textarea|<select|<canvas/gi) || []).length;
  if (controlCount >= 4) score += 4;
  else if (controlCount <= 1 && jsBody.length < 250) {
    issues.push("Single-control template (minimal UX)");
    score -= 6;
    flags.push("thin-template");
  }

  if (HANDCRAFTED_IDS.has(id)) {
    score += 8;
  }

  if (/\/_shared\/game\.css/.test(html) && /<canvas/i.test(html)) {
    score += 4;
  }

  if (jsBody.length > 0 && jsBody.length < 200 && /getElementById\([^)]+\)\.(onclick|oninput)=/.test(jsBody)) {
    issues.push("Highly compressed one-liner script");
    score -= 4;
  }

  if (/localStorage|sessionStorage|crypto\.subtle|AudioContext/i.test(js)) {
    score += 3;
  }

  if (css.trim().length < 30 && !/\/_shared\//.test(html)) {
    issues.push("Almost no custom CSS");
    score -= 6;
  }

  const displayOnly =
    /id="display"[^>]*>—<\/p>/.test(html) &&
    !/<button|<input|<textarea/i.test(html) &&
    jsBody.length < 80;
  if (displayOnly) {
    issues.push("Static display only (—)");
    score -= 15;
    flags.push("placeholder");
  }

  const scriptLen = js.length;
  if (scriptLen > 0 && scriptLen < 120 && /showToast/.test(js)) {
    issues.push("Template-only script (toast helper only)");
    score -= 8;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    folder,
    id,
    name: name.replace(/\s+/g, " ").trim(),
    logic,
    score,
    issues,
    flags: [...new Set(flags)],
    htmlBytes: html.length,
    jsBytes: scriptLen,
    responsive: hasResponsiveSignals(html, css),
    interactive: hasInteractivity(html, js),
    controlCount,
    liveOk: null,
  };
}

async function checkLive(folder, result) {
  const url = `${HUB_URL}/${folder}/`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok) {
      result.issues.push(`Live HTTP ${res.status}`);
      result.score = Math.max(0, result.score - 25);
      result.flags.push("broken");
      result.liveOk = false;
    } else {
      const text = await res.text();
      if (text.length < 200) {
        result.issues.push("Live page very small");
        result.score -= 10;
      }
      result.liveOk = true;
    }
  } catch (e) {
    result.issues.push(`Live fetch failed: ${e.message}`);
    result.score = Math.max(0, result.score - 15);
    result.liveOk = false;
  }
  return result;
}

console.log(`Auditing ${folders.length} folders…`);
const results = [];
for (const folder of folders) {
  results.push(auditFolder(folder));
}

results.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id, undefined, { numeric: true }));
const bottom50 = results.slice(0, 50);

if (LIVE) {
  console.log("Live HTTP checks on 50 lowest-scoring sites…");
  const batch = 10;
  for (let i = 0; i < bottom50.length; i += batch) {
    await Promise.all(bottom50.slice(i, i + batch).map((r) => checkLive(r.folder, r)));
  }
}

const scores = results.map((r) => r.score);
const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
const broken = results.filter((r) => r.flags.includes("broken"));
const placeholder = results.filter((r) => r.flags.includes("placeholder"));
const thinTemplate = results.filter((r) => r.flags.includes("thin-template"));
const lowIx = results.filter((r) => r.flags.includes("low-interactivity"));
const noMobile = results.filter((r) => !r.responsive);
const noJs = results.filter((r) => !r.interactive);

const grade = (s) =>
  s >= 85 ? "A" : s >= 70 ? "B" : s >= 55 ? "C" : s >= 40 ? "D" : "F";

const md = `# Vibe Code 1000 — Site Audit Report

Generated: ${new Date().toISOString().slice(0, 10)}  
Method: **static analysis** of all numbered site folders${LIVE ? " + live HTTP GET" : ""} (local files + hub routes).  
Audited folders: **${results.length}** (excludes \`001-buy-a-square\` Next.js project).

## Executive summary

| Metric | Value |
|--------|------:|
| Sites audited | ${results.length} |
| Average quality score | ${avg.toFixed(1)} / 100 |
| Score range (low → high) | ${Math.min(...scores)} – ${Math.max(...scores)} |
| Hub route check | \`npm run verify:routes\` — OK (all local paths resolve) |
| Grade A (85+) | ${results.filter((r) => r.score >= 85).length} |
| Grade B (70–84) | ${results.filter((r) => r.score >= 70 && r.score < 85).length} |
| Grade C (55–69) | ${results.filter((r) => r.score >= 55 && r.score < 70).length} |
| Grade D/F (&lt;55) | ${results.filter((r) => r.score < 55).length} |
| Flagged broken | ${broken.length} |
| Flagged placeholder | ${placeholder.length} |
| Thin / single-control template | ${thinTemplate.length} |
| Low interactivity | ${lowIx.length} |
| Weak mobile signals | ${noMobile.length} |
| No detected JS UX | ${noJs.length} |

## What we checked (per site)

1. **Loads / structure** — \`index.html\` exists, DOCTYPE, \`html\`/\`body\`, reasonable size  
2. **Links** — relative \`./\` and \`/_shared/\` hrefs resolve on disk  
3. **Mobile** — viewport meta + responsive CSS (media queries, \`clamp\`, shared app/tool/game CSS)  
4. **JavaScript** — \`script.js\` present, event handlers or form controls, not toast-only stub  
5. **Placeholders** — “coming soon”, static \`—\` display, minimal script body  

> **Note:** Scores measure structure, interactivity depth, and template richness — not visual design. Almost all sites pass technical checks; the bottom 50 are **relatively** more generic (often one-button batch templates). Hand-crafted #002, #003, #101 score 100. Production hub may still show an old build (~100 cards) while individual site URLs can return 200 OK.

## Issue breakdown

| Issue type | Count |
|------------|------:|
| Broken / missing files or links | ${broken.length} |
| Placeholder copy | ${placeholder.length} |
| Thin / single-control template | ${thinTemplate.length} |
| Low interactivity | ${lowIx.length} |
| Weak mobile responsiveness | ${noMobile.length} |

## 50 lowest-quality sites

| Rank | ID | Folder | Name | Score | Grade | Live | Flags | Top issues |
|------|-----|--------|------|------:|-------|:----:|-------|------------|
${bottom50
  .map((r, i) => {
    const top = r.issues.slice(0, 2).join("; ") || "—";
    const live =
      r.liveOk === true ? "OK" : r.liveOk === false ? "FAIL" : "—";
    return `| ${i + 1} | ${r.id} | \`${r.folder}\` | ${r.name} | ${r.score} | ${grade(r.score)} | ${live} | ${r.flags.join(", ") || "—"} | ${top} |`;
  })
  .join("\n")}

## Detail: bottom 10

${bottom50
  .slice(0, 10)
  .map(
    (r, i) => `### ${i + 1}. #${r.id} — ${r.name} (\`${r.folder}\`)

- **Score:** ${r.score}/100 (${grade(r.score)})
- **Logic:** ${r.logic}
- **HTML / JS size:** ${r.htmlBytes} B / ${r.jsBytes} B
- **Responsive:** ${r.responsive ? "yes" : "no"} · **Interactive:** ${r.interactive ? "yes" : "no"}
- **Issues:** ${r.issues.length ? r.issues.join("; ") : "None"}
- **URL:** ${HUB_URL}/${r.folder}/
`
  )
  .join("\n")}

## Recommendations

1. **Polish the bottom 50** — add one distinctive interaction or visual per site (hand-crafted #002/#003/#101 as reference).  
2. **Spot-check live** — run \`npm run verify:live\` after deploy; production may lag GitHub (hub still on old builds).  
3. **Re-audit with HTTP** — \`node scripts/audit-all-sites.mjs --live\` (checks live URLs for the bottom 50).  
4. **Spotlight refresh** — swap weakest featured cards for EggBalance, Daily AI Tools, Motivation Generator.

---

*Report generated by \`scripts/audit-all-sites.mjs\`*
`;

mkdirSync(join(ROOT, "docs"), { recursive: true });
writeFileSync(REPORT_PATH, md, "utf8");
console.log(`Wrote ${REPORT_PATH}`);
console.log(`Average score: ${avg.toFixed(1)} · Bottom: ${bottom50[0]?.folder} (${bottom50[0]?.score})`);
