function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const c=document.getElementById("c"),x=c.getContext("2d");let blocks=[],swing=0,swingDir=1,over=false,w=48;
function draw(){const W=c.width,H=c.height;x.fillStyle="#0a0d12";x.fillRect(0,0,W,H);x.strokeStyle="rgba(255,255,255,.08)";for(let i=0;i<8;i++){x.beginPath();x.moveTo(0,H-i*50);x.lineTo(W,H-i*50);x.stroke();}
blocks.forEach((b,i)=>{x.fillStyle=b.color;x.fillRect(b.x,H-40-i*46,b.w,42);x.strokeStyle="rgba(0,0,0,.3)";x.strokeRect(b.x,H-40-i*46,b.w,42);});
if(!over&&blocks.length<20){const top=blocks[0];const y=30;x.fillStyle="#feca57";const bx=(W-w)/2+Math.sin(swing)*((W-w)/2);x.fillRect(bx,y,w,36);}
document.getElementById("score").textContent=blocks.length;}
function drop(){if(over)return;const W=c.width,H=c.height;const bx=(W-w)/2+Math.sin(swing)*((W-w)/2);
const b={x:bx,w,color:`hsl(${(blocks.length*40)%360} 70% 55%)`};
if(blocks.length){const t=blocks[0];const overlap=Math.min(b.x+b.w,t.x+t.w)-Math.max(b.x,t.x);
if(overlap<w*0.45){over=true;document.getElementById("status").textContent="Tower fell!";showToast("Unbalanced — try again");return;}}
blocks.unshift(b);if(blocks.length>=20){over=true;showToast("You win!");}
draw();}
document.getElementById("btn-drop").onclick=drop;
document.getElementById("btn-reset").onclick=()=>{blocks=[];over=false;swing=0;document.getElementById("status").textContent="Tap to drop blocks";draw();};
(function loop(){swing+=0.06*swingDir;if(swing>1||swing<-1)swingDir*=-1;if(!over)draw();requestAnimationFrame(loop);})();