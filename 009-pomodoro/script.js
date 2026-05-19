const d = document.getElementById("display");
const b = document.getElementById("btn-action");
let s = 1500, t, run;
function R() { d.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
b.onclick = () => {
  if (run) { clearInterval(t); run = 0; b.textContent = "Resume"; return; }
  run = 1; b.textContent = "Pause";
  t = setInterval(() => { if (s <= 0) { clearInterval(t); run = 0; s = 1500; R(); b.textContent = "Start 25 min"; return; } s--; R(); }, 1000);
};
document.getElementById("btn-reset").onclick = () => { clearInterval(t); run = 0; s = 1500; R(); b.textContent = "Start 25 min"; };
R();
