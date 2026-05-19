const d = document.getElementById("display"), ring = document.getElementById("ring"), b = document.getElementById("btn-action");
const P = [{ l: "Inhale", s: 4, sc: 1.2 }, { l: "Hold", s: 7, sc: 1.2 }, { l: "Exhale", s: 8, sc: 0.85 }];
let run, i, left, t;
function step() { const p = P[i]; d.textContent = p.l + " · " + left + "s"; ring.style.transform = "scale(" + p.sc + ")"; if (left <= 0) { i = (i + 1) % P.length; left = P[i].s; return; } left--; }
b.onclick = () => { if (run) { clearInterval(t); run = 0; b.textContent = "Start 4-7-8"; return; } run = 1; b.textContent = "Stop"; i = 0; left = P[0].s; t = setInterval(step, 1000); step(); };
