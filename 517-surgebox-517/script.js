function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
let va=0,vb=0;function upd(){const t=va+vb||1;document.getElementById("display").innerHTML=
document.getElementById("a").value+": <strong>"+Math.round(100*va/t)+"%</strong><br>"+document.getElementById("b").value+": <strong>"+Math.round(100*vb/t)+"%</strong>";}
document.querySelector('[data-v="a"]').onclick=()=>{va++;upd();};document.querySelector('[data-v="b"]').onclick=()=>{vb++;upd();};