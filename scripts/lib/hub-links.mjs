import { HUB_URL } from "./seo.mjs";

/** Base URL without trailing slash */
export function hubBase() {
  return HUB_URL.replace(/\/$/, "");
}

export function hubLink(hashOrPath = "") {
  const base = hubBase();
  if (!hashOrPath) return `${base}/`;
  if (hashOrPath.startsWith("#")) return `${base}/${hashOrPath}`;
  if (hashOrPath.startsWith("/")) return `${base}${hashOrPath}`;
  return `${base}/${hashOrPath}`;
}
