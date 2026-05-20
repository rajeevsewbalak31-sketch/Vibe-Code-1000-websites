function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let ctx,osc;document.getElementById("f").oninput=()=>{document.getElementById("display").textContent=document.getElementById("f").value+" Hz";};
document.getElementById("play").onclick=()=>{ctx=ctx||new AudioContext();if(osc)osc.stop();osc=ctx.createOscillator();osc.frequency.value=document.getElementById("f").value;
osc.connect(ctx.destination);osc.start();};document.getElementById("stop").onclick=()=>{if(osc){osc.stop();osc=null;}};