const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const input = document.getElementById("options");
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const opts = input.value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  if (!opts.length) {
    display.textContent = "Add at least one option";
    return;
  }
  display.textContent = opts[Math.floor(Math.random() * opts.length)];
});