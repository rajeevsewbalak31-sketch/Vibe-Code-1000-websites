import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { HUB_URL, siteHeadMeta, siteTitle } from "./lib/seo.mjs";
import { siteMonetizationFooter } from "./lib/monetization.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(__dirname, "manifest.json"), "utf8"));
const PAYPAL = manifest.paypal || "https://paypal.me/RajeevSewbalak";
const FORCE = process.argv.includes("--force");
const sites = JSON.parse(readFileSync(join(__dirname, "sites.json"), "utf8"));

const LOGIC = {
  "coin-flip": `const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.classList.add("is-flipping");
  display.textContent = "…";
  setTimeout(() => {
    const heads = Math.random() < 0.5;
    display.textContent = heads ? "Heads" : "Tails";
    display.classList.remove("is-flipping");
  }, 400);
});`,

  "dice-roll": `const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
const countEl = document.getElementById("dice-count");
btn.addEventListener("click", () => {
  const n = Math.min(6, Math.max(1, parseInt(countEl.value, 10) || 1));
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6));
  display.textContent = rolls.join(" · ");
});`,

  "yes-or-no": `const answers = ["Yes", "No", "Maybe", "Ask again later", "Definitely yes", "Not today"];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.classList.add("pulse");
  display.textContent = answers[Math.floor(Math.random() * answers.length)];
  setTimeout(() => display.classList.remove("pulse"), 300);
});`,

  "random-color": `const swatch = document.getElementById("swatch");
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
pick();`,

  "password-gen": `const display = document.getElementById("display");
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
generate();`,

  countdown: `const display = document.getElementById("display");
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
});`,

  pomodoro: `const display = document.getElementById("display");
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
render();`,

  "tip-calc": `const bill = document.getElementById("bill");
const pct = document.getElementById("tip-pct");
const people = document.getElementById("people");
const display = document.getElementById("display");
function calc() {
  const b = parseFloat(bill.value) || 0;
  const p = parseFloat(pct.value) || 15;
  const n = Math.max(1, parseInt(people.value, 10) || 1);
  const tip = b * (p / 100);
  const total = b + tip;
  const each = total / n;
  display.innerHTML = "Tip: <strong>€" + tip.toFixed(2) + "</strong><br>Total: <strong>€" + total.toFixed(2) + "</strong><br>Per person: <strong>€" + each.toFixed(2) + "</strong>";
}
[bill, pct, people].forEach((el) => el.addEventListener("input", calc));
calc();`,

  compliment: `const lines = [
  "You're doing better than you think.",
  "Your energy makes a difference.",
  "Someone is glad you exist.",
  "You learn faster than you give yourself credit for.",
  "Today is lucky to have you in it.",
  "Your kindness doesn't go unnoticed.",
  "You're allowed to be proud of small wins.",
  "The world needs your particular weirdness.",
  "You are more resilient than yesterday proved.",
  "Keep going — momentum loves you.",
];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.textContent = lines[Math.floor(Math.random() * lines.length)];
});`,

  "magic-8ball": `const replies = [
  "It is certain", "Without a doubt", "Yes definitely", "You may rely on it",
  "Ask again later", "Cannot predict now", "Don't count on it", "My reply is no",
  "Outlook good", "Signs point to yes", "Very doubtful", "Concentrate and ask again",
];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.textContent = "…";
  setTimeout(() => {
    display.textContent = replies[Math.floor(Math.random() * replies.length)];
  }, 500);
});`,

  rps: `const choices = ["Rock", "Paper", "Scissors"];
const display = document.getElementById("display");
document.querySelectorAll("[data-pick]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const you = btn.dataset.pick;
    const cpu = choices[Math.floor(Math.random() * 3)];
    let result = "Draw";
    if (
      (you === "Rock" && cpu === "Scissors") ||
      (you === "Paper" && cpu === "Rock") ||
      (you === "Scissors" && cpu === "Paper")
    ) result = "You win!";
    else if (you !== cpu) result = "CPU wins";
    display.innerHTML = "You: <strong>" + you + "</strong> · CPU: <strong>" + cpu + "</strong><br>" + result;
  });
});`,

  "lucky-number": `const display = document.getElementById("display");
const minEl = document.getElementById("min");
const maxEl = document.getElementById("max");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const min = parseInt(minEl.value, 10) || 1;
  const max = parseInt(maxEl.value, 10) || 100;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  display.textContent = String(lo + Math.floor(Math.random() * (hi - lo + 1)));
});`,

  "word-counter": `const input = document.getElementById("text-in");
const display = document.getElementById("display");
function count() {
  const t = input.value.trim();
  const words = t ? t.split(/\\s+/).length : 0;
  const chars = input.value.length;
  const mins = Math.max(1, Math.ceil(words / 200));
  display.innerHTML = words + " words · " + chars + " chars<br>~<strong>" + mins + "</strong> min read";
}
input.addEventListener("input", count);
count();`,

  stopwatch: `const display = document.getElementById("display");
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
});`,

  breathing: `const display = document.getElementById("display");
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
});`,

  "spin-wheel": `const input = document.getElementById("options");
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const opts = input.value.split(/[,\\n]/).map((s) => s.trim()).filter(Boolean);
  if (!opts.length) {
    display.textContent = "Add at least one option";
    return;
  }
  display.textContent = opts[Math.floor(Math.random() * opts.length)];
});`,

  "unit-convert": `const km = document.getElementById("km");
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
});`,

  "mood-picker": `const moods = ["Calm", "Excited", "Tired", "Grateful", "Curious", "Stressed", "Hopeful", "Playful"];
const display = document.getElementById("display");
const log = document.getElementById("mood-log");
document.querySelectorAll("[data-mood]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const m = btn.dataset.mood;
    display.textContent = "You're feeling " + m;
    const li = document.createElement("li");
    li.textContent = new Date().toLocaleTimeString() + " — " + m;
    log.prepend(li);
  });
});`,

  "name-picker": `const input = document.getElementById("names");
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const names = input.value.split(/[,\\n]/).map((s) => s.trim()).filter(Boolean);
  if (!names.length) {
    display.textContent = "Add names first";
    return;
  }
  display.textContent = names[Math.floor(Math.random() * names.length)];
});`,

  gratitude: `const input = document.getElementById("note");
const log = document.getElementById("log");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement("li");
  li.textContent = text;
  log.prepend(li);
  input.value = "";
  showToast("Gratitude saved!");
});`,
};

