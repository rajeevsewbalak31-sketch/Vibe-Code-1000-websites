import { readdirSync, existsSync } from "fs";
import { join } from "path";

/** @param {string} root */
export function formatSiteId(n) {
  if (n >= 1000) return "1000";
  return String(n).padStart(3, "0");
}

/** Occupied site numbers from `NNN-slug` / `NNNN-slug` folders. */
export function scanOccupiedIds(root) {
  const occupied = new Set();
  for (const name of readdirSync(root, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const m = name.name.match(/^(\d{3,4})-/);
    if (m) occupied.add(parseInt(m[1], 10));
  }
  return occupied;
}

/** Folder path exists for any slug at this id. */
export function folderExistsForId(root, idNum) {
  const prefix = `${formatSiteId(idNum)}-`;
  return readdirSync(root, { withFileTypes: true }).some(
    (d) => d.isDirectory() && d.name.startsWith(prefix)
  );
}

/** @returns {number[]} Missing ids in [min, max] */
export function getPendingIds(root, min = 1, max = 1000) {
  const occupied = scanOccupiedIds(root);
  const pending = [];
  for (let n = min; n <= max; n++) {
    if (!occupied.has(n)) pending.push(n);
  }
  return pending;
}

export function highestOccupiedId(root) {
  const ids = [...scanOccupiedIds(root)];
  return ids.length ? Math.max(...ids) : 0;
}
