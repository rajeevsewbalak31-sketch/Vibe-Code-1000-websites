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
const btnReset = document.getElementById("btn-reset");
let secs = 25 * 60;
let timer = null;
let running = false;
function render() {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  display.textContent = m + ":" + String(s).padStart(2, "0");
}
btn.addEventListener("click", () => {
  if (running) {
    clearInterval(timer);
    running = false;
    btn.textContent = "Resume";
    return;
  }
  running = true;
  btn.textContent = "Pause";
  timer = setInterval(() => {
    if (secs <= 0) {
      clearInterval(timer);
      running = false;
      showToast("Focus session complete!");
      btn.textContent = "Start 25 min";
      secs = 25 * 60;
      render();
      return;
    }
    secs--;
    render();
  }, 1000);
});
btnReset.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  secs = 25 * 60;
  btn.textContent = "Start 25 min";
  render();
});
render();