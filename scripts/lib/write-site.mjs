import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { writeToolSite } from "../generate-sites.mjs";
import { GAME_LOGIC_SET } from "./games-catalog.mjs";
import { GAME_TEMPLATES } from "./games-templates.mjs";
import { gameHtml, accentCss as gameAccent, toastHelper as gameToast } from "./game-shell.mjs";
import { APP_LOGIC_SET } from "./apps-catalog.mjs";
import { APP_TEMPLATES } from "./apps-templates.mjs";
import { appHtml, accentCss as appAccent, toastHelper as appToast } from "./app-shell.mjs";
import { BATCH2_LOGIC_SET } from "./batch2-catalog.mjs";
import { BATCH2_TEMPLATES } from "./batch2-templates.mjs";
import { BATCH3_LOGIC_SET } from "./batch3-catalog.mjs";
import { BATCH3_TEMPLATES } from "./batch3-templates.mjs";
import { HANDCRAFTED_LOGICS } from "./sequential-meta.mjs";
import { folderExistsForId } from "./sequential-scan.mjs";

/**
 * Create site files only if the numbered folder does not exist.
 * @returns {"created"|"skipped"|"handcrafted"|"error"}
 */
export function writeSiteIfAbsent(site, root) {
  if (HANDCRAFTED_LOGICS.has(site.logic)) {
    if (folderExistsForId(root, parseInt(site.id, 10))) return "handcrafted";
    return "error";
  }

  const dir = join(root, `${site.id}-${site.slug}`);
  if (existsSync(dir)) return "skipped";

  if (GAME_LOGIC_SET.has(site.logic)) {
    const tpl = GAME_TEMPLATES[site.logic];
    if (!tpl) return "error";
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), gameHtml(site, tpl.body, tpl.extraHead || ""), "utf8");
    writeFileSync(join(dir, "style.css"), [gameAccent(site), tpl.style || ""].join("\n"), "utf8");
    writeFileSync(join(dir, "script.js"), `${gameToast()}\n${tpl.script(site)}`, "utf8");
    return "created";
  }

  if (APP_LOGIC_SET.has(site.logic)) {
    const tpl = APP_TEMPLATES[site.logic];
    if (!tpl) return "error";
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), appHtml(site, tpl.body), "utf8");
    writeFileSync(join(dir, "style.css"), [appAccent(site), tpl.style || ""].join("\n"), "utf8");
    writeFileSync(join(dir, "script.js"), `${appToast()}\n${tpl.script(site)}`, "utf8");
    return "created";
  }

  if (BATCH2_LOGIC_SET.has(site.logic)) {
    const tpl = BATCH2_TEMPLATES[site.logic];
    if (!tpl) return "error";
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), appHtml(site, tpl.body), "utf8");
    writeFileSync(join(dir, "style.css"), [appAccent(site), tpl.style || ""].join("\n"), "utf8");
    writeFileSync(join(dir, "script.js"), `${appToast()}\n${tpl.script(site)}`, "utf8");
    return "created";
  }

  if (BATCH3_LOGIC_SET.has(site.logic)) {
    const tpl = BATCH3_TEMPLATES[site.logic];
    if (!tpl) return "error";
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), appHtml(site, tpl.body), "utf8");
    writeFileSync(join(dir, "style.css"), [appAccent(site), tpl.style || ""].join("\n"), "utf8");
    writeFileSync(join(dir, "script.js"), `${appToast()}\n${tpl.script(site)}`, "utf8");
    return "created";
  }

  if (writeToolSite(site, root)) return "created";
  return "skipped";
}
