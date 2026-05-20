function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let lock=true;document.getElementById("lock").onchange=e=>{lock=e.target.checked;};
document.getElementById("w").oninput=()=>{if(lock){const w=parseFloat(document.getElementById("w").value)||1;document.getElementById("h").value=Math.round(w*9/16);}upd();};
document.getElementById("h").oninput=upd;function upd(){const w=document.getElementById("w").value,h=document.getElementById("h").value;
document.getElementById("display").textContent=w+" × "+h+" · ratio "+(w/h).toFixed(3);}upd();