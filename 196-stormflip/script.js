function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const emojis=["🥚","🐔","🪺","🌾","🧺","🍳","🐣","🪶"];let cards=[],open=[],moves=0,pairs=0,lock=false;
function init(){const vals=[...emojis,...emojis].sort(()=>Math.random()-0.5);cards=vals.map((v,i)=>({id:i,v,ok:false}));
const g=document.getElementById("grid");g.innerHTML="";cards.forEach((card,i)=>{const el=document.createElement("button");el.type="button";el.className="mem-card";el.dataset.i=i;
el.addEventListener("click",()=>flip(i,el));g.appendChild(el);});moves=0;pairs=0;document.getElementById("moves").textContent="0";document.getElementById("pairs").textContent="0";}
function flip(i,el){if(lock||cards[i].ok||open.includes(i))return;if(open.length===1){moves++;document.getElementById("moves").textContent=moves;
const [a]=open;if(cards[a].v===cards[i].v){cards[a].ok=cards[i].ok=true;pairs++;document.getElementById("pairs").textContent=pairs;
document.querySelectorAll(`.mem-card[data-i="${a}"],.mem-card[data-i="${i}"]`).forEach(e=>e.classList.add("matched"));
open=[];if(pairs===8)showToast("Perfect memory!");return;}lock=true;setTimeout(()=>{document.querySelectorAll(".mem-card").forEach(e=>{if(!cards[e.dataset.i].ok)e.textContent="";});
open=[];lock=false;},600);}open.push(i);el.textContent=cards[i].v;el.classList.add("flipped");}
document.getElementById("btn-reset").onclick=init;init();