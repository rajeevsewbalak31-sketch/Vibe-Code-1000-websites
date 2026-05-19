const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const lapsEl = document.getElementById("laps");
const btn = document.getElementById("btn-action");
const btnLap = document.getElementById("btn-lap");
const btnReset = document.getElementById("btn-reset");
let start = 0;
let elapsed = 0;
let timer = null;
let running = false;
function fmt(ms) {
  const s = Math.floor(ms / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return s + "." + String(cs).padStart(2, "0") + "s";
}
function render() {
  const now = running ? Date.now() - start + elapsed : elapsed;
  display.textContent = fmt(now);
}
btn.addEventListener("click", () => {
  if (!running) {
    start = Date.now();
    running = true;
    btn.textContent = "Stop";
    timer = setInterval(render, 50);
  } else {
    clearInterval(timer);
    elapsed += Date.now() - start;
    running = false;
    btn.textContent = "Start";
    render();
  }
});
btnLap.addEventListener("click", () => {
  if (!running) return;
  const lap = Date.now() - start + elapsed;
  const li = document.createElement("li");
  li.textContent = "Lap " + (lapsEl.children.length + 1) + ": " + fmt(lap);
  lapsEl.prepend(li);
});
btnReset.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  elapsed = 0;
  btn.textContent = "Start";
  lapsEl.innerHTML = "";
  display.textContent = "0.00s";
});