const EXTRA_HTML = {
  "dice-roll": `<label class="field-label">Dice count <input id="dice-count" type="number" min="1" max="6" value="2" class="input" /></label>`,
  "random-color": `<div id="swatch" class="color-swatch" aria-hidden="true"></div>`,
  "password-gen": `<label class="field-label">Length <input id="pwd-len" type="number" min="8" max="64" value="16" class="input" /></label>`,
  countdown: `<label class="field-label">Minutes <input id="minutes" type="number" min="1" max="180" value="5" class="input" /></label>`,
  pomodoro: ``,
  "tip-calc": `<div class="form-grid">
    <label class="field-label">Bill € <input id="bill" type="number" min="0" step="0.01" value="50" class="input" /></label>
    <label class="field-label">Tip % <input id="tip-pct" type="number" min="0" max="100" value="15" class="input" /></label>
    <label class="field-label">People <input id="people" type="number" min="1" value="2" class="input" /></label>
  </div>`,
  rps: `<div class="rps-row">
    <button type="button" class="btn btn--ghost" data-pick="Rock">Rock</button>
    <button type="button" class="btn btn--ghost" data-pick="Paper">Paper</button>
    <button type="button" class="btn btn--ghost" data-pick="Scissors">Scissors</button>
  </div>`,
  "lucky-number": `<div class="form-grid">
    <label class="field-label">Min <input id="min" type="number" value="1" class="input" /></label>
    <label class="field-label">Max <input id="max" type="number" value="100" class="input" /></label>
  </div>`,
  "word-counter": `<textarea id="text-in" class="textarea" placeholder="Paste or type your text…"></textarea>`,
  stopwatch: `<ul id="laps" class="lap-list"></ul>`,
  "spin-wheel": `<textarea id="options" class="textarea" placeholder="Pizza, Sushi, Tacos, Salad"></textarea>`,
  "unit-convert": `<div class="form-grid">
    <label class="field-label">Kilometers <input id="km" type="number" value="10" class="input" /></label>
    <label class="field-label">Miles <input id="miles" type="number" value="6.21" class="input" /></label>
  </div>`,
  "mood-picker": `<div class="mood-grid">${["Calm", "Excited", "Tired", "Grateful", "Curious", "Stressed", "Hopeful", "Playful"]
    .map((m) => `<button type="button" class="btn btn--ghost mood-btn" data-mood="${m}">${m}</button>`)
    .join("")}</div><ul id="mood-log" class="lap-list"></ul>`,
  "name-picker": `<textarea id="names" class="textarea" placeholder="Alice, Bob, Charlie"></textarea>`,
  gratitude: `<textarea id="note" class="textarea" placeholder="I'm grateful for…"></textarea><ul id="log" class="lap-list"></ul>`,
};

