/**
 * EggBalance — center-of-mass physics on a tilting egg carton.
 * Invented for Vibe Code 1000 (#101).
 */
const cartonEl = document.getElementById("carton");
const gridEl = document.getElementById("carton-grid");
const trayEl = document.getElementById("tray");
const statusPill = document.getElementById("status-pill");
const eggCountEl = document.getElementById("egg-count");
const tiltFill = document.getElementById("tilt-fill");
const overlay = document.getElementById("overlay");

let rows = 2;
let cols = 2;
let cells = [];
let tipped = false;
let dragEgg = null;
let wobbleRaf = 0;
let displayTiltX = 0;
let displayTiltY = 0;
let targetTiltX = 0;
let targetTiltY = 0;

const SIZES = [
  [2, 2],
  [3, 2],
  [4, 3],
  [6, 4],
  [8, 8],
];

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function maxTiltForGrid() {
  const area = rows * cols;
  if (area <= 4) return 14;
  if (area <= 12) return 11;
  if (area <= 24) return 9;
  return 7;
}

function computePhysics() {
  let w = 0;
  let sx = 0;
  let sy = 0;
  cells.forEach((filled, i) => {
    if (!filled) return;
    const r = Math.floor(i / cols);
    const c = i % cols;
    w += 1;
    sx += c;
    sy += r;
  });
  if (w === 0) {
    return { tiltX: 0, tiltY: 0, stable: true, tipped: false, w: 0 };
  }
  const comX = sx / w;
  const comY = sy / w;
  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const normX = cols > 1 ? (comX - centerX) / centerX : 0;
  const normY = rows > 1 ? (comY - centerY) / centerY : 0;
  const max = maxTiltForGrid();
  const tiltX = normX * max * 1.1;
  const tiltY = -normY * max * 0.85;
  const mag = Math.hypot(tiltX, tiltY);
  const limit = max * (w >= 2 ? 1 : 0);
  const stable = mag <= limit;
  const tippedNow = w >= 2 && mag > limit * 1.05;
  return { tiltX, tiltY, stable, tipped: tippedNow, w, mag, limit };
}

function fillTray() {
  trayEl.innerHTML = "";
  const n = Math.max(12, rows * cols);
  for (let i = 0; i < n; i++) {
    const egg = document.createElement("button");
    egg.type = "button";
    egg.className = "tray-egg";
    egg.setAttribute("aria-label", "Egg from tray");
    egg.addEventListener("pointerdown", (e) => startDrag(e, egg, null));
    trayEl.appendChild(egg);
  }
}

function cupSize() {
  const maxDim = Math.max(rows, cols);
  if (maxDim <= 3) return "2.85rem";
  if (maxDim <= 4) return "2.35rem";
  if (maxDim <= 6) return "1.85rem";
  return "1.35rem";
}

function buildGrid() {
  cells = Array(rows * cols).fill(false);
  gridEl.style.setProperty("--cup-size", cupSize());
  gridEl.style.gridTemplateColumns = `repeat(${cols}, var(--cup-size))`;
  gridEl.innerHTML = "";
  for (let i = 0; i < rows * cols; i++) {
    const cup = document.createElement("button");
    cup.type = "button";
    cup.className = "cup";
    cup.dataset.index = String(i);
    cup.setAttribute("aria-label", `Cup ${Math.floor(i / cols) + 1},${(i % cols) + 1}`);
    cup.addEventListener("click", () => placeEgg(i, cup));
    cup.addEventListener("pointerdown", (e) => {
      if (!cells[i]) return;
      const egg = cup.querySelector(".egg");
      if (egg) startDrag(e, egg, i);
    });
    gridEl.appendChild(cup);
  }
  tipped = false;
  cartonEl.classList.remove("is-tipped");
  fillTray();
  updatePhysics();
}

function placeEgg(index, cup, fromDrag = false) {
  if (tipped || cells[index]) return;
  cells[index] = true;
  cup.classList.add("cup--filled");
  const egg = document.createElement("span");
  egg.className = "egg";
  egg.setAttribute("aria-hidden", "true");
  cup.appendChild(egg);
  egg.classList.add("is-wobble");
  setTimeout(() => egg.classList.remove("is-wobble"), 400);
  if (!fromDrag) updatePhysics();
  else updatePhysics();
}

function removeEgg(index) {
  const cup = gridEl.children[index];
  if (!cup) return;
  cells[index] = false;
  cup.classList.remove("cup--filled");
  cup.innerHTML = "";
}

