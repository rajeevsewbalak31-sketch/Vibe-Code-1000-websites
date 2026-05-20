function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const goal=8;function upd(){const g=parseInt(document.getElementById("g").value,10)||0;
document.getElementById("display").innerHTML=g+"/"+goal+" glasses · <strong>"+Math.round(g*250)+" ml</strong>";}
document.getElementById("g").oninput=upd;document.getElementById("plus").onclick=()=>{document.getElementById("g").value=(+document.getElementById("g").value||0)+1;upd();};upd();