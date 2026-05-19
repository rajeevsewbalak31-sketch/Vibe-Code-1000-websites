const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const swatch = document.getElementById("swatch");
const hexEl = document.getElementById("display");
const btn = document.getElementById("btn-action");
const btnCopy = document.getElementById("btn-copy");
function randomHex() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}
function pick() {
  const hex = randomHex();
  swatch.style.background = hex;
  hexEl.textContent = hex.toUpperCase();
}
btn.addEventListener("click", pick);
btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(hexEl.textContent);
  showToast("Copied!");
});
pick();