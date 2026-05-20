function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const holes=document.getElementById("holes");let score=0,time=30,timer,int;
for(let i=0;i<9;i++){const h=document.createElement("button");h.type="button";h.className="whack-hole";h.dataset.i=i;
h.addEventListener("click",()=>{if(h.classList.contains("is-up")){score++;document.getElementById("score").textContent=score;h.classList.remove("is-up");}});holes.appendChild(h);}
document.getElementById("btn-start").onclick=()=>{clearInterval(timer);clearInterval(int);score=0;time=30;document.getElementById("score").textContent="0";
int=setInterval(()=>{document.querySelectorAll(".whack-hole").forEach(h=>h.classList.remove("is-up"));
const up=document.querySelector(`.whack-hole[data-i="${Math.floor(Math.random()*9)}"]`);up.classList.add("is-up");},650);
timer=setInterval(()=>{time--;document.getElementById("time").textContent=time;if(time<=0){clearInterval(int);clearInterval(timer);showToast(`Time! Score ${score}`);}},1000);};