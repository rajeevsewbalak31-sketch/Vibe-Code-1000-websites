const d = document.getElementById("display");
document.getElementById("btn-action").onclick = () => {
  const c = Math.min(6, Math.max(1, +document.getElementById("dice-count").value || 2));
  d.textContent = Array.from({ length: c }, () => 1 + Math.floor(Math.random() * 6)).join(" · ");
};
