function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const c=document.getElementById("c"),x=c.getContext("2d");let paddle=130,ball={x:160,y:300,vx:3,vy:-3},bricks=[],score=0;
for(let r=0;r<5;r++)for(let col=0;col<8;col++)bricks.push({x:col*38+12,y:r*22+40,w:34,h:18,hit:false});
function draw(){x.fillStyle="#0a0d12";x.fillRect(0,0,320,400);bricks.forEach(b=>{if(!b.hit){x.fillStyle="#6c5ce7";x.fillRect(b.x,b.y,b.w,b.h);}});
x.fillStyle="#feca57";x.fillRect(paddle,380,70,10);x.beginPath();x.arc(ball.x,ball.y,8,0,7);x.fillStyle="#fff";x.fill();
ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<8||ball.x>312)ball.vx*=-1;if(ball.y<8)ball.vy*=-1;
if(ball.y>370&&ball.x>paddle&&ball.x<paddle+70)ball.vy=-Math.abs(ball.vy);
bricks.forEach(b=>{if(!b.hit&&ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){b.hit=true;ball.vy*=-1;score+=10;}});
const left=bricks.filter(b=>!b.hit).length;document.getElementById("left").textContent=left;document.getElementById("score").textContent=score;
if(left===0)showToast("You cleared it!");if(ball.y>410)showToast("Ball lost — refresh");requestAnimationFrame(draw);}
c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();paddle=Math.min(250,Math.max(10,(e.clientX-r.left)/r.width*320-35));});
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")paddle=Math.max(10,paddle-20);if(e.key==="ArrowRight")paddle=Math.min(250,paddle+20);});
draw();