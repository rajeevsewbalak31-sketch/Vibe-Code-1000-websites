function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const x=document.getElementById("x").value,y=document.getElementById("y").value,b=document.getElementById("blur").value,s=document.getElementById("spread").value;
const sh=`box-shadow: ${x}px ${y}px ${b}px ${s}px rgba(0,0,0,.45);`;
document.getElementById("box").style.boxShadow=`${x}px ${y}px ${b}px ${s}px rgba(0,0,0,.45)`;
document.getElementById("out").textContent=sh;}
["x","y","blur","spread"].forEach(id=>document.getElementById(id).addEventListener("input",upd));document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").textContent);showToast("Copied!");};upd();