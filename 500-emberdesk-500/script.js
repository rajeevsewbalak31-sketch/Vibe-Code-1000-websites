function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let h=0,t=0;document.getElementById("flip").onclick=()=>{if(Math.random()<0.5)h++;else t++;
const tot=h+t;document.getElementById("display").innerHTML="Heads: <strong>"+h+"</strong> ("+Math.round(100*h/tot)+"%)<br>Tails: <strong>"+t+"</strong> ("+Math.round(100*t/tot)+"%)";};
document.getElementById("rst").onclick=()=>{h=t=0;document.getElementById("display").textContent="Heads: 0 · Tails: 0";};