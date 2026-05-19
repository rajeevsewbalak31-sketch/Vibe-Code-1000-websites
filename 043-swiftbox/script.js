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
btn.addEventListener("click", () => {
  display.classList.add("is-flipping");
  display.textContent = "…";
  setTimeout(() => {
    const heads = Math.random() < 0.5;
    display.textContent = heads ? "Heads" : "Tails";
    display.classList.remove("is-flipping");
  }, 400);
});