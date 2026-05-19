const d = document.getElementById("display");
let t, end;
function tick() {
  const left = Math.max(0, end - Date.now());
  const s = Math.ceil(left / 1000);
  d.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  if (left <= 0) clearInterval(t);
}
document.getElementById("btn-action").onclick = () => {
  end = Date.now() + (Math.max(1, +document.getElementById("minutes").value || 5) * 60000);
  clearInterval(t);
  t = setInterval(tick, 200);
  tick();
};
document.getElementById("btn-stop").onclick = () => { clearInterval(t); d.textContent = "Stopped"; };
