function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const a=document.getElementById("c1").value,b=document.getElementById("c2").value,ang=document.getElementById("ang").value;
const css=`background: linear-gradient(${ang}deg, ${a}, ${b});`;
document.getElementById("prev").style.background=`linear-gradient(${ang}deg, ${a}, ${b})`;
document.getElementById("out").textContent=css;}
["c1","c2","ang"].forEach(id=>document.getElementById(id).addEventListener("input",upd));
document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").textContent);showToast("Copied!");};
upd();