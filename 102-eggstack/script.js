function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

const c = document.getElementById("c");
const x = c.getContext("2d");
let blocks = [];
let swing = 0;
let swingDir = 1;
let over = false;
let w = 48;
let best = parseInt(localStorage.getItem("eggstack-best") || "0", 10);
document.getElementById("best").textContent = best;

function draw() {
  const W = c.width;
  const H = c.height;
  x.fillStyle = "#0a0d12";
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(255,255,255,.06)";
  for (let i = 0; i < 8; i++) {
    x.beginPath();
    x.moveTo(0, H - i * 50);
    x.lineTo(W, H - i * 50);
    x.stroke();
  }
  blocks.forEach((b, i) => {
    x.fillStyle = b.color;
    const y = H - 40 - i * 46;
    x.fillRect(b.x, y, b.w, 42);
    x.strokeStyle = "rgba(0,0,0,.25)";
    x.strokeRect(b.x, y, b.w, 42);
  });
  if (!over && blocks.length < 20) {
    const bx = (W - w) / 2 + Math.sin(swing) * ((W - w) / 2);
    x.fillStyle = "#feca57";
    x.fillRect(bx, 30, w, 36);
  }
  document.getElementById("score").textContent = blocks.length;
}

function drop() {
  if (over) return;
  const W = c.width;
  const H = c.height;
  const bx = (W - w) / 2 + Math.sin(swing) * ((W - w) / 2);
  const b = { x: bx, w, color: `hsl(${(blocks.length * 40) % 360} 70% 55%)` };
  if (blocks.length) {
    const t = blocks[0];
    const overlap = Math.min(b.x + b.w, t.x + t.w) - Math.max(b.x, t.x);
    if (overlap < w * 0.45) {
      over = true;
      document.getElementById("status").textContent = "Tower fell!";
      showToast("Unbalanced — try again");
      return;
    }
    b.x = Math.max(0, Math.min(W - w, bx));
  }
  blocks.unshift(b);
  if (blocks.length >= 20) {
    over = true;
    showToast("Perfect run!");
  }
  if (blocks.length > best) {
    best = blocks.length;
    localStorage.setItem("eggstack-best", String(best));
    document.getElementById("best").textContent = best;
    showToast("New record!");
  }
  draw();
}

document.getElementById("btn-drop").onclick = drop;
document.getElementById("btn-reset").onclick = () => {
  blocks = [];
  over = false;
  swing = 0;
  document.getElementById("status").textContent = "Space or tap to drop";
  draw();
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    drop();
  }
});

(function loop() {
  swing += 0.06 * swingDir;
  if (swing > 1 || swing < -1) swingDir *= -1;
  if (!over) draw();
  requestAnimationFrame(loop);
})();

draw();
