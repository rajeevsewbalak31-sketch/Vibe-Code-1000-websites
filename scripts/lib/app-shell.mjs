import { siteHeadMeta, siteTitle } from "./seo.mjs";
import { siteMonetizationFooter } from "./monetization.mjs";
import { hubLink } from "./hub-links.mjs";

export function appNav(site) {
  const hub = hubLink();
  const mark = site.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "A";
  return `    <nav class="site-bar" aria-label="Site navigation">
      <a class="brand" href="${hub}">
        <span class="brand-mark" aria-hidden="true">${mark}</span>
        <span class="brand-text">${site.name}</span>
      </a>
      <div class="site-bar-actions">
        <a class="btn btn--ghost btn--sm" href="${hub}">← Hub</a>
      </div>
    </nav>`;
}

export function appHtml(site, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteTitle(site.name)}</title>${siteHeadMeta(site)}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_shared/tool.css" />
  <link rel="stylesheet" href="/_shared/app.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="bg" aria-hidden="true">
    <span class="orb orb--1"></span>
    <span class="orb orb--2"></span>
    <span class="grain"></span>
  </div>
  <main class="shell shell--app">
${appNav(site)}
    <header class="tool-header tool-header--compact">
      <p class="eyebrow">App #${site.id}</p>
      <h1 class="logo">${site.name}</h1>
      <p class="tagline">${site.tagline}</p>
    </header>
    <section class="app-stage" aria-label="App">
${bodyHtml}
    </section>
${siteMonetizationFooter("https://paypal.me/RajeevSewbalak")}
  </main>
  <p id="toast" class="toast" role="status"></p>
  <script src="script.js"></script>
</body>
</html>`;
}

export function accentCss(site) {
  return `:root{--accent:${site.accent};--accent-2:${site.accent2}}`;
}

export function toastHelper() {
  return `function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}`;
}
