function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const em="😀😂🥰😎🤔👍🎉🔥✨🚀💡🎯⭐🌟🎮🎲🎨🎵🍕☕🌈🌙☀️🐱🐶🦊🐸🌸🌻⚡️💎🏆".split("");
const g=document.getElementById("grid");em.forEach(e=>{const b=document.createElement("button");b.textContent=e;b.onclick=()=>{navigator.clipboard.writeText(e);showToast("Copied "+e);};g.appendChild(b);});