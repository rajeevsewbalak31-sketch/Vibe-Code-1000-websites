function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const w=document.getElementById("wake");const n=new Date();w.value=n.getHours().toString().padStart(2,"0")+":"+n.getMinutes().toString().padStart(2,"0");
function calc(){const [h,m]=document.getElementById("wake").value.split(":").map(Number);
const beds=[];for(let c of [90,60,30]){const d=new Date();d.setHours(h,m-c*6-15,0,0);
beds.push(d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}));}
document.getElementById("display").innerHTML="Try sleeping at:<br><strong>"+beds.join("</strong><br><strong>")+"</strong>";}
document.getElementById("wake").onchange=calc;calc();