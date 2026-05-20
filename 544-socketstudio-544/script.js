function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function upd(){const m=document.getElementById("meme");
m.innerHTML="<div>"+document.getElementById("top").value.toUpperCase()+"</div><div>"+document.getElementById("bot").value.toUpperCase()+"</div>";}
document.getElementById("top").oninput=document.getElementById("bot").oninput=upd;upd();