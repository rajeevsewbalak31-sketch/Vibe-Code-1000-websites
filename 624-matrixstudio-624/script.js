function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const a="Nova Pulse Drift Prism Echo Flux Spark Orbit Zenith Lumen".split(" ");
const b="Labs Hub Kit Box Works Studio Forge Port Mint".split(" ");
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=
a[Math.floor(Math.random()*a.length)]+" "+b[Math.floor(Math.random()*b.length)];};