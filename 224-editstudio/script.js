function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const v=parseFloat(document.getElementById("val").value)||0,p=parseFloat(document.getElementById("pct").value)||0;
const part=(v*p/100).toFixed(2);const total=(v+part).toFixed(2);
document.getElementById("display").innerHTML=p+"% of "+v+" = <strong>"+part+"</strong><br>Total: <strong>"+total+"</strong>";}
["val","pct"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();