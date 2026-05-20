function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
async function h(t){const b=new TextEncoder().encode(t);const d=await crypto.subtle.digest("SHA-256",b);
return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("");}
async function upd(){document.getElementById("out").textContent=await h(document.getElementById("in").value);}
document.getElementById("in").oninput=upd;upd();