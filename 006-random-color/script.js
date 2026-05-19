const swatch = document.getElementById("swatch");
const hexEl = document.getElementById("display");
function pick() {
  const hex = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  swatch.style.background = hex;
  hexEl.textContent = hex.toUpperCase();
}
document.getElementById("btn-action").onclick = pick;
document.getElementById("btn-copy").onclick = () => navigator.clipboard.writeText(hexEl.textContent);
pick();
