/**
 * NestRun — classic snake with polish.
 */
const BEST_KEY = "nestrun-best";
const GRID = 20;
const CELL = 16;
const W = GRID * CELL;
const H = GRID * CELL;

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const overlay = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const overlayBestEl = document.getElementById("overlay-best");
const newBestEl = document.getElementById("new-best");
const playAgainBtn = document.getElementById("btn-play-again");
const gamePanel = document.getElementById("game-panel");

let snake = [];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let prevSnake = [];
let score = 0;
let bestScore = 0;
let gameOver = false;
let stepMs = 140;
let lastStepTime = 0;
let stepProgress = 1;
let particles = [];
let bgPhase = 0;
let touchStart = null;

const KEY_MAP = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
};

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function loadBest() {
  try {
    bestScore = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch {
    bestScore = 0;
  }
  if (bestScoreEl) bestScoreEl.textContent = String(bestScore);
  if (overlayBestEl) overlayBestEl.textContent = String(bestScore);
}

function saveBest() {
  if (score <= bestScore) return false;
  bestScore = score;
  try {
    localStorage.setItem(BEST_KEY, String(bestScore));
  } catch {
    /* ignore */
  }
  if (bestScoreEl) bestScoreEl.textContent = String(bestScore);
  if (overlayBestEl) overlayBestEl.textContent = String(bestScore);
  return true;
}

function cloneSnake(s) {
  return s.map((p) => ({ x: p.x, y: p.y }));
}

function randomFood() {
  let spot;
  do {
    spot = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === spot.x && s.y === spot.y));
  food = spot;
}

function resetGame() {
  snake = [{ x: 8, y: 8 }];
  prevSnake = cloneSnake(snake);
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  stepMs = 140;
  stepProgress = 1;
  particles = [];
  lastStepTime = performance.now();

  if (scoreEl) scoreEl.textContent = "0";
  randomFood();

  overlay.hidden = true;
  overlay.classList.remove("is-visible");
  if (newBestEl) newBestEl.hidden = true;

  document.body.classList.add("nestrun-playing");
  canvas.focus({ preventScroll: true });
}

function setDirection(nd) {
  if (gameOver) return;
  if (nd.x === -dir.x && nd.y === -dir.y) return;
  nextDir = nd;
}

function handleKeyDown(e) {
  const nd = KEY_MAP[e.key];
  if (!nd) return;
  e.preventDefault();
  e.stopPropagation();
  setDirection(nd);
}

function spawnEatParticles(gx, gy) {
  const cx = gx * CELL + CELL / 2;
  const cy = gy * CELL + CELL / 2;
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const speed = 1.2 + Math.random() * 2.5;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color: Math.random() > 0.5 ? "#ff6b6b" : "#ffd166",
    });
  }
}

function updateParticles(dt) {
  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= dt * 2.2;
    return p.life > 0;
  });
}

function logicStep() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
    endGame();
    return;
  }
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  prevSnake = cloneSnake(snake);
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    if (scoreEl) scoreEl.textContent = String(score);
    spawnEatParticles(food.x, food.y);
    randomFood();
    stepMs = Math.max(75, 140 - score * 3);
  } else {
    snake.pop();
  }
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  document.body.classList.remove("nestrun-playing");

  const isNewBest = saveBest();
  if (finalScoreEl) finalScoreEl.textContent = String(score);
  if (overlayBestEl) overlayBestEl.textContent = String(bestScore);
  if (newBestEl) newBestEl.hidden = !isNewBest;

  overlay.hidden = false;
  overlay.classList.add("is-visible");
  playAgainBtn?.focus({ preventScroll: true });
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, W, H);
  const pulse = Math.sin(bgPhase) * 0.02;
  g.addColorStop(0, `rgb(${10 + pulse * 20}, ${14 + pulse * 10}, ${22})`);
  g.addColorStop(1, `rgb(${6}, ${10}, ${16})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(72, 219, 251, 0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID; i++) {
    const p = i * CELL;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(W, p);
    ctx.stroke();
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawSnake() {
  const t = stepProgress;
  const segments = snake.map((seg, i) => {
    const prev = prevSnake[i] || seg;
    return {
      x: lerp(prev.x, seg.x, t),
      y: lerp(prev.y, seg.y, t),
    };
  });

  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    const px = s.x * CELL + 1;
    const py = s.y * CELL + 1;
    const size = CELL - 2;
    const isHead = i === 0;

    if (isHead) {
      ctx.shadowColor = "rgba(125, 255, 178, 0.55)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#7dffb2";
    } else {
      ctx.shadowBlur = 0;
      const fade = 1 - i / (segments.length + 2);
      ctx.fillStyle = `rgba(46, 204, 113, ${0.45 + fade * 0.5})`;
    }

    roundRect(ctx, px, py, size, size, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (segments.length) {
    const h = segments[0];
    const hx = h.x * CELL + CELL / 2;
    const hy = h.y * CELL + CELL / 2;
    const eyeOff = 3;
    ctx.fillStyle = "#0a0d12";
    if (dir.x !== 0) {
      ctx.beginPath();
      ctx.arc(hx + dir.x * 4, hy - 3, 2, 0, Math.PI * 2);
      ctx.arc(hx + dir.x * 4, hy + 3, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(hx - 3, hy + dir.y * 4, 2, 0, Math.PI * 2);
      ctx.arc(hx + 3, hy + dir.y * 4, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawFood() {
  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  const pulse = 0.85 + Math.sin(bgPhase * 2) * 0.15;

  ctx.shadowColor = "rgba(255, 107, 107, 0.5)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ff6b6b";
  ctx.beginPath();
  ctx.arc(fx, fy, (CELL / 2 - 3) * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function draw() {
  drawBackground();
  drawFood();
  drawSnake();
  drawParticles();
}

function gameLoop(now) {
  bgPhase += 0.016;

  if (!gameOver) {
    if (now - lastStepTime >= stepMs) {
      lastStepTime = now;
      stepProgress = 0;
      logicStep();
    } else {
      stepProgress = Math.min(1, (now - lastStepTime) / stepMs);
    }
    updateParticles(0.016);
  } else {
    updateParticles(0.016);
    stepProgress = 1;
  }

  draw();
  requestAnimationFrame(gameLoop);
}

function bindTouch() {
  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (gameOver) return;
      e.preventDefault();
      const t = e.changedTouches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      if (gameOver || !touchStart) return;
      e.preventDefault();
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      touchStart = null;
      if (Math.hypot(dx, dy) < 18) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else {
        setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    },
    { passive: false }
  );
}

window.addEventListener("keydown", handleKeyDown, { capture: true });

playAgainBtn?.addEventListener("click", () => {
  resetGame();
  showToast("Let's go!");
});

canvas.addEventListener("click", () => {
  if (!gameOver) canvas.focus({ preventScroll: true });
});

gamePanel?.addEventListener("click", (e) => {
  if (e.target.closest("#btn-play-again")) return;
  if (!gameOver) canvas.focus({ preventScroll: true });
});

loadBest();
resetGame();
bindTouch();
requestAnimationFrame(gameLoop);
