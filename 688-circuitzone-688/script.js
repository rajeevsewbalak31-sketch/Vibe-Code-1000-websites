function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let iv=null,ctx;document.getElementById("bpm").oninput=()=>{document.getElementById("display").textContent=document.getElementById("bpm").value+" BPM";};
document.getElementById("btn").onclick=()=>{if(iv){clearInterval(iv);iv=null;document.getElementById("btn").textContent="Start";return;}
ctx=ctx||new AudioContext();const bpm=+document.getElementById("bpm").value;const ms=60000/bpm;
iv=setInterval(()=>{const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
o.frequency.value=800;g.gain.value=0.1;o.start();o.stop(ctx.currentTime+0.05);},ms);document.getElementById("btn").textContent="Stop";};