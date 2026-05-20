function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const row=document.getElementById("row");
document.querySelectorAll("[data-j]").forEach(b=>b.onclick=()=>{row.style.justifyContent=b.dataset.j;});
document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{row.style.flexDirection=b.dataset.d;});