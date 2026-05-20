function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("in").oninput=()=>{document.getElementById("out").textContent=document.getElementById("in").value.split("").reverse().join("");};document.getElementById("in").dispatchEvent(new Event("input"));