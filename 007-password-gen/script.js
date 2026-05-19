const d = document.getElementById("display");
const ch = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
function gen() {
  const n = Math.min(64, Math.max(8, +document.getElementById("pwd-len").value || 16));
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  d.textContent = Array.from(a, (x) => ch[x % ch.length]).join("");
}
document.getElementById("btn-action").onclick = gen;
document.getElementById("btn-copy").onclick = () => navigator.clipboard.writeText(d.textContent);
gen();
