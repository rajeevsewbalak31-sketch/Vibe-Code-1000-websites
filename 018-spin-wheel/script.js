document.getElementById("btn-action").onclick = () => {
  const opts = document.getElementById("options").value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const d = document.getElementById("display");
  if (!opts.length) { d.textContent = "Add options"; return; }
  d.textContent = opts[Math.floor(Math.random() * opts.length)];
};
