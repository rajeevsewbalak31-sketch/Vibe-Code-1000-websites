const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const km = document.getElementById("km");
const miles = document.getElementById("miles");
let lock = false;
km.addEventListener("input", () => {
  if (lock) return;
  lock = true;
  miles.value = (parseFloat(km.value) * 0.621371 || 0).toFixed(2);
  lock = false;
});
miles.addEventListener("input", () => {
  if (lock) return;
  lock = true;
  km.value = (parseFloat(miles.value) * 1.60934 || 0).toFixed(2);
  lock = false;
});