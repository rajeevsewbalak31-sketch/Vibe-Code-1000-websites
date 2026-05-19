const TOTAL = 1000;
const COMPLETED = 22;

const fill = document.getElementById("progress-fill");
if (fill) {
  fill.style.width = `${(COMPLETED / TOTAL) * 100}%`;
}

const search = document.getElementById("search");
const grid = document.getElementById("site-grid");
const countEl = document.getElementById("visible-count");
const cards = grid ? [...grid.querySelectorAll(".card")] : [];

function updateFilter() {
  const q = (search?.value || "").trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const hay = `${card.textContent} ${card.dataset.name || ""}`.toLowerCase();
    const show = !q || hay.includes(q);
    card.classList.toggle("is-hidden", !show);
    if (show) visible++;
  });
  if (countEl) {
    countEl.textContent = visible === cards.length ? `${visible} sites` : `${visible} of ${cards.length} shown`;
  }
}

search?.addEventListener("input", updateFilter);
updateFilter();
