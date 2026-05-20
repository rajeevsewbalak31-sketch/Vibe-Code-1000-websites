function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
document.getElementById("pwd").oninput=()=>{const p=document.getElementById("pwd").value;let s=0;
if(p.length>=8)s++;if(p.length>=12)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;
const labels=["Weak","Fair","Good","Strong","Excellent"];document.getElementById("fill").style.width=(s*20)+"%";
document.getElementById("display").textContent=labels[s]||"Weak";};