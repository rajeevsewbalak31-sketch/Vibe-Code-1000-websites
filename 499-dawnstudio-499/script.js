function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const b=parseFloat(document.getElementById("bill").value)||0,t=parseFloat(document.getElementById("tip").value)||0,n=Math.max(1,parseInt(document.getElementById("n").value,10));
const tip=b*t/100,tot=b+tip;document.getElementById("display").innerHTML="Each pays <strong>€"+(tot/n).toFixed(2)+"</strong><br>Tip €"+tip.toFixed(2);}
["bill","tip","n"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();