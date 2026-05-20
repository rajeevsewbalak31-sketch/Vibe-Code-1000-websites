function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const c=document.getElementById("c"),x=c.getContext("2d"),S=16;let snake=[{x:8,y:8}],dir={x:1,y:0},food={x:12,y:8},score=0,over=false;
function rndFood(){food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}
function step(){if(over)return;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
if(h.x<0||h.y<0||h.x>=20||h.y>=20||snake.some(s=>s.x===h.x&&s.y===h.y)){over=true;showToast("Game over");return;}
snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;document.getElementById("score").textContent=score;rndFood();}else snake.pop();
x.fillStyle="#0a0d12";x.fillRect(0,0,320,320);x.fillStyle="#2ecc71";snake.forEach(s=>x.fillRect(s.x*S,s.y*S,S-2,S-2));
x.fillStyle="#e74c3c";x.fillRect(food.x*S,food.y*S,S-2,S-2);}
document.addEventListener("keydown",e=>{const k=e.key;if(k==="ArrowUp"&&dir.y!==1)dir={x:0,y:-1};if(k==="ArrowDown"&&dir.y!==-1)dir={x:0,y:1};
if(k==="ArrowLeft"&&dir.x!==1)dir={x:-1,y:0};if(k==="ArrowRight"&&dir.x!==-1)dir={x:1,y:0};});
setInterval(step,140);