const EXTRA_BUTTONS = {
  countdown: `<button type="button" id="btn-stop" class="btn btn--ghost">Stop</button>`,
  pomodoro: `<button type="button" id="btn-reset" class="btn btn--ghost">Reset</button>`,
  "random-color": `<button type="button" id="btn-copy" class="btn btn--ghost">Copy hex</button>`,
  "password-gen": `<button type="button" id="btn-copy" class="btn btn--ghost">Copy</button>`,
  stopwatch: `<button type="button" id="btn-lap" class="btn btn--ghost">Lap</button><button type="button" id="btn-reset" class="btn btn--ghost">Reset</button>`,
};

function buildExtraHtml(site) {
  return EXTRA_HTML[site.logic] || "";
}

function css(site) {
  const glow = site.accent + "59";
  return `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg-deep:#0c0f14;--bg-card:rgba(255,255,255,.06);--border:rgba(255,255,255,.1);--text:#f4f0ea;--text-muted:rgba(244,240,234,.55);--accent:${site.accent};--accent-glow:${glow};--accent-2:${site.accent2};--font-display:"Fraunces",Georgia,serif;--font-ui:"Outfit",system-ui,sans-serif;--radius:1.25rem}
html{font-size:100%;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;font-family:var(--font-ui);color:var(--text);background:var(--bg-deep);overflow-x:hidden}
.bg{position:fixed;inset:0;z-index:0;overflow:hidden;background:radial-gradient(ellipse 120% 80% at 50% 0%,#1a2332 0%,var(--bg-deep) 55%)}
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.45;animation:drift 18s ease-in-out infinite}
.orb--1{width:min(55vw,420px);height:min(55vw,420px);background:color-mix(in srgb,var(--accent) 40%,#1a2332);top:-10%;left:-8%}
.orb--2{width:min(45vw,320px);height:min(45vw,320px);background:color-mix(in srgb,var(--accent-2) 35%,#0c0f14);bottom:5%;right:-5%;animation-delay:-6s}
.grain{position:absolute;inset:0;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(4%,6%)}}
.page{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;min-height:100dvh;padding:2rem 1.25rem 5rem;max-width:32rem;margin:0 auto}
.header{text-align:center;margin-bottom:1.5rem}
.eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem}
.logo{font-family:var(--font-display);font-size:clamp(2rem,8vw,2.75rem);font-weight:600;letter-spacing:-.02em}
.tagline{margin-top:.35rem;font-size:1rem;color:var(--text-muted)}
.card{width:100%;padding:1.75rem 1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);backdrop-filter:blur(12px);box-shadow:0 24px 80px rgba(0,0,0,.45)}
.display{font-family:var(--font-display);font-size:clamp(1.5rem,6vw,2.25rem);line-height:1.35;text-align:center;min-height:3rem;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.5rem}
.display.is-flipping{opacity:.6}
.display.pulse{animation:pulse .3s ease}
@keyframes pulse{50%{transform:scale(1.03)}}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-top:1.5rem;width:100%}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.85rem 1.5rem;font-family:var(--font-ui);font-size:.95rem;font-weight:500;border:none;border-radius:999px;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s}
.btn:active{transform:scale(.97)}
.btn--primary{flex:1 1 12rem;max-width:18rem;color:var(--bg-deep);background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 8px 32px var(--accent-glow)}
.btn--primary:hover{transform:translateY(-1px);box-shadow:0 12px 40px var(--accent-glow)}
.btn--ghost{color:var(--text);background:rgba(255,255,255,.08);border:1px solid var(--border)}
.btn--ghost:hover{background:rgba(255,255,255,.12)}
.field-label{display:flex;flex-direction:column;gap:.35rem;font-size:.8rem;color:var(--text-muted);text-align:left}
.form-grid{display:grid;gap:.75rem;margin-bottom:1rem}
.input,.textarea{width:100%;padding:.65rem .85rem;font-family:var(--font-ui);font-size:1rem;color:var(--text);background:rgba(0,0,0,.25);border:1px solid var(--border);border-radius:.75rem}
.textarea{min-height:5rem;resize:vertical;margin-bottom:1rem}
.color-swatch{width:100%;height:5rem;border-radius:.75rem;margin-bottom:1rem;border:1px solid var(--border)}
.rps-row,.mood-grid{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:1rem}
.mood-btn{font-size:.8rem;padding:.5rem .85rem}
.lap-list{list-style:none;margin-top:1rem;width:100%;max-height:8rem;overflow-y:auto;font-size:.85rem;color:var(--text-muted);text-align:left}
.lap-list li{padding:.35rem 0;border-bottom:1px solid var(--border)}
#ring{width:7rem;height:7rem;margin:0 auto 1rem;border-radius:50%;border:3px solid var(--accent);transition:transform 1s ease;background:rgba(255,255,255,.04)}
.tip-jar{margin-top:2rem;text-align:center;padding-top:1.5rem;border-top:1px solid var(--border);width:100%}
.tip-jar p{font-size:.85rem;color:var(--text-muted);margin-bottom:.5rem}
.tip-chips{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin-bottom:.75rem}
.tip-chip{padding:.35rem .75rem;font-size:.78rem;font-weight:600;color:var(--text);background:rgba(255,255,255,.08);border:1px solid var(--border);border-radius:999px;text-decoration:none}
.tip-chip:hover{border-color:var(--accent);color:var(--accent)}
.tip-chip--main{color:var(--bg-deep);background:linear-gradient(135deg,#0070ba,#003087);border-color:transparent}
.tip-link{display:inline-flex;align-items:center;gap:.35rem;padding:.55rem 1.1rem;font-size:.85rem;font-weight:600;color:var(--bg-deep);background:linear-gradient(135deg,#0070ba,#003087);border-radius:999px;text-decoration:none}
.tip-link:hover{opacity:.92}
.tip-upsell{margin-bottom:.75rem;font-size:.88rem}
.tip-upsell-link{color:var(--text);text-decoration:none}
.tip-upsell-link:hover{color:var(--accent)}
.tip-chip--buy{color:var(--bg-deep);background:linear-gradient(135deg,var(--accent),var(--accent-2));border-color:transparent;font-weight:600}
.hub-wrap{margin-top:1rem;text-align:center;font-size:.78rem}
.hub-link{color:var(--accent-2);text-decoration:none;font-weight:500}
.hub-link:hover{text-decoration:underline}
.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(1rem);padding:.65rem 1.25rem;font-size:.875rem;font-weight:500;color:var(--bg-deep);background:var(--accent-2);border-radius:999px;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;z-index:10}
.toast.is-visible{opacity:1;transform:translateX(-50%) translateY(0)}
@media(prefers-reduced-motion:reduce){.orb,#ring{animation:none}}`;
}

