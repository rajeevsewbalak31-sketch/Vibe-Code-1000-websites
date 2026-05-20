function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let grid=Array.from({length:4},()=>[0,0,0,0]),score=0;
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
add();add();render();