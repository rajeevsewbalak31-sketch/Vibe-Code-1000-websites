function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const words=document.getElementById("in").value.toLowerCase().match(/[a-z']+/g)||[];
const m={};words.forEach(w=>m[w]=(m[w]||0)+1);
const top=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([w,c])=>w+": "+c).join("\n");
document.getElementById("out").textContent=top||"—";}
document.getElementById("in").addEventListener("input",upd);upd();