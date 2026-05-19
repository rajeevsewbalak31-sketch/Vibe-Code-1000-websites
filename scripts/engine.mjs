#!/usr/bin/env node
/**
 * Site generation engine — Phase 2+
 *
 *   node scripts/engine.mjs expand [--from=23] [--to=100]
 *   node scripts/engine.mjs build   [--from=23] [--to=100]
 *   node scripts/engine.mjs hub
 *   node scripts/engine.mjs all     [--from=23] [--to=100]
 *   node scripts/engine.mjs status
 */
import { spawnSync } from "child_process";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function parseArg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : String(fallback);
}

function run(script, extra = []) {
  const from = parseArg("from", 23);
  const to = parseArg("to", 100);
  const args = [`node`, join(__dirname, script), `--from=${from}`, `--to=${to}`, ...extra];
  const r = spawnSync(args[0], args.slice(1), { cwd: ROOT, stdio: "inherit", shell: false });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function countSites() {
  const dirs = readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
    .map((d) => d.name);
  const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));
  const featured = manifest.featured?.length ?? 0;
  return { folders: dirs.length, featured, total: dirs.length };
}

const cmd = process.argv[2] || "status";

switch (cmd) {
  case "expand":
    run("expand-catalog.mjs");
    break;
  case "build":
    run("expand-catalog.mjs");
    spawnSync("node", [join(__dirname, "generate-sites.mjs")], { cwd: ROOT, stdio: "inherit" });
    break;
  case "hub":
    spawnSync("node", [join(__dirname, "sync-hub.mjs")], { cwd: ROOT, stdio: "inherit" });
    spawnSync("node", [join(__dirname, "generate-sitemap.mjs")], { cwd: ROOT, stdio: "inherit" });
    break;
  case "all":
    run("expand-catalog.mjs");
    spawnSync("node", [join(__dirname, "generate-sites.mjs")], { cwd: ROOT, stdio: "inherit" });
    spawnSync("node", [join(__dirname, "sync-hub.mjs")], { cwd: ROOT, stdio: "inherit" });
    spawnSync("node", [join(__dirname, "generate-sitemap.mjs")], { cwd: ROOT, stdio: "inherit" });
    break;
  case "status": {
    const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));
    const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));
    const { folders } = countSites();
    console.log("── Site engine status ──");
    console.log(`Goal:        ${manifest.goal}`);
    console.log(`Phase 2:     ${manifest.phase2Target} sites`);
    console.log(`In sites.json: ${sites.length} (auto-gen registry)`);
    console.log(`On disk:     ${folders} numbered folders`);
    console.log(`Featured:    ${manifest.featured?.length ?? 0} (001, 002 — custom deploys)`);
    console.log("");
    console.log("Next: node scripts/engine.mjs all --from=23 --to=100");
    break;
  }
  default:
    console.error(`Unknown command: ${cmd}`);
    console.error("Use: expand | build | hub | all | status");
    process.exit(1);
}
