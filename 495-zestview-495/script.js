function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";s.onload=()=>{};
document.head.appendChild(s);
document.getElementById("btn").onclick=()=>{const v=document.getElementById("in").value;if(typeof QRCode==="undefined"){showToast("Loading library…");return;}
QRCode.toCanvas(document.getElementById("qr"),v,{width:200,margin:1},e=>{if(e)showToast("Error");else showToast("QR ready");});};