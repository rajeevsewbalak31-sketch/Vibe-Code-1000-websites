function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const km=parseFloat(document.getElementById("km").value)||0,l=parseFloat(document.getElementById("l").value)||0,p=parseFloat(document.getElementById("price").value)||0;
const liters=km*l/100;const cost=liters*p;document.getElementById("display").innerHTML="Fuel: <strong>"+liters.toFixed(1)+" L</strong><br>Cost: <strong>€"+cost.toFixed(2)+"</strong>";}
["km","l","price"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();