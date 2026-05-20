function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const p=parseFloat(document.getElementById("p").value)||0,d=parseFloat(document.getElementById("d").value)||0;
const sale=p*(1-d/100);document.getElementById("display").innerHTML="Sale: <strong>€"+sale.toFixed(2)+"</strong><br>You save €"+(p-sale).toFixed(2);}
["p","d"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();