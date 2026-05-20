function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function lum(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
return (0.299*r+0.587*g+0.114*b)/255;}
function upd(){const fg=document.getElementById("fg").value,bg=document.getElementById("bg").value;
const p=document.getElementById("prev");p.style.color=fg;p.style.background=bg;
const L1=lum(fg)+0.05,L2=lum(bg)+0.05;const ratio=(Math.max(L1,L2)/Math.min(L1,L2)).toFixed(2);
document.getElementById("display").textContent="Contrast "+ratio+":1 — "+(ratio>=4.5?"AA pass":"Low contrast");}
document.getElementById("fg").oninput=document.getElementById("bg").oninput=upd;upd();