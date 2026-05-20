function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const today=new Date().toISOString().slice(0,10);
document.getElementById("a").value=today;document.getElementById("b").value=today;
function calc(){const a=new Date(document.getElementById("a").value),b=new Date(document.getElementById("b").value);
const days=Math.round(Math.abs(b-a)/86400000);document.getElementById("display").innerHTML="<strong>"+days+"</strong> days apart";}
document.getElementById("a").onchange=document.getElementById("b").onchange=calc;calc();