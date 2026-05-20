function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("enc").onclick=()=>{document.getElementById("out").textContent=encodeURIComponent(document.getElementById("in").value);};
document.getElementById("dec").onclick=()=>{try{document.getElementById("out").textContent=decodeURIComponent(document.getElementById("in").value);}catch(e){showToast("Invalid");}};