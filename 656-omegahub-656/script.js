function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const p=+document.getElementById("p").value,r=+document.getElementById("r").value/100,y=+document.getElementById("y").value;
const f=p*Math.pow(1+r,y);document.getElementById("display").innerHTML="Future: <strong>€"+f.toFixed(2)+"</strong>";}
["p","r","y"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();