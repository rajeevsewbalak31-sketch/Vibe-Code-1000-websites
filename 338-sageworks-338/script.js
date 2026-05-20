function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const g=document.getElementById("grid");for(let i=0;i<256;i++){const b=document.createElement("button");b.type="button";
b.onclick=()=>b.classList.toggle("on");g.appendChild(b);}
document.getElementById("clr").onclick=()=>g.querySelectorAll("button").forEach(b=>b.classList.remove("on"));