const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const lenEl = document.getElementById("pwd-len");
const btn = document.getElementById("btn-action");
const btnCopy = document.getElementById("btn-copy");
const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
function generate() {
  const len = Math.min(64, Math.max(8, parseInt(lenEl.value, 10) || 16));
  let pwd = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
  display.textContent = pwd;
}
btn.addEventListener("click", generate);
btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(display.textContent);
  showToast("Password copied!");
});
generate();