function html(site) {
  const extra = buildExtraHtml(site);
  const needsMainBtn = !["rps", "mood-picker", "unit-convert", "word-counter"].includes(site.logic);
  const mainBtn = needsMainBtn
    ? `<button type="button" id="btn-action" class="btn btn--primary">${buttonLabel(site)}</button>`
    : "";
  const extraBtns = EXTRA_BUTTONS[site.logic] || "";
  const displayTag =
    site.logic === "tip-calc" || site.logic === "rps" || site.logic === "word-counter"
      ? `<div id="display" class="display">—</div>`
      : `<p id="display" class="display">${initialDisplay(site)}</p>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteTitle(site.name)}</title>${siteHeadMeta(site)}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="bg" aria-hidden="true">
    <span class="orb orb--1"></span>
    <span class="orb orb--2"></span>
    <span class="grain"></span>
  </div>
  <main class="page">
    <header class="header">
      <p class="eyebrow">Website #${site.id}</p>
      <h1 class="logo">${site.name}</h1>
      <p class="tagline">${site.tagline}</p>
    </header>
    <article class="card">
      ${site.logic === "breathing" ? '<div id="ring" aria-hidden="true"></div>' : ""}
      ${extra}
      ${displayTag}
      <div class="actions">
        ${mainBtn}
        ${extraBtns}
      </div>
    </article>
${siteMonetizationFooter(PAYPAL, HUB_URL)}
  </main>
  <p id="toast" class="toast" role="status"></p>
  <script src="script.js"></script>
</body>
</html>`;
}

