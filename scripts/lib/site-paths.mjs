/** Root-absolute paths for mini-site assets (works with trailingSlash: false). */

export function siteBase(id, slug) {
  return `/${id}-${slug}`;
}

export function siteStyleHref(id, slug) {
  return `${siteBase(id, slug)}/style.css`;
}

export function siteScriptSrc(id, slug) {
  return `${siteBase(id, slug)}/script.js`;
}
