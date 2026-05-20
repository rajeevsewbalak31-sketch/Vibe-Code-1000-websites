function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const h=document.getElementById("h").value;const css="hsl("+h+" 65% 55%)";
document.getElementById("swatch").style.background=css;document.getElementById("display").textContent=css;}
document.getElementById("h").oninput=upd;upd();