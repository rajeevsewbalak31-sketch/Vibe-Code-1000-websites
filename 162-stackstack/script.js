function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const c=document.getElementById("c"),x=c.getContext("2d");let bird={y:200,vy:0},pipes=[],score=0,over=false;
function flap(){if(!over)bird.vy=-6;}
function draw(){x.fillStyle="#0a0d12";x.fillRect(0,0,320,400);if(!over){bird.vy+=0.35;bird.y+=bird.vy;
if(Math.random()<0.02)pipes.push({x:320,gap:120+Math.random()*60,h:60+Math.random()*120});
pipes.forEach((p,i)=>{p.x-=3;x.fillStyle="#55efc4";x.fillRect(p.x,0,40,p.h);x.fillRect(p.x,p.h+p.gap,40,400);
if(p.x<50&&p.x>10&&(bird.y<p.h||bird.y>p.h+p.gap)){over=true;showToast("Crashed!");}
if(p.x<-50){pipes.splice(i,1);score++;document.getElementById("score").textContent=score;}});
x.fillStyle="#feca57";x.beginPath();x.arc(60,bird.y,14,0,7);x.fill();if(bird.y>390||bird.y<0)over=true;}
requestAnimationFrame(draw);}
c.addEventListener("click",flap);document.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();flap();}});draw();