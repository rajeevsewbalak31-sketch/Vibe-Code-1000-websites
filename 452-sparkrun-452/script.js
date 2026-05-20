function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const phrase="the quick brown fox jumps over the lazy dog and vibes with code";
let t0=0,timer=null;document.getElementById("btn").onclick=()=>{const inp=document.getElementById("in");inp.disabled=false;inp.value="";inp.focus();t0=Date.now();
document.getElementById("display").textContent="Go!";clearInterval(timer);timer=setInterval(()=>{const left=30-Math.floor((Date.now()-t0)/1000);
if(left<=0){clearInterval(timer);inp.disabled=true;const words=inp.value.trim().split(/\s+/).filter(Boolean).length;
document.getElementById("display").innerHTML="<strong>"+Math.round(words*2)+" WPM</strong>";return;}
document.getElementById("display").textContent=left+"s left";},200);};