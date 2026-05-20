function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function gen(n){const a=[0,1];for(let i=2;i<n;i++)a.push(a[i-1]+a[i-2]);return a.join(", ");}
document.getElementById("c").oninput=()=>{document.getElementById("out").textContent=gen(parseInt(document.getElementById("c").value,10)||10);};
document.getElementById("c").dispatchEvent(new Event("input"));