function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function tick(){const end=new Date(document.getElementById("ev").value).getTime();
const left=Math.max(0,end-Date.now());const d=Math.floor(left/86400000),h=Math.floor(left%86400000/3600000);
document.getElementById("display").innerHTML="<strong>"+d+"</strong> days · <strong>"+h+"</strong> hours";}
const d=new Date();d.setDate(d.getDate()+30);document.getElementById("ev").value=d.toISOString().slice(0,16);
document.getElementById("ev").onchange=tick;setInterval(tick,1000);tick();