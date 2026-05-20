/** Vercel Web Analytics snippets for hub + generated static sites. */

export const VERCEL_ANALYTICS_START = "<!-- VERCEL_ANALYTICS_START -->";
export const VERCEL_ANALYTICS_END = "<!-- VERCEL_ANALYTICS_END -->";

/** Script tags only (for hub sync between markers). */
export function vercelAnalyticsScripts() {
  return `  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script defer src="/_shared/vercel-outbound.js"></script>`;
}

/** Full block for generated site <head> (includes markers). */
export function vercelAnalyticsHead() {
  return `  ${VERCEL_ANALYTICS_START}
${vercelAnalyticsScripts()}
  ${VERCEL_ANALYTICS_END}`;
}

export function injectVercelAnalytics(html) {
  const block = vercelAnalyticsHead();
  if (html.includes(VERCEL_ANALYTICS_START)) {
    const re = new RegExp(
      `${VERCEL_ANALYTICS_START}[\\s\\S]*?${VERCEL_ANALYTICS_END}`
    );
    return html.replace(re, block.trim());
  }
  if (html.includes("/_vercel/insights/script.js")) return html;
  return html.replace("</head>", `${block}\n</head>`);
}
