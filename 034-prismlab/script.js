const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const minEl = document.getElementById("min");
const maxEl = document.getElementById("max");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const min = parseInt(minEl.value, 10) || 1;
  const max = parseInt(maxEl.value, 10) || 100;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  display.textContent = String(lo + Math.floor(Math.random() * (hi - lo + 1)));
});