function updateStatus(phys) {
  eggCountEl.textContent = phys.w;
  const pct = 50 + (phys.tiltX / (maxTiltForGrid() * 1.1)) * 40;
  tiltFill.style.left = `${Math.min(92, Math.max(8, pct))}%`;
  if (phys.tipped || tipped) {
    statusPill.textContent = "Tipped!";
    statusPill.className = "status-pill status-pill--fail";
    tiltFill.classList.add("is-danger");
  } else if (!phys.stable && phys.w >= 2) {
    statusPill.textContent = "Unstable";
    statusPill.className = "status-pill status-pill--warn";
    tiltFill.classList.add("is-danger");
  } else {
    statusPill.textContent = phys.w === 0 ? "Empty" : "Balanced";
    statusPill.className = "status-pill status-pill--ok";
    tiltFill.classList.remove("is-danger");
  }
}

function triggerTip() {
  if (tipped) return;
  tipped = true;
  cartonEl.classList.add("is-tipped");
  targetTiltX = displayTiltX * 2.5 + (Math.random() > 0.5 ? 28 : -28);
  targetTiltY = displayTiltY * 2 + 18;
  overlay.hidden = false;
  overlay.classList.add("is-visible");
  showToast("The carton tipped over!");
}

function updatePhysics() {
  const phys = computePhysics();
  targetTiltX = phys.tiltX;
  targetTiltY = phys.tiltY;
  updateStatus(phys);
  if (phys.tipped && !tipped) triggerTip();
  if (!wobbleRaf) animateTilt();
}

function animateTilt() {
  displayTiltX += (targetTiltX - displayTiltX) * 0.18;
  displayTiltY += (targetTiltY - displayTiltY) * 0.18;
  const wobble = tipped ? 0 : Math.sin(Date.now() / 280) * (Math.hypot(displayTiltX, displayTiltY) * 0.04);
  cartonEl.style.transform = `rotateX(${displayTiltY + wobble}deg) rotateZ(${displayTiltX}deg)`;
  if (Math.abs(targetTiltX - displayTiltX) > 0.05 || Math.abs(targetTiltY - displayTiltY) > 0.05 || !tipped) {
    wobbleRaf = requestAnimationFrame(animateTilt);
  } else {
    wobbleRaf = 0;
  }
}

function startDrag(e, el, cellIndex) {
  if (tipped) return;
  e.preventDefault();
  dragEgg = { el, cellIndex, ghost: el.cloneNode(true) };
  const g = dragEgg.ghost;
  g.style.position = "fixed";
  g.style.zIndex = "100";
  g.style.pointerEvents = "none";
  g.style.width = "2rem";
  g.style.height = "2.5rem";
  g.style.left = `${e.clientX - 16}px`;
  g.style.top = `${e.clientY - 20}px`;
  document.body.appendChild(g);
  if (cellIndex !== null) removeEgg(cellIndex);

  const move = (ev) => {
    g.style.left = `${ev.clientX - 16}px`;
    g.style.top = `${ev.clientY - 20}px`;
  };
  const up = (ev) => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", up);
    g.remove();
    const target = document.elementFromPoint(ev.clientX, ev.clientY);
    const cup = target?.closest?.(".cup");
    if (cup && cup.dataset.index !== undefined) {
      const idx = parseInt(cup.dataset.index, 10);
      if (!cells[idx]) placeEgg(idx, cup, true);
      else fillTray();
    } else if (dragEgg.cellIndex === null) {
      /* returned to tray */
    } else {
      fillTray();
    }
    dragEgg = null;
    updatePhysics();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}

document.querySelectorAll(".size-pick").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".size-pick").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    rows = parseInt(btn.dataset.rows, 10);
    cols = parseInt(btn.dataset.cols, 10);
    overlay.hidden = true;
    overlay.classList.remove("is-visible");
    buildGrid();
  });
});

document.getElementById("btn-reset").addEventListener("click", () => {
  overlay.hidden = true;
  overlay.classList.remove("is-visible");
  displayTiltX = displayTiltY = targetTiltX = targetTiltY = 0;
  buildGrid();
});

document.getElementById("btn-clear").addEventListener("click", () => {
  if (tipped) return;
  buildGrid();
  showToast("Carton cleared");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  overlay.hidden = true;
  overlay.classList.remove("is-visible");
  tipped = false;
  displayTiltX = displayTiltY = targetTiltX = targetTiltY = 0;
  buildGrid();
});

buildGrid();
