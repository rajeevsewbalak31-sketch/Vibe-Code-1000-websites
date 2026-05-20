/** Playable mini-game templates for sites #102–200 */

export const GAME_TEMPLATES = {
  "stack-tower": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Height: <strong id="score">0</strong></span><span id="status">Tap to drop blocks</span></div>
      <div class="game-canvas-wrap"><canvas id="c" width="320" height="400" aria-label="Stack tower"></canvas></div>
      <div class="game-controls"><button type="button" id="btn-drop" class="btn btn--primary">Drop block</button><button type="button" id="btn-reset" class="btn btn--ghost">Reset</button></div>
    </div>`,
    style: `.game-canvas-wrap{min-height:280px}`,
    script: () => `const c=document.getElementById("c"),x=c.getContext("2d");let blocks=[],swing=0,swingDir=1,over=false,w=48;
function draw(){const W=c.width,H=c.height;x.fillStyle="#0a0d12";x.fillRect(0,0,W,H);x.strokeStyle="rgba(255,255,255,.08)";for(let i=0;i<8;i++){x.beginPath();x.moveTo(0,H-i*50);x.lineTo(W,H-i*50);x.stroke();}
blocks.forEach((b,i)=>{x.fillStyle=b.color;x.fillRect(b.x,H-40-i*46,b.w,42);x.strokeStyle="rgba(0,0,0,.3)";x.strokeRect(b.x,H-40-i*46,b.w,42);});
if(!over&&blocks.length<20){const top=blocks[0];const y=30;x.fillStyle="#feca57";const bx=(W-w)/2+Math.sin(swing)*((W-w)/2);x.fillRect(bx,y,w,36);}
document.getElementById("score").textContent=blocks.length;}
function drop(){if(over)return;const W=c.width,H=c.height;const bx=(W-w)/2+Math.sin(swing)*((W-w)/2);
const b={x:bx,w,color:\`hsl(\${(blocks.length*40)%360} 70% 55%)\`};
if(blocks.length){const t=blocks[0];const overlap=Math.min(b.x+b.w,t.x+t.w)-Math.max(b.x,t.x);
if(overlap<w*0.45){over=true;document.getElementById("status").textContent="Tower fell!";showToast("Unbalanced — try again");return;}}
blocks.unshift(b);if(blocks.length>=20){over=true;showToast("You win!");}
draw();}
document.getElementById("btn-drop").onclick=drop;
document.getElementById("btn-reset").onclick=()=>{blocks=[];over=false;swing=0;document.getElementById("status").textContent="Tap to drop blocks";draw();};
(function loop(){swing+=0.06*swingDir;if(swing>1||swing<-1)swingDir*=-1;if(!over)draw();requestAnimationFrame(loop);})();`,
  },

  "catch-fall": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Score: <strong id="score">0</strong></span><span>Lives: <strong id="lives">3</strong></span></div>
      <div class="game-canvas-wrap"><canvas id="c" width="320" height="400"></canvas></div>
      <p class="hint" style="margin-top:.75rem;text-align:center">← → or drag to move basket</p>
    </div>`,
    script: () => `const c=document.getElementById("c"),x=c.getContext("2d");let basket=140,score=0,lives=3,items=[];
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
draw();`,
  },

  "snake-mini": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Score: <strong id="score">0</strong></span></div>
      <div class="game-canvas-wrap"><canvas id="c" width="320" height="320"></canvas></div>
      <p class="hint" style="margin-top:.75rem;text-align:center">Arrow keys or swipe</p>
    </div>`,
    script: () => `const c=document.getElementById("c"),x=c.getContext("2d"),S=16;let snake=[{x:8,y:8}],dir={x:1,y:0},food={x:12,y:8},score=0,over=false;
function rndFood(){food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}
function step(){if(over)return;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
if(h.x<0||h.y<0||h.x>=20||h.y>=20||snake.some(s=>s.x===h.x&&s.y===h.y)){over=true;showToast("Game over");return;}
snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;document.getElementById("score").textContent=score;rndFood();}else snake.pop();
x.fillStyle="#0a0d12";x.fillRect(0,0,320,320);x.fillStyle="#2ecc71";snake.forEach(s=>x.fillRect(s.x*S,s.y*S,S-2,S-2));
x.fillStyle="#e74c3c";x.fillRect(food.x*S,food.y*S,S-2,S-2);}
document.addEventListener("keydown",e=>{const k=e.key;if(k==="ArrowUp"&&dir.y!==1)dir={x:0,y:-1};if(k==="ArrowDown"&&dir.y!==-1)dir={x:0,y:1};
if(k==="ArrowLeft"&&dir.x!==1)dir={x:-1,y:0};if(k==="ArrowRight"&&dir.x!==-1)dir={x:1,y:0};});
setInterval(step,140);`,
  },

  "paddle-break": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Bricks: <strong id="left">0</strong></span><span>Score: <strong id="score">0</strong></span></div>
      <div class="game-canvas-wrap"><canvas id="c" width="320" height="400"></canvas></div>
    </div>`,
    script: () => `const c=document.getElementById("c"),x=c.getContext("2d");let paddle=130,ball={x:160,y:300,vx:3,vy:-3},bricks=[],score=0;
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
draw();`,
  },

  "memory-flip": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Moves: <strong id="moves">0</strong></span><span>Pairs: <strong id="pairs">0</strong>/8</span></div>
      <div id="grid" class="memory-grid"></div>
      <div class="game-controls"><button type="button" id="btn-reset" class="btn btn--ghost">New game</button></div>
    </div>`,
    style: `.memory-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;max-width:20rem;margin:0 auto}
.mem-card{aspect-ratio:1;border-radius:.5rem;border:1px solid var(--border);background:rgba(0,0,0,.35);cursor:pointer;font-size:1.5rem;display:grid;place-items:center;transition:transform .2s}
.mem-card.flipped,.mem-card.matched{background:color-mix(in srgb,var(--accent) 25%,transparent);transform:rotateY(0)}`,
    script: () => `const emojis=["🥚","🐔","🪺","🌾","🧺","🍳","🐣","🪶"];let cards=[],open=[],moves=0,pairs=0,lock=false;
function init(){const vals=[...emojis,...emojis].sort(()=>Math.random()-0.5);cards=vals.map((v,i)=>({id:i,v,ok:false}));
const g=document.getElementById("grid");g.innerHTML="";cards.forEach((card,i)=>{const el=document.createElement("button");el.type="button";el.className="mem-card";el.dataset.i=i;
el.addEventListener("click",()=>flip(i,el));g.appendChild(el);});moves=0;pairs=0;document.getElementById("moves").textContent="0";document.getElementById("pairs").textContent="0";}
function flip(i,el){if(lock||cards[i].ok||open.includes(i))return;if(open.length===1){moves++;document.getElementById("moves").textContent=moves;
const [a]=open;if(cards[a].v===cards[i].v){cards[a].ok=cards[i].ok=true;pairs++;document.getElementById("pairs").textContent=pairs;
document.querySelectorAll(\`.mem-card[data-i="\${a}"],.mem-card[data-i="\${i}"]\`).forEach(e=>e.classList.add("matched"));
open=[];if(pairs===8)showToast("Perfect memory!");return;}lock=true;setTimeout(()=>{document.querySelectorAll(".mem-card").forEach(e=>{if(!cards[e.dataset.i].ok)e.textContent="";});
open=[];lock=false;},600);}open.push(i);el.textContent=cards[i].v;el.classList.add("flipped");}
document.getElementById("btn-reset").onclick=init;init();`,
  },

  "reaction-tap": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Best: <strong id="best">—</strong> ms</span></div>
      <button type="button" id="pad" class="react-pad">Wait for green…</button>
      <div class="game-controls"><button type="button" id="btn-start" class="btn btn--primary">Start round</button></div>
    </div>`,
    style: `.react-pad{width:100%;min-height:10rem;border-radius:.75rem;border:2px solid var(--border);font-size:1.1rem;font-weight:600;font-family:var(--font-ui);cursor:pointer;background:rgba(0,0,0,.35);color:var(--muted)}
