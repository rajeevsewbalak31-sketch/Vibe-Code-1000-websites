function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const suits="♠♥♦♣", ranks="A23456789TJQK";
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=
ranks[Math.floor(Math.random()*13)]+suits[Math.floor(Math.random()*4)];};