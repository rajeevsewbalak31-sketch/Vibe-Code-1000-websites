function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function enc(t,s){return t.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+s)%26+b);});}
function upd(){document.getElementById("out").textContent=enc(document.getElementById("in").value,parseInt(document.getElementById("sh").value,10)||3);}
document.getElementById("in").oninput=document.getElementById("sh").oninput=upd;upd();