.react-pad.is-ready{background:#e74c3c;color:#fff}.react-pad.is-go{background:#2ecc71;color:#0a0d12}`,
    script: () => `let t0=0,state="idle",best=Infinity,timer;
const pad=document.getElementById("pad");
function resetPad(msg,cls){pad.textContent=msg;pad.className="react-pad"+(cls?" "+cls:"");}
document.getElementById("btn-start").onclick=()=>{clearTimeout(timer);state="wait";resetPad("Wait…","is-ready");
const delay=1200+Math.random()*2500;timer=setTimeout(()=>{state="go";t0=performance.now();resetPad("TAP NOW!","is-go");},delay);};
pad.onclick=()=>{if(state==="wait"){clearTimeout(timer);state="idle";resetPad("Too soon!");showToast("Wait for green");return;}
if(state==="go"){const ms=Math.round(performance.now()-t0);if(ms<best){best=ms;document.getElementById("best").textContent=ms;}resetPad(\`\${ms} ms — nice!\`);state="idle";}};`,
  },

  "tap-fly": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Score: <strong id="score">0</strong></span></div>
      <div class="game-canvas-wrap"><canvas id="c" width="320" height="400"></canvas></div>
      <p class="hint" style="margin-top:.75rem;text-align:center">Tap / Space to flap</p>
    </div>`,
    script: () => `const c=document.getElementById("c"),x=c.getContext("2d");let bird={y:200,vy:0},pipes=[],score=0,over=false;
