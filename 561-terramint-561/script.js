function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("btn").onclick=()=>{const names=document.getElementById("names").value.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);
const t=Math.max(2,parseInt(document.getElementById("t").value,10));const teams=Array.from({length:t},()=>[]);
names.sort(()=>Math.random()-0.5).forEach((n,i)=>teams[i%t].push(n));
document.getElementById("out").textContent=teams.map((tm,i)=>"Team "+(i+1)+": "+tm.join(", ")).join("\n");};