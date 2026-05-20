function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

const PRESETS = [
  ["#6c5ce7", "#a29bfe"],
  ["#00b894", "#55efc4"],
  ["#e17055", "#fdcb6e"],
  ["#0984e3", "#74b9ff"],
  ["#2d3436", "#636e72"],
];

const presetsEl = document.getElementById("presets");
PRESETS.forEach(([a, b], i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "preset-swatch";
  btn.style.background = `linear-gradient(135deg, ${a}, ${b})`;
  btn.title = "Preset " + (i + 1);
  btn.addEventListener("click", () => {
    document.getElementById("c1").value = a;
    document.getElementById("c2").value = b;
    upd();
  });
  presetsEl.appendChild(btn);
});

function upd() {
  const a = document.getElementById("c1").value;
  const b = document.getElementById("c2").value;
  const ang = document.getElementById("ang").value;
  const type = document.getElementById("type").value;
  document.getElementById("ang-val").textContent = ang;
  const css =
    type === "radial"
      ? `background: radial-gradient(circle at center, ${a}, ${b});`
      : `background: linear-gradient(${ang}deg, ${a}, ${b});`;
  document.getElementById("prev").style.background = css.replace("background: ", "");
  document.getElementById("out").textContent = css;
}

["c1", "c2", "ang", "type"].forEach((id) =>
  document.getElementById(id).addEventListener("input", upd)
);

document.getElementById("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("out").textContent);
    showToast("CSS copied");
  } catch {
    showToast("Copy failed");
  }
};

document.getElementById("random").onclick = () => {
  document.getElementById("c1").value =
    "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  document.getElementById("c2").value =
    "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  document.getElementById("ang").value = Math.floor(Math.random() * 360);
  upd();
};

upd();
