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
const ring = document.getElementById("ring-fg");
const card = document.querySelector(".timer-card");
const modeLabel = document.getElementById("mode-label");
const sessionsEl = document.getElementById("sessions");
const CIRC = 339.292;

let totalSecs = 25 * 60;
let secs = totalSecs;
let timer = null;
let running = false;
let mode = "focus";

const today = new Date().toDateString();
let count = parseInt(localStorage.getItem("pomo-" + today) || "0", 10);
sessionsEl.textContent = count;

function render() {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  display.textContent = m + ":" + String(s).padStart(2, "0");
  const pct = totalSecs ? 1 - secs / totalSecs : 0;
  ring.style.strokeDashoffset = String(CIRC * pct);
}

function chime() {
  if (!document.getElementById("sound").checked) return;
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {
    /* ignore */
  }
}

function onComplete() {
  clearInterval(timer);
  running = false;
  btn.textContent = "Start";
  chime();
  if (mode === "focus") {
    count++;
    localStorage.setItem("pomo-" + today, String(count));
    sessionsEl.textContent = count;
    showToast("Focus block complete — take a break!");
  } else {
    showToast("Break over — ready to focus?");
  }
  secs = 0;
  render();
}

btn.addEventListener("click", () => {
  if (running) {
    clearInterval(timer);
    running = false;
    btn.textContent = "Resume";
    return;
  }
  if (secs <= 0) secs = totalSecs;
  running = true;
  btn.textContent = "Pause";
  timer = setInterval(() => {
    if (secs <= 0) {
      onComplete();
      return;
    }
    secs--;
    render();
  }, 1000);
});

btnReset.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  secs = totalSecs;
  btn.textContent = "Start";
  render();
});

document.querySelectorAll(".preset").forEach((p) => {
  p.addEventListener("click", () => {
    document.querySelectorAll(".preset").forEach((x) => x.classList.remove("is-active"));
    p.classList.add("is-active");
    totalSecs = parseInt(p.dataset.secs, 10);
    secs = totalSecs;
    mode = p.dataset.mode;
    card.dataset.mode = mode;
    modeLabel.textContent =
      mode === "focus" ? "Focus session" : mode === "short" ? "Short break" : "Long break";
    clearInterval(timer);
    running = false;
    btn.textContent = "Start";
    render();
  });
});

render();
