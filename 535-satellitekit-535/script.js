function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const first="Alex Sam Jordan Riley Morgan Casey Avery Quinn Sage River Sky Blake Dakota Reese Logan".split(" ");
const last="Vale Ashford Reed Moss Hart Fox Lane Brooks Shaw Quinn Frost Hartley Moss".split(" ");
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=first[Math.floor(Math.random()*first.length)]+" "+last[Math.floor(Math.random()*last.length)];};