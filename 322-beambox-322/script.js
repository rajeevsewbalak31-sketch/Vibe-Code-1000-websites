function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function uuid(){return crypto.randomUUID();}
function show(){document.getElementById("display").textContent=uuid();}
document.getElementById("btn").onclick=show;document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied");};show();