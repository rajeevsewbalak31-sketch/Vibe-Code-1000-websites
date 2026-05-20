function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const n=parseInt(document.getElementById("dec").value,10)||0;
document.getElementById("display").innerHTML="Binary: <strong>"+n.toString(2)+"</strong><br>Hex: <strong>0x"+n.toString(16).toUpperCase()+"</strong><br>Octal: <strong>0o"+n.toString(8)+"</strong>";}
document.getElementById("dec").addEventListener("input",upd);upd();