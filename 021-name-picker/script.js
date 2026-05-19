document.getElementById("btn-action").onclick = () => {
  const a = document.getElementById("names").value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const d = document.getElementById("display");
  if (!a.length) { d.textContent = "Add names"; return; }
  d.textContent = a[Math.floor(Math.random() * a.length)];
};
