document.getElementById("btn-action").onclick = () => {
  const n = document.getElementById("note"), t = n.value.trim();
  if (!t) return;
  const li = document.createElement("li");
  li.textContent = t;
  document.getElementById("log").prepend(li);
  n.value = "";
};