function flap(){if(!over)bird.vy=-6;}
function draw(){x.fillStyle="#0a0d12";x.fillRect(0,0,320,400);if(!over){bird.vy+=0.35;bird.y+=bird.vy;
if(Math.random()<0.02)pipes.push({x:320,gap:120+Math.random()*60,h:60+Math.random()*120});
pipes.forEach((p,i)=>{p.x-=3;x.fillStyle="#55efc4";x.fillRect(p.x,0,40,p.h);x.fillRect(p.x,p.h+p.gap,40,400);
if(p.x<50&&p.x>10&&(bird.y<p.h||bird.y>p.h+p.gap)){over=true;showToast("Crashed!");}
if(p.x<-50){pipes.splice(i,1);score++;document.getElementById("score").textContent=score;}});
x.fillStyle="#feca57";x.beginPath();x.arc(60,bird.y,14,0,7);x.fill();if(bird.y>390||bird.y<0)over=true;}
requestAnimationFrame(draw);}
c.addEventListener("click",flap);document.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();flap();}});draw();`,
  },

  "whack-pop": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Score: <strong id="score">0</strong></span><span>Time: <strong id="time">30</strong>s</span></div>
      <div id="holes" class="whack-grid"></div>
      <div class="game-controls"><button type="button" id="btn-start" class="btn btn--primary">Start</button></div>
    </div>`,
    style: `.whack-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;max-width:16rem;margin:0 auto}
.whack-hole{aspect-ratio:1;border-radius:50%;border:2px solid var(--border);background:rgba(0,0,0,.4);cursor:pointer;position:relative}
.whack-hole.is-up{background:color-mix(in srgb,var(--accent) 40%,transparent)}`,
    script: () => `const holes=document.getElementById("holes");let score=0,time=30,timer,int;
for(let i=0;i<9;i++){const h=document.createElement("button");h.type="button";h.className="whack-hole";h.dataset.i=i;
h.addEventListener("click",()=>{if(h.classList.contains("is-up")){score++;document.getElementById("score").textContent=score;h.classList.remove("is-up");}});holes.appendChild(h);}
document.getElementById("btn-start").onclick=()=>{clearInterval(timer);clearInterval(int);score=0;time=30;document.getElementById("score").textContent="0";
int=setInterval(()=>{document.querySelectorAll(".whack-hole").forEach(h=>h.classList.remove("is-up"));
const up=document.querySelector(\`.whack-hole[data-i="\${Math.floor(Math.random()*9)}"]\`);up.classList.add("is-up");},650);
timer=setInterval(()=>{time--;document.getElementById("time").textContent=time;if(time<=0){clearInterval(int);clearInterval(timer);showToast(\`Time! Score \${score}\`);}},1000);};`,
  },

  "merge-numbers": {
    body: `<div class="game-panel">
      <div class="game-hud"><span>Score: <strong id="score">0</strong></span><span>Best tile: <strong id="best">2</strong></span></div>
      <div id="board" class="merge-board"></div>
      <p class="hint" style="margin-top:.75rem;text-align:center">Arrow keys to slide</p>
    </div>`,
    style: `.merge-board{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;max-width:18rem;margin:0 auto;padding:.5rem;background:rgba(0,0,0,.35);border-radius:.5rem}
.merge-cell{aspect-ratio:1;border-radius:.35rem;background:rgba(255,255,255,.06);display:grid;place-items:center;font-weight:700;font-size:1rem}`,
    script: () => `let grid=Array.from({length:4},()=>[0,0,0,0]),score=0;
function add(){const empty=[];grid.forEach((r,y)=>r.forEach((v,x)=>{if(!v)empty.push([y,x]);}));if(!empty.length)return;
const [y,x]=empty[Math.floor(Math.random()*empty.length)];grid[y][x]=Math.random()<0.9?2:4;}
function render(){const b=document.getElementById("board");b.innerHTML="";let best=2;
grid.forEach(row=>row.forEach(v=>{const d=document.createElement("div");d.className="merge-cell";d.textContent=v||"";if(v){d.style.background="color-mix(in srgb,var(--accent) "+Math.min(90,v/2)+"%,transparent)";best=Math.max(best,v);}b.appendChild(d);}));
document.getElementById("score").textContent=score;document.getElementById("best").textContent=best;}
function slide(dir){/* simplified merge */const old=JSON.stringify(grid);
function line(arr){const f=arr.filter(Boolean);for(let i=0;i<f.length-1;i++)if(f[i]===f[i+1]){f[i]*=2;score+=f[i];f.splice(i+1,1);}while(f.length<4)f.push(0);while(f.length>4)f.pop();return [...f,...Array(4-f.length).fill(0)].slice(0,4);}
if(dir==="left")grid=grid.map(line);if(dir==="right")grid=grid.map(r=>line([...r].reverse()).reverse());
if(dir==="up"){for(let c=0;c<4;c++){const col=line(grid.map(r=>r[c]));for(let r=0;r<4;r++)grid[r][c]=col[r];}}
if(dir==="down"){for(let c=0;c<4;c++){const col=line(grid.map(r=>r[c]).reverse()).reverse();for(let r=0;r<4;r++)grid[r][c]=col[r];}}
if(JSON.stringify(grid)!==old){add();render();}}
document.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();slide(e.key.replace("Arrow","").toLowerCase());}});
add();add();render();`,
  },
};