function buttonLabel(site) {
  const labels = {
    countdown: "Start countdown",
    pomodoro: "Start 25 min",
    gratitude: "Save note",
    "name-picker": "Pick winner",
    "spin-wheel": "Spin",
    breathing: "Start 4-7-8",
    stopwatch: "Start",
    "password-gen": "Generate",
    "random-color": "New color",
  };
  return labels[site.logic] || "Go";
}

function initialDisplay(site) {
  if (site.logic === "coin-flip") return "Tap to flip";
  if (site.logic === "compliment") return "Tap for a compliment";
  if (site.logic === "magic-8ball") return "Ask the oracle";
  if (site.logic === "mood-picker") return "Pick your mood";
  if (site.logic === "unit-convert") return "";
  return "—";
}

function script(site) {
  const logic = LOGIC[site.logic];
  if (!logic) throw new Error("Missing logic: " + site.logic);
  return `const PAYPAL_SUPPORT = "${PAYPAL}";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
${logic}`;
}

function cleanHtml(raw) {
  return raw
    .replace(/<div/g, "<div")
    .replace(/<\/motion-div>/g, "</div>")
    .replace('<div id="ring" aria-hidden="true"></div>', '<div id="ring" aria-hidden="true"></div>')
    .replace(/<div id="ring"/g, '<div id="ring"')
    .replace(/<\/motion-div>\s*${extra}/g, "");
}

let created = 0;
let updated = 0;
for (const site of sites) {
  const dir = join(ROOT, `${site.id}-${site.slug}`);
  const exists = existsSync(dir);
  if (exists && !FORCE) {
    console.log("Skip (exists):", dir);
    continue;
  }
  if (!exists) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html(site), "utf8");
  writeFileSync(join(dir, "style.css"), css(site), "utf8");
  writeFileSync(join(dir, "script.js"), script(site), "utf8");
  if (exists) {
    updated++;
    console.log("Updated:", site.id, site.slug);
  } else {
    created++;
    console.log("Created:", site.id, site.slug);
  }
}
console.log(`Done. Created ${created}, updated ${updated}${FORCE ? " (force)" : ""}.`);
