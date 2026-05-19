const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const display = document.getElementById("display");
const ring = document.getElementById("ring");
const btn = document.getElementById("btn-action");
const phases = [
  { label: "Inhale", sec: 4, scale: 1.2 },
  { label: "Hold", sec: 7, scale: 1.2 },
  { label: "Exhale", sec: 8, scale: 0.85 },
];
let running = false;
let idx = 0;
let left = 0;
let timer = null;
function step() {
  const p = phases[idx];
  display.textContent = p.label + " · " + left + "s";
  ring.style.transform = "scale(" + p.scale + ")";
  if (left <= 0) {
    idx = (idx + 1) % phases.length;
    left = phases[idx].sec;
    return;
  }
  left--;
}
btn.addEventListener("click", () => {
  if (running) {
    clearInterval(timer);
    running = false;
    btn.textContent = "Start 4-7-8";
    display.textContent = "Paused";
    return;
  }
  running = true;
  btn.textContent = "Stop";
  idx = 0;
  left = phases[0].sec;
  timer = setInterval(step, 1000);
  step();
});