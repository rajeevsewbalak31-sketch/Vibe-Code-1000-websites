const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const input = document.getElementById("names");
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const names = input.value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  if (!names.length) {
    display.textContent = "Add names first";
    return;
  }
  display.textContent = names[Math.floor(Math.random() * names.length)];
});