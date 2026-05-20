function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const c=document.getElementById("c"),x=c.getContext("2d");let basket=140,score=0,lives=3,items=[];
function spawn(){items.push({x:Math.random()*280+10,y:-20,good:Math.random()>0.25,v:2+Math.random()*2});}
setInterval(spawn,700);
function draw(){x.fillStyle="#0a0d12";x.fillRect(0,0,320,400);x.fillStyle="#3498db";x.fillRect(basket,360,80,24);
items.forEach((it,i)=>{it.y+=it.v;x.fillStyle=it.good?"#f5e6c8":"#e74c3c";x.beginPath();x.arc(it.x,it.y,10,0,7);x.fill();
if(it.y>350&&it.y<380&&it.x>basket&&it.x<basket+80){items.splice(i,1);if(it.good){score++;showToast("+1");}else{lives--;showToast("Bomb!");}}
if(it.y>410)items.splice(i,1);});
document.getElementById("score").textContent=score;document.getElementById("lives").textContent=lives;
if(lives<=0){showToast("Game over — refresh to replay");return;}requestAnimationFrame(draw);}
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")basket=Math.max(0,basket-24);if(e.key==="ArrowRight")basket=Math.min(240,basket+24);});
c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();basket=Math.min(240,Math.max(0,(e.clientX-r.left)/r.width*320-40));});
draw();