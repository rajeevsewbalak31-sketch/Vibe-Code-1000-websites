document.getElementById("btn-action").onclick = () => {
  const a = +document.getElementById("min").value || 1, z = +document.getElementById("max").value || 100;
  const lo = Math.min(a, z), hi = Math.max(a, z);
  document.getElementById("display").textContent = lo + Math.floor(Math.random() * (hi - lo + 1));
};
