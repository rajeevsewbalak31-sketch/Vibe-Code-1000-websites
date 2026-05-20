function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("in").oninput=()=>{document.getElementById("out").textContent=
document.getElementById("in").value.split("").map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");};
document.getElementById("dec").onclick=()=>{try{document.getElementById("in").value=document.getElementById("out").textContent.split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join("");}catch(e){showToast("Invalid");}};
document.getElementById("in").dispatchEvent(new Event("input"));