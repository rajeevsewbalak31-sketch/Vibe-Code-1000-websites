const TOTAL = 1000;
const COMPLETED = 23;
const POPULAR_IDS = ["004","003","007","101","104","001","002","013"];

const fill = document.getElementById("progress-fill");
const progressBar = document.querySelector(".progress-bar[role='progressbar']");
const progressPctEl = document.getElementById("progress-pct");
if (fill) {
  const pct = TOTAL > 0 ? (COMPLETED / TOTAL) * 100 : 0;
  fill.style.width = `${pct}%`;
  if (progressBar) progressBar.style.setProperty("--progress-pct", `${pct}%`);
  if (progressPctEl) {
    progressPctEl.textContent =
      Number.isInteger(pct) || pct >= 10 ? `${Math.round(pct * 10) / 10}` : pct.toFixed(1);
  }
}

const search = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const grid = document.getElementById("site-grid");
const countEl = document.getElementById("visible-count");
const filterBar = document.getElementById("category-filters");

let activeCategory = "all";
let sortMode = "default";

function getCards() {
  return grid ? [...grid.querySelectorAll(".card")] : [];
}

function matchesCategory(card) {
  if (activeCategory === "all") return true;
  if (activeCategory === "featured") return card.dataset.featured === "true";
  return card.dataset.category === activeCategory;
}

function compareCards(a, b) {
  if (sortMode === "newest") {
    return b.dataset.sortId.localeCompare(a.dataset.sortId);
  }
  if (sortMode === "popular") {
    const pa = parseInt(a.dataset.popular, 10);
    const pb = parseInt(b.dataset.popular, 10);
    if (pa !== pb) return pa - pb;
    return a.dataset.sortId.localeCompare(b.dataset.sortId);
  }
  return a.dataset.sortId.localeCompare(b.dataset.sortId);
}

function applySort() {
  if (!grid || sortMode === "default") return;
  const cards = getCards();
  cards.sort(compareCards);
  cards.forEach((card) => grid.appendChild(card));
}

function updateFilter() {
  const q = (search?.value || "").trim().toLowerCase();
  const cards = getCards();
  let visible = 0;
  cards.forEach((card) => {
    const hay = `${card.textContent} ${card.dataset.name || ""}`.toLowerCase();
    const show = matchesCategory(card) && (!q || hay.includes(q));
    card.classList.toggle("is-hidden", !show);
    if (show) visible++;
  });
  if (countEl) {
    const total = cards.length;
    countEl.textContent =
      visible === total && !q && activeCategory === "all"
        ? `${visible} sites`
        : `${visible} of ${total} shown`;
  }
}

filterBar?.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  activeCategory = btn.dataset.category || "all";
  filterBar.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
  updateFilter();
});

sortSelect?.addEventListener("change", () => {
  sortMode = sortSelect.value || "default";
  applySort();
  updateFilter();
});

search?.addEventListener("input", updateFilter);

function activateGamesFilter() {
  const btn = filterBar?.querySelector('[data-category="games"]');
  if (btn) btn.click();
  document.getElementById("site-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function activateCategoryFilter(cat) {
  const btn = filterBar?.querySelector(`[data-category="${cat}"]`);
  if (btn) btn.click();
  document.getElementById("site-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-filter-games]").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (el.tagName === "A" && el.getAttribute("href")?.includes("egg-balance")) return;
    e.preventDefault();
    activateGamesFilter();
  });
});

document.querySelectorAll("[data-filter-experiments]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    activateCategoryFilter("experiments");
  });
});

document.querySelectorAll("[data-filter-creative]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    activateCategoryFilter("creative");
  });
});

document.querySelectorAll("[data-filter-labs]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    activateCategoryFilter("labs");
  });
});

if (location.hash === "#games") {
  activeCategory = "games";
  filterBar?.querySelectorAll(".filter").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.category === "games");
  });
}

applySort();
updateFilter();
if (location.hash === "#games") {
  requestAnimationFrame(() => document.getElementById("site-grid")?.scrollIntoView({ behavior: "smooth" }));
}

const LEAD_ISSUE =
  "https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites/issues/new?labels=enhancement";

document.getElementById("newsletter-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector("#newsletter-email")?.value?.trim();
  const status = document.getElementById("newsletter-status");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (status) status.textContent = "Please enter a valid email.";
    return;
  }
  const endpoint = form.dataset.endpoint?.trim();
  if (endpoint) {
    if (status) status.textContent = "Subscribing…";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, _subject: "VibeCode 1000 newsletter" }),
      });
      if (!res.ok) throw new Error("subscribe failed");
    } catch {
      if (status) status.textContent = "Could not subscribe right now. Try again later.";
      status?.classList.remove("is-success");
      return;
    }
  } else {
    try {
      const list = JSON.parse(localStorage.getItem("vc1000-newsletter") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("vc1000-newsletter", JSON.stringify(list));
    } catch {
      /* ignore */
    }
    if (status) {
      status.textContent =
        "Saved on this device — we'll connect email delivery soon. Follow on X for updates meanwhile.";
      status.classList.add("is-success");
      form.reset();
      return;
    }
  }
  if (status) {
    status.textContent = "You're on the list — thank you!";
    status.classList.add("is-success");
  }
  form.reset();
});

document.getElementById("lead-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const pkg = fd.get("package") || "Starter";
  const title = encodeURIComponent(`Website order: ${pkg}`);
  const body = encodeURIComponent(
    `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\nPackage: ${pkg}\n\n${fd.get("message")}\n\n---\nSent from hub contact form`
  );
  window.open(`${LEAD_ISSUE}&title=${title}&body=${body}`, "_blank", "noopener,noreferrer");
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = "Opening GitHub…";
    setTimeout(() => {
      btn.textContent = prev;
    }, 2000);
  }
});
