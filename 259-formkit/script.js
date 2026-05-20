function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("fmt").onclick=()=>{try{document.getElementById("out").textContent=JSON.stringify(JSON.parse(document.getElementById("raw").value),null,2);showToast("Valid JSON");}catch(e){showToast("Invalid JSON");}};
document.getElementById("min").onclick=()=>{try{document.getElementById("out").textContent=JSON.stringify(JSON.parse(document.getElementById("raw").value));showToast("Minified");}catch(e){showToast("Invalid JSON");}};