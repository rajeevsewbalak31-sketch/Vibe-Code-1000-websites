const d = document.getElementById("display"), b = document.getElementById("btn-action"), L = document.getElementById("laps");
let st = 0, el = 0, t, run;
function F(ms) { const s = Math.floor(ms / 1000), cs = Math.floor((ms % 1000) / 10); return s + "." + String(cs).padStart(2, "0") + "s"; }
function R() { d.textContent = F(run ? Date.now() - st + el : el); }
b.onclick = () => { if (!run) { st = Date.now(); run = 1; b.textContent = "Stop"; t = setInterval(R, 50); } else { clearInterval(t); el += Date.now() - st; run = 0; b.textContent = "Start"; R(); } };
document.getElementById("btn-lap").onclick = () => { if (!run) return; const li = document.createElement("li"); li.textContent = "Lap: " + F(Date.now() - st + el); L.prepend(li); };
document.getElementById("btn-reset").onclick = () => { clearInterval(t); run = 0; el = 0; L.innerHTML = ""; d.textContent = "0.00s"; b.textContent = "Start"; };
