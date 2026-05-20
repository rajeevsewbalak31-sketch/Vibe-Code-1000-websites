function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const k="notes";const n=document.getElementById("note");n.value=localStorage.getItem(k)||"";
n.oninput=()=>localStorage.setItem(k,n.value);