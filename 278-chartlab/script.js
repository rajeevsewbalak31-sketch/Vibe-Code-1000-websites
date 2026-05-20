function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const inp=document.getElementById("dob");inp.valueAsDate=new Date(2000,0,1);
function calc(){const b=inp.valueAsDate;if(!b)return;const now=new Date();let y=now.getFullYear()-b.getFullYear();let m=now.getMonth()-b.getMonth();let d=now.getDate()-b.getDate();
if(d<0){m--;d+=30;}if(m<0){y--;m+=12;}
document.getElementById("display").innerHTML="<strong>"+y+"</strong> years · <strong>"+m+"</strong> months · <strong>"+d+"</strong> days";}
inp.addEventListener("change",calc);calc();