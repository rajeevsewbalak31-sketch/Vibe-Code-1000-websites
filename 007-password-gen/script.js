function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

const display = document.getElementById("display");
const lenEl = document.getElementById("pwd-len");
const lenVal = document.getElementById("len-val");
const fill = document.getElementById("strength-fill");
const label = document.getElementById("strength-label");
const lowers = "abcdefghijkmnopqrstuvwxyz";
const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const nums = "23456789";
const syms = "!@#$%^&*-_+=?";

function charset() {
  let s = "";
  if (document.getElementById("opt-lower").checked) s += lowers;
  if (document.getElementById("opt-upper").checked) s += uppers;
  if (document.getElementById("opt-num").checked) s += nums;
  if (document.getElementById("opt-sym").checked) s += syms;
  return s || lowers;
}

function score(pwd) {
  let n = 0;
  if (pwd.length >= 12) n++;
  if (pwd.length >= 16) n++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) n++;
  if (/\d/.test(pwd)) n++;
  if (/[^a-zA-Z0-9]/.test(pwd)) n++;
  return Math.min(5, n);
}

function showStrength(pwd) {
  const s = score(pwd);
  const pct = (s / 5) * 100;
  const colors = ["#e74c3c", "#e67e22", "#f39c12", "#f1c40f", "#2ecc71"];
  const names = ["Weak", "Fair", "Good", "Strong", "Excellent"];
  fill.style.width = pct + "%";
  fill.style.background = colors[Math.max(0, s - 1)] || colors[0];
  label.textContent = pwd ? names[Math.max(0, s - 1)] : "—";
}

function generate() {
  const len = Math.min(64, Math.max(8, parseInt(lenEl.value, 10) || 16));
  const chars = charset();
  let pwd = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
  display.textContent = pwd;
  showStrength(pwd);
}

function passphrase() {
  const words =
    "amber atlas breeze cedar delta ember fjord grove harbor iris juniper kinetic lagoon meadow nova orbit prism quartz ripple summit tide upland velvet willow zenith".split(
      " "
    );
  const n = 4 + Math.floor(Math.random() * 3);
  const parts = [];
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  for (let i = 0; i < n; i++) parts.push(words[arr[i] % words.length]);
  const pwd = parts.join("-") + (Math.floor(Math.random() * 90) + 10);
  display.textContent = pwd;
  showStrength(pwd);
}

lenEl.addEventListener("input", () => {
  lenVal.textContent = lenEl.value;
});

document.getElementById("btn-action").addEventListener("click", generate);
document.getElementById("btn-passphrase").addEventListener("click", passphrase);
document.getElementById("btn-copy").addEventListener("click", async () => {
  const text = display.textContent;
  if (!text || text === "Tap generate") return;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch {
    showToast("Copy failed");
  }
});

["opt-lower", "opt-upper", "opt-num", "opt-sym"].forEach((id) =>
  document.getElementById(id).addEventListener("change", () => {
    if (display.textContent && display.textContent !== "Tap generate") generate();
  })
);

generate();
