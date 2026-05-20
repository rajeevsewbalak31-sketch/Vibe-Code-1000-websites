function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let t0=0,state="idle",best=Infinity,timer;
const pad=document.getElementById("pad");
function resetPad(msg,cls){pad.textContent=msg;pad.className="react-pad"+(cls?" "+cls:"");}
document.getElementById("btn-start").onclick=()=>{clearTimeout(timer);state="wait";resetPad("Wait…","is-ready");
const delay=1200+Math.random()*2500;timer=setTimeout(()=>{state="go";t0=performance.now();resetPad("TAP NOW!","is-go");},delay);};
pad.onclick=()=>{if(state==="wait"){clearTimeout(timer);state="idle";resetPad("Too soon!");showToast("Wait for green");return;}
if(state==="go"){const ms=Math.round(performance.now()-t0);if(ms<best){best=ms;document.getElementById("best").textContent=ms;}resetPad(`${ms} ms — nice!`);state="idle";}};