const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const input = document.getElementById("text-in");
const display = document.getElementById("display");
function count() {
  const t = input.value.trim();
  const words = t ? t.split(/\s+/).length : 0;
  const chars = input.value.length;
  const mins = Math.max(1, Math.ceil(words / 200));
  display.innerHTML = words + " words · " + chars + " chars<br>~<strong>" + mins + "</strong> min read";
}
input.addEventListener("input", count);
count();