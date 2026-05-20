function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const p=+document.getElementById("p").value,t=+document.getElementById("t").value;
const tax=p*t/100;document.getElementById("display").innerHTML="Total: <strong>€"+(p+tax).toFixed(2)+"</strong> (tax €"+tax.toFixed(2)+")";}
["p","t"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();