const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const input = document.getElementById("minutes");
const btn = document.getElementById("btn-action");
const btnStop = document.getElementById("btn-stop");
let timer = null;
let end = 0;
function tick() {
  const left = Math.max(0, end - Date.now());
  const s = Math.ceil(left / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  display.textContent = m + ":" + String(r).padStart(2, "0");
  if (left <= 0) {
    clearInterval(timer);
    timer = null;
    display.textContent = "Done!";
    showToast("Time's up!");
  }
}
btn.addEventListener("click", () => {
  const mins = Math.max(1, parseInt(input.value, 10) || 5);
  end = Date.now() + mins * 60 * 1000;
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 200);
  tick();
});
btnStop.addEventListener("click", () => {
  if (timer) clearInterval(timer);
  timer = null;
  display.textContent = "Stopped";
});