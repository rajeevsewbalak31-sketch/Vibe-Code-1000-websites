const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
const countEl = document.getElementById("dice-count");
btn.addEventListener("click", () => {
  const n = Math.min(6, Math.max(1, parseInt(countEl.value, 10) || 1));
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6));
  display.textContent = rolls.join(" · ");
});