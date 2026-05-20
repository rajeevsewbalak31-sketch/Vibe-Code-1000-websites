function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const s=+document.getElementById("s").value;const km=(s*0.000762).toFixed(2);
document.getElementById("display").innerHTML="<strong>"+km+"</strong> km walked";}
document.getElementById("s").oninput=calc;calc();