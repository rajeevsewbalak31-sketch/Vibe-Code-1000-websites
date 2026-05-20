function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("btn").onclick=()=>{const v=1+Math.floor(Math.random()*6);
const die=document.getElementById("die");die.textContent=v;die.style.transform="rotate("+Math.random()*20+"deg) scale(1.05)";setTimeout(()=>die.style.transform="",200);};