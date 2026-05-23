/**
 * EggBalance 3D — Three.js center-of-mass tray physics.
 */
import * as THREE from "three";

const DEG = Math.PI / 180;
const SOUND_KEY = "eggbalance-sound";
const HIGH_SCORE_KEY = "eggbalance-best";
const CUP_GAP = 0.52;

// --- DOM ---
const canvas = document.getElementById("game-canvas");
const viewport = document.getElementById("viewport");
const gamePanel = document.getElementById("game-panel");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const eggCountEl = document.getElementById("egg-count");
const statusPill = document.getElementById("status-pill");
const tiltFill = document.getElementById("tilt-fill");
const tiltMeter = document.querySelector(".tilt-meter");
const moveFeedback = document.getElementById("move-feedback");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayRecord = document.getElementById("overlay-record");
const overlayMsg = document.getElementById("overlay-msg");
const overlayScore = document.getElementById("overlay-score");
const overlayBest = document.getElementById("overlay-best");
const btnPause = document.getElementById("btn-pause");
const btnSound = document.getElementById("btn-sound");

// --- State ---
let rows = 2;
let cols = 2;
let cells = [];
let cupMeshes = [];
let visualCups = [];
let eggMeshes = [];

let tipped = false;
let collapsing = false;
let paused = false;
let soundOn = false;
let audioCtx = null;
let feedbackTimer = 0;

let survivalStart = 0;
let survivalActive = false;
let pauseAccumulated = 0;
let pauseStartedAt = 0;
let difficultyLevel = 0;
let lastDifficultyAnnounced = -1;
let highScore = 0;
let scoreRaf = 0;

let targetRotX = 0;
let targetRotZ = 0;
let displayRotX = 0;
let displayRotZ = 0;

let fallingEggs = [];
let pointerDown = false;
let dragMoved = false;
let dragDistance = 0;
let lastPointer = { x: 0, y: 0 };
let camYaw = 0.55;
let camPitch = 0.42;
let camDist = 7.2;
let dangerRatio = 0;
let nearFailActive = false;
let lastWarnAt = 0;
let lastSqueakAt = 0;
let collapseTime = 0;

// --- Three.js ---
let renderer;
let scene;
let camera;
let trayGroup;
let cupGroup;
let eggGroup;
let tableMesh;
let raycaster;
let pointerNdc = new THREE.Vector2();
let animId = 0;
let clock = new THREE.Clock();

const matCarton = new THREE.MeshLambertMaterial({ color: 0xc4a574 });
const matCartonDark = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
const matCup = new THREE.MeshLambertMaterial({ color: 0x6b4e28 });
const matCupHover = new THREE.MeshLambertMaterial({ color: 0x9a7040 });
const matEgg = new THREE.MeshLambertMaterial({ color: 0xfff8e7 });
const matEggStress = new THREE.MeshLambertMaterial({ color: 0xffe0b0 });
const matEggCrack = new THREE.MeshLambertMaterial({ color: 0xe8a060 });

const FUNNY_LOSS = [
  "The eggs have left the chat.",
  "So close. So yolked.",
  "Gravity wins again.",
  "That carton had zero chill.",
  "Egg-scuse me?!",
];

// --- Audio / UI helpers ---
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function initAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx?.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration, type = "sine", gain = 0.08) {
  if (!soundOn || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playSound(kind) {
  if (!soundOn) return;
  initAudio();
  if (kind === "place") playTone(520, 0.08, "sine", 0.06);
  else if (kind === "perfect") {
    playTone(660, 0.06, "sine", 0.07);
    setTimeout(() => playTone(880, 0.1, "sine", 0.06), 60);
  }   else if (kind === "warn") playTone(280, 0.12, "triangle", 0.05);
  else if (kind === "squeak") {
    playTone(920, 0.05, "sine", 0.05);
    setTimeout(() => playTone(780, 0.07, "sine", 0.04), 40);
  } else if (kind === "panic") {
    playTone(340, 0.08, "square", 0.04);
    setTimeout(() => playTone(420, 0.08, "square", 0.04), 70);
    setTimeout(() => playTone(380, 0.1, "square", 0.03), 140);
  } else if (kind === "boing") playTone(180, 0.14, "sine", 0.06);
  else if (kind === "splat") {
    playTone(140, 0.06, "sawtooth", 0.07);
    setTimeout(() => playTone(80, 0.2, "triangle", 0.05), 50);
  } else if (kind === "tip") playTone(120, 0.35, "sawtooth", 0.07);
  else if (kind === "click") playTone(400, 0.04, "sine", 0.04);
  else if (kind === "level") {
    playTone(440, 0.06, "sine", 0.05);
    setTimeout(() => playTone(554, 0.08, "sine", 0.05), 70);
  } else if (kind === "gameover") {
    playTone(90, 0.2, "sawtooth", 0.08);
    setTimeout(() => playTone(55, 0.45, "triangle", 0.06), 100);
  } else if (kind === "record") {
    playTone(523, 0.1, "sine", 0.07);
    setTimeout(() => playTone(784, 0.14, "sine", 0.08), 150);
  }
}

function formatTime(seconds) {
  const s = Math.max(0, seconds);
  if (s >= 60) {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  }
  return `${s.toFixed(1)}s`;
}

function loadHighScore() {
  try {
    highScore = parseFloat(localStorage.getItem(HIGH_SCORE_KEY) || "0") || 0;
  } catch {
    highScore = 0;
  }
  if (highScoreEl) highScoreEl.textContent = formatTime(highScore);
}

function saveHighScore(seconds) {
  if (seconds <= highScore) return false;
  highScore = seconds;
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(seconds));
  } catch {
    /* ignore */
  }
  if (highScoreEl) {
    highScoreEl.textContent = formatTime(highScore);
    highScoreEl.classList.remove("high-score-pop");
    void highScoreEl.offsetWidth;
    highScoreEl.classList.add("high-score-pop");
  }
  return true;
}

function getSurvivalSeconds() {
  if (!survivalActive || !survivalStart) return 0;
  let elapsed = performance.now() - survivalStart - pauseAccumulated;
  if (paused && pauseStartedAt) elapsed -= performance.now() - pauseStartedAt;
  return Math.max(0, elapsed / 1000);
}

function startSurvivalClock() {
  if (survivalActive) return;
  survivalActive = true;
  survivalStart = performance.now();
  pauseAccumulated = 0;
  pauseStartedAt = 0;
  difficultyLevel = 0;
  lastDifficultyAnnounced = -1;
  startScoreLoop();
}

function stopScoreLoop() {
  if (scoreRaf) cancelAnimationFrame(scoreRaf);
  scoreRaf = 0;
}

function resetSurvivalClock() {
  survivalActive = false;
  survivalStart = 0;
  pauseAccumulated = 0;
  pauseStartedAt = 0;
  difficultyLevel = 0;
  lastDifficultyAnnounced = -1;
  stopScoreLoop();
}

function startScoreLoop() {
  if (scoreRaf) return;
  const tick = () => {
    if (!survivalActive || tipped) {
      scoreRaf = 0;
      return;
    }
    updateLiveScore();
    scoreRaf = requestAnimationFrame(tick);
  };
  scoreRaf = requestAnimationFrame(tick);
}

function getDifficultyLevel() {
  return Math.floor(getSurvivalSeconds() / 10);
}

function getWobbleScale() {
  return 1 + getDifficultyLevel() * 0.5;
}

function getWobbleIntensity() {
  const diff = getDifficultyLevel();
  const base = 1 + diff * 0.45;
  return base * (1 + dangerRatio * 1.8);
}

function updateLiveScore() {
  const sec = getSurvivalSeconds();
  const level = getDifficultyLevel();
  if (level !== difficultyLevel) {
    difficultyLevel = level;
    if (level > lastDifficultyAnnounced && level > 0) {
      lastDifficultyAnnounced = level;
      showMoveFeedback(`Level ${level + 1} — extra wobble!`, "move-feedback--warn");
      playSound("level");
      vibrate(12);
    }
  }
  if (scoreEl) {
    scoreEl.textContent = formatTime(sec);
    scoreEl.classList.toggle("score-value--hot", sec >= 30);
  }
}

function setScoreDisplay(seconds) {
  if (scoreEl) scoreEl.textContent = formatTime(seconds);
}

function showMoveFeedback(text, cls) {
  clearTimeout(feedbackTimer);
  moveFeedback.textContent = text;
  moveFeedback.className = `move-feedback ${cls} is-visible`;
  feedbackTimer = setTimeout(() => moveFeedback.classList.remove("is-visible"), 900);
}

function maxTiltForGrid() {
  const area = rows * cols;
  if (area <= 4) return 22;
  if (area <= 8) return 18;
  if (area <= 12) return 15;
  return 12;
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
    return { tiltX: 0, tiltY: 0, stable: true, tipped: false, w: 0, mag: 0, limit: 0, danger: 0 };
  }
  const comX = sx / w;
  const comY = sy / w;
  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const normX = cols > 1 ? (comX - centerX) / centerX : 0;
  const normY = rows > 1 ? (comY - centerY) / centerY : 0;
  const max = maxTiltForGrid();
  const tiltX = normX * max * 1.12;
  const tiltY = -normY * max * 0.95;
  const mag = Math.hypot(tiltX, tiltY);
  const limit = max * (w >= 2 ? 0.9 : 0);
  const stable = mag <= limit * 0.88;
  const tippedNow = w >= 2 && mag > limit * 1.0;
  const danger = limit > 0 ? Math.min(1.4, mag / limit) : 0;
  return { tiltX, tiltY, stable, tipped: tippedNow, w, mag, limit, danger };
}

function cupOffsetFromCenter(index) {
  const r = Math.floor(index / cols);
  const c = index % cols;
  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const nx = cols > 1 ? (c - centerX) / centerX : 0;
  const ny = rows > 1 ? (r - centerY) / centerY : 0;
  return Math.hypot(nx, ny);
}

function ratePlacement(index, before, after) {
  if (after.tipped) return { text: "Too far!", cls: "move-feedback--bad" };
  const offset = cupOffsetFromCenter(index);
  if (offset < 0.25 && after.stable) return { text: "Perfect!", cls: "move-feedback--perfect" };
  if (offset >= 0.65) return { text: "Too far!", cls: "move-feedback--bad" };
  if (!after.stable) return { text: "Risky…", cls: "move-feedback--warn" };
  return { text: "Nice!", cls: "move-feedback--good" };
}

function gridCenter() {
  const w = (cols - 1) * CUP_GAP;
  const d = (rows - 1) * CUP_GAP;
  return { x: -w / 2, z: -d / 2 };
}

function cellPosition(index) {
  const r = Math.floor(index / cols);
  const c = index % cols;
  const o = gridCenter();
  return new THREE.Vector3(o.x + c * CUP_GAP, 0, o.z + r * CUP_GAP);
}

// --- Three.js setup ---
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121820);
  scene.fog = new THREE.Fog(0x121820, 8, 22);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  updateCamera();

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  resizeRenderer();

  const hemi = new THREE.HemisphereLight(0xfff4e6, 0x2a3040, 0.85);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.65);
  dir.position.set(4, 8, 5);
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xa8c4ff, 0.25);
  fill.position.set(-3, 4, -2);
  scene.add(fill);

  const tableGeo = new THREE.BoxGeometry(14, 0.2, 14);
  const tableMat = new THREE.MeshLambertMaterial({ color: 0x1e2633 });
  tableMesh = new THREE.Mesh(tableGeo, tableMat);
  tableMesh.position.y = -0.35;
  scene.add(tableMesh);

  trayGroup = new THREE.Group();
  trayGroup.position.y = 0.05;
  scene.add(trayGroup);

  cupGroup = new THREE.Group();
  eggGroup = new THREE.Group();
  trayGroup.add(cupGroup, eggGroup);

  raycaster = new THREE.Raycaster();

  window.addEventListener("resize", resizeRenderer);
  bindPointer();
  animate();
}

function resizeRenderer() {
  if (!renderer || !viewport) return;
  const w = viewport.clientWidth;
  const h = viewport.clientHeight;
  if (w < 1 || h < 1) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function updateCamera() {
  const look = new THREE.Vector3(0, 0.15, 0);
  const x = look.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  const y = look.y + Math.sin(camPitch) * camDist + 1.2;
  const z = look.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  camera.position.set(x, y, z);
  camera.lookAt(look);
}

function clearTrayMeshes() {
  cupMeshes = [];
  visualCups = [];
  eggMeshes = [];
  fallingEggs = [];
  while (cupGroup.children.length) cupGroup.remove(cupGroup.children[0]);
  while (eggGroup.children.length) eggGroup.remove(eggGroup.children[0]);
  const keep = new Set([cupGroup, eggGroup]);
  [...trayGroup.children].forEach((child) => {
    if (!keep.has(child)) trayGroup.remove(child);
  });
}

function buildTrayBase() {
  const w = (cols - 1) * CUP_GAP + 0.9;
  const d = (rows - 1) * CUP_GAP + 0.9;
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, d), matCarton);
  base.position.y = -0.08;
  trayGroup.add(base);

  const rim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.12, d + 0.08), matCartonDark);
  rim.position.y = 0.02;
  trayGroup.add(rim);

  const wallT = 0.08;
  const wallH = 0.35;
  const walls = [
    [w, wallH, wallT, 0, wallH / 2, -d / 2 - wallT / 2],
    [w, wallH, wallT, 0, wallH / 2, d / 2 + wallT / 2],
    [wallT, wallH, d, -w / 2 - wallT / 2, wallH / 2, 0],
    [wallT, wallH, d, w / 2 + wallT / 2, wallH / 2, 0],
  ];
  walls.forEach(([gw, gh, gd, px, py, pz]) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(gw, gh, gd), matCartonDark);
    wall.position.set(px, py, pz);
    trayGroup.add(wall);
  });
}

function buildGrid() {
  clearTrayMeshes();
  cells = Array(rows * cols).fill(false);
  eggMeshes = Array(rows * cols).fill(null);
  visualCups = Array(rows * cols).fill(null);
  tipped = false;
  collapsing = false;
  dangerRatio = 0;
  nearFailActive = false;
  lastWarnAt = 0;
  lastSqueakAt = 0;
  collapseTime = 0;
  displayRotX = displayRotZ = targetRotX = targetRotZ = 0;
  trayGroup.rotation.set(0, 0, 0);
  viewport?.classList.remove("viewport--danger", "viewport--panic", "viewport--collapse");

  buildTrayBase();

  const cupGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.14, 12);
  const cupHole = new THREE.CylinderGeometry(0.17, 0.14, 0.15, 12);

  for (let i = 0; i < rows * cols; i++) {
    const pos = cellPosition(i);
    const cup = new THREE.Mesh(cupGeo, matCup.clone());
    cup.position.set(pos.x, 0.06, pos.z);
    cup.userData = { index: i, type: "cup" };
    cupGroup.add(cup);
    visualCups[i] = cup;

    const hitPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitPad.position.set(pos.x, 0.28, pos.z);
    hitPad.userData = { index: i, type: "cup" };
    cupGroup.add(hitPad);
    cupMeshes.push(hitPad);

    const ring = new THREE.Mesh(cupHole, new THREE.MeshLambertMaterial({
      color: 0x3d2a18,
      transparent: true,
      opacity: 0.35,
    }));
    ring.position.copy(cup.position);
    ring.position.y = 0.08;
    cupGroup.add(ring);
  }

  const area = rows * cols;
  camDist = area <= 4 ? 5.5 : area <= 8 ? 6.2 : area <= 12 ? 7 : 8.5;
  updateCamera();
  updatePhysics();
}

function makeEggMesh() {
  const egg = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), matEgg.clone());
  egg.scale.set(1, 1.22, 1);
  egg.userData.stress = 0;
  return egg;
}

function placeEgg(index) {
  if (paused || tipped || collapsing || cells[index]) return;

  const before = computePhysics();
  cells[index] = true;

  const pos = cellPosition(index);
  const egg = makeEggMesh();
  egg.position.set(pos.x, 1.2, pos.z);
  egg.userData = { index, settled: false };
  eggGroup.add(egg);
  eggMeshes[index] = egg;

  const drop = { egg, index, t: 0, duration: 0.32 };
  const animateDrop = () => {
    if (tipped) return;
    drop.t += clock.getDelta();
    const p = Math.min(1, drop.t / drop.duration);
    const ease = 1 - (1 - p) ** 3;
    egg.position.y = 1.2 + (0.2 - 1.2) * ease;
    if (p < 1) requestAnimationFrame(animateDrop);
    else {
      egg.userData.settled = true;
      egg.userData.basePos = pos.clone();
      egg.userData.basePos.y = 0.2;
      egg.position.copy(egg.userData.basePos);
      const after = computePhysics();
      const rating = ratePlacement(index, before, after);
      if (!survivalActive) startSurvivalClock();
      showMoveFeedback(rating.text, rating.cls);
      playSound(rating.cls === "move-feedback--perfect" ? "perfect" : "place");
      vibrate(rating.cls === "move-feedback--perfect" ? 18 : 10);
      if (scoreEl) {
        scoreEl.classList.remove("score-bump");
        void scoreEl.offsetWidth;
        scoreEl.classList.add("score-bump");
      }
      updatePhysics();
    }
  };
  requestAnimationFrame(animateDrop);
}

function updateStatus(phys) {
  eggCountEl.textContent = phys.w;
  dangerRatio = phys.danger || 0;
  const max = maxTiltForGrid();
  const pct = 50 + (phys.tiltX / max) * 40;
  const clamped = Math.min(92, Math.max(8, pct));
  tiltFill.style.left = `${clamped}%`;
  if (tiltMeter) tiltMeter.setAttribute("aria-valuenow", String(Math.round(clamped)));

  viewport?.classList.toggle("viewport--danger", dangerRatio > 0.72 && !tipped);
  viewport?.classList.toggle("viewport--panic", dangerRatio > 0.88 && !tipped);

  if (phys.tipped || tipped) {
    statusPill.textContent = "NOOO!";
    statusPill.className = "status-pill status-pill--fail";
    tiltFill.classList.add("is-danger");
  } else if (dangerRatio > 0.88) {
    statusPill.textContent = "Cracking!";
    statusPill.className = "status-pill status-pill--fail";
    tiltFill.classList.add("is-danger");
  } else if (dangerRatio > 0.72 || (!phys.stable && phys.w >= 2)) {
    statusPill.textContent = "Wobbly!";
    statusPill.className = "status-pill status-pill--warn";
    tiltFill.classList.add("is-danger");
  } else {
    statusPill.textContent = phys.w === 0 ? "Empty" : "Balanced";
    statusPill.className = "status-pill status-pill--ok";
    tiltFill.classList.remove("is-danger");
  }
}

function updateNearFail(phys, t) {
  if (tipped || collapsing || paused || phys.w < 2) return;

  const now = performance.now();
  if (dangerRatio > 0.72 && now - lastWarnAt > 900) {
    lastWarnAt = now;
    playSound("boing");
    vibrate(8);
    if (dangerRatio > 0.88) showMoveFeedback("Uh oh…", "move-feedback--bad");
    else if (dangerRatio > 0.8) showMoveFeedback("Wobble!", "move-feedback--warn");
  }
  if (dangerRatio > 0.85 && now - lastSqueakAt > 450) {
    lastSqueakAt = now;
    playSound("squeak");
    vibrate([6, 20, 6]);
  }
  if (dangerRatio > 0.92 && !nearFailActive) {
    nearFailActive = true;
    playSound("panic");
    showMoveFeedback("Don't move!", "move-feedback--bad");
  } else if (dangerRatio < 0.78) {
    nearFailActive = false;
  }

  eggMeshes.forEach((egg, i) => {
    if (!egg || !cells[i] || !egg.userData.settled) return;
    const stress = Math.max(0, (dangerRatio - 0.65) / 0.35);
    egg.userData.stress = stress;
    if (stress > 0.15) {
      egg.material = stress > 0.55 ? matEggStress : matEgg;
      egg.scale.set(
        1 + stress * 0.08,
        1.22 - stress * 0.25,
        1 + stress * 0.06
      );
    }
  });
}

function jiggleEggs(t, intensity) {
  eggMeshes.forEach((egg, i) => {
    if (!egg || !cells[i] || !egg.userData.settled || !egg.userData.basePos) return;
    const base = egg.userData.basePos;
    const edge = cupOffsetFromCenter(i);
    const amp = (0.015 + intensity * 0.045) * (1 + edge * 0.6);
    const stress = egg.userData.stress || 0;
    egg.position.x = base.x + Math.sin(t * (14 + stress * 8) + i * 1.7) * amp;
    egg.position.z = base.z + Math.cos(t * (12 + stress * 6) + i * 2.1) * amp;
    egg.position.y = base.y + Math.abs(Math.sin(t * (18 + stress * 10) + i)) * amp * 0.5;
    egg.rotation.x = Math.sin(t * 11 + i) * 0.12 * intensity;
    egg.rotation.z = Math.cos(t * 9 + i * 1.3) * 0.18 * intensity * (1 + edge);
  });
}

function launchEgg(i, power = 1) {
  const egg = eggMeshes[i];
  if (!egg || !cells[i]) return;
  fallingEggs.push({
    mesh: egg,
    vx: (Math.random() - 0.5) * 5 * power + displayRotZ * 12,
    vy: 0.6 + Math.random() * 1.2 * power,
    vz: (Math.random() - 0.5) * 5 * power - displayRotX * 12,
    rot: (Math.random() - 0.5) * 14,
    cracked: false,
    splatted: false,
  });
  egg.material = matEggCrack.clone();
  egg.scale.set(1.15, 0.7, 1.1);
  eggMeshes[i] = null;
  cells[i] = false;
}

function triggerGameOver() {
  if (tipped || collapsing) return;
  tipped = true;
  collapsing = true;
  collapseTime = 0;

  const finalTime = getSurvivalSeconds();
  stopScoreLoop();
  setScoreDisplay(finalTime);

  playSound("panic");
  playSound("tip");
  vibrate([15, 40, 20, 60, 30]);
  gamePanel.classList.add("is-shake");
  viewport?.classList.add("viewport--collapse");

  const previousBest = highScore;
  const isRecord = finalTime > highScore;
  if (isRecord) saveHighScore(finalTime);

  targetRotX *= 2.4;
  targetRotZ *= 2.4;

  const funnyMsg = FUNNY_LOSS[Math.floor(Math.random() * FUNNY_LOSS.length)];

  setTimeout(() => {
    playSound("gameover");
    playSound("splat");
    gamePanel.classList.add("is-shake");
    setTimeout(() => gamePanel.classList.remove("is-shake"), 620);
  }, 350);

  setTimeout(() => {
    eggMeshes.forEach((_, i) => {
      if (cells[i]) setTimeout(() => launchEgg(i, 1.2 + Math.random() * 0.6), i * 70);
    });
  }, 200);

  setTimeout(() => {
    overlay.hidden = false;
    overlay.classList.add("is-visible");
    overlay.classList.toggle("overlay-tip--record", isRecord);
    viewport?.classList.remove("viewport--danger", "viewport--panic", "viewport--collapse");
    gamePanel.classList.remove("is-shake");

    if (overlayTitle) overlayTitle.textContent = isRecord ? "New record!" : "Total yolkage!";
    if (overlayRecord) overlayRecord.hidden = !isRecord;
    if (overlayMsg) {
      overlayMsg.textContent = isRecord
        ? "You wobbled longer than ever. Legend."
        : funnyMsg;
    }
    overlayScore.textContent = `Survived ${formatTime(finalTime)}`;
    if (overlayBest) {
      overlayBest.textContent = isRecord
        ? `Previous best: ${formatTime(previousBest)}`
        : `Personal best: ${formatTime(highScore)}`;
      overlayBest.hidden = false;
    }
    if (isRecord) {
      playSound("record");
      vibrate([30, 50, 80]);
    }
    showToast(isRecord ? "New high score!" : funnyMsg);
    collapsing = false;
  }, 1400);
}

function updatePhysics() {
  if (paused && !collapsing) return;
  const phys = computePhysics();
  targetRotX = phys.tiltY * DEG;
  targetRotZ = phys.tiltX * DEG;
  updateStatus(phys);
  if (phys.tipped && !tipped) triggerGameOver();
}

function animate() {
  animId = requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const wobbleIntensity = getWobbleIntensity();

  if (!paused || collapsing) {
    const diff = getDifficultyLevel();
    const wobbleScale = getWobbleScale();
    const freqBoost = 1 + diff * 0.22 + dangerRatio * 0.35;

    let envX = 0;
    let envZ = 0;
    if (!paused) {
      envX =
        Math.sin(t * (2.2 * freqBoost)) * (0.022 + diff * 0.014) * wobbleScale +
        Math.sin(t * (5.1 * freqBoost) + 1.2) * (0.008 + diff * 0.006) * wobbleScale;
      envZ =
        Math.cos(t * (2.6 * freqBoost)) * (0.018 + diff * 0.012) * wobbleScale +
        Math.cos(t * (4.7 * freqBoost) + 0.8) * (0.007 + diff * 0.005) * wobbleScale;
    }

    if (collapsing) {
      collapseTime += dt;
      const flop = Math.min(1, collapseTime / 0.55);
      envX += displayRotX * flop * 0.6 + Math.sin(t * 16) * 0.04 * flop;
      envZ += displayRotZ * flop * 0.6 + Math.cos(t * 14) * 0.04 * flop;
    }

    const ease = collapsing ? 0.08 : 0.12;
    displayRotX += (targetRotX - displayRotX) * ease;
    displayRotZ += (targetRotZ - displayRotZ) * ease;

  if (collapsing && collapseTime < 0.9) {
      displayRotX += targetRotX * dt * 1.8;
      displayRotZ += targetRotZ * dt * 1.8;
    }

    trayGroup.rotation.x = displayRotX + envX;
    trayGroup.rotation.z = displayRotZ + envZ;

    if (!tipped || collapsing) {
      const phys = computePhysics();
      if (!collapsing) updateNearFail(phys, t);
    }

    if (!collapsing && !tipped) jiggleEggs(t, wobbleIntensity);
  }

  fallingEggs.forEach((f) => {
    f.vy -= 9.8 * dt;
    f.mesh.position.x += f.vx * dt;
    f.mesh.position.y += f.vy * dt;
    f.mesh.position.z += f.vz * dt;
    f.mesh.rotation.x += dt * (f.rot || 4);
    f.mesh.rotation.z += dt * ((f.rot || 3) * 0.8);
    if (f.mesh.position.y < -0.28 && !f.splatted) {
      f.splatted = true;
      f.mesh.position.y = -0.28;
      f.vy = Math.abs(f.vy) * 0.35;
      f.vx *= 0.6;
      f.vz *= 0.6;
      f.mesh.scale.y *= 0.55;
      playSound("splat");
    }
    if (f.mesh.position.y < -0.5 && !f.cracked) {
      f.cracked = true;
    }
  });

  renderer.render(scene, camera);
}

function setPointerFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickCup() {
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObjects(cupMeshes, false);
  if (!hits.length) return null;
  const cup = hits[0].object;
  return cup.userData?.type === "cup" ? cup : null;
}

function setCupHover(index) {
  visualCups.forEach((cup, i) => {
    if (cup) cup.material = i === index ? matCupHover : matCup;
  });
}

function clearCupHover() {
  visualCups.forEach((cup) => {
    if (cup) cup.material = matCup;
  });
}

function bindPointer() {
  canvas.addEventListener("pointerdown", (e) => {
    if (tipped) return;
    pointerDown = true;
    dragMoved = false;
    dragDistance = 0;
    lastPointer.x = e.clientX;
    lastPointer.y = e.clientY;
    setPointerFromEvent(e);
    clearCupHover();
    const cup = pickCup();
    if (cup) setCupHover(cup.userData.index);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!pointerDown || tipped) return;
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    dragDistance += Math.hypot(dx, dy);
    lastPointer.x = e.clientX;
    lastPointer.y = e.clientY;
    if (dragDistance > 14) {
      dragMoved = true;
      camYaw -= dx * 0.008;
      camPitch = Math.max(0.2, Math.min(0.75, camPitch + dy * 0.006));
      updateCamera();
      return;
    }
    setPointerFromEvent(e);
    clearCupHover();
    const cup = pickCup();
    if (cup && !cells[cup.userData.index]) setCupHover(cup.userData.index);
  });

  canvas.addEventListener("pointerup", (e) => {
    if (!pointerDown) return;
    pointerDown = false;
    clearCupHover();
    if (tipped || paused || collapsing) return;
    if (dragMoved) return;
    setPointerFromEvent(e);
    const cup = pickCup();
    if (cup) {
      const idx = cup.userData.index;
      if (!cells[idx]) placeEgg(idx);
    }
  });

  canvas.addEventListener("pointercancel", () => {
    pointerDown = false;
    clearCupHover();
  });

  canvas.addEventListener("click", (e) => {
    if (tipped || paused || collapsing) return;
    if (dragDistance > 14) return;
    setPointerFromEvent(e);
    const cup = pickCup();
    if (cup) {
      const idx = cup.userData.index;
      if (!cells[idx]) placeEgg(idx);
    }
  });
}

function resetGame() {
  overlay.hidden = true;
  overlay.classList.remove("is-visible", "overlay-tip--record");
  if (overlayRecord) overlayRecord.hidden = true;
  if (overlayBest) overlayBest.hidden = true;
  tipped = false;
  collapsing = false;
  paused = false;
  resetSurvivalClock();
  setScoreDisplay(0);
  scoreEl?.classList.remove("score-value--hot");
  displayRotX = displayRotZ = targetRotX = targetRotZ = 0;
  gamePanel.classList.remove("game-panel--paused", "is-shake");
  btnPause.setAttribute("aria-pressed", "false");
  btnPause.textContent = "Pause";
  moveFeedback.textContent = "";
  moveFeedback.className = "move-feedback";
  buildGrid();
}

function togglePause() {
  if (tipped || collapsing) return;
  if (!paused && survivalActive) pauseStartedAt = performance.now();
  else if (paused && pauseStartedAt) {
    pauseAccumulated += performance.now() - pauseStartedAt;
    pauseStartedAt = 0;
    if (survivalActive) startScoreLoop();
  }
  paused = !paused;
  if (paused) stopScoreLoop();
  else if (survivalActive) startScoreLoop();
  btnPause.setAttribute("aria-pressed", String(paused));
  btnPause.textContent = paused ? "Resume" : "Pause";
  gamePanel.classList.toggle("game-panel--paused", paused);
  playSound("click");
}

function toggleSound() {
  soundOn = !soundOn;
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "Sound on" : "Sound off";
  try {
    localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (soundOn) {
    initAudio();
    playSound("click");
  }
}

function bindInteractiveButtons(root = document) {
  root.querySelectorAll(".btn-interactive").forEach((btn) => {
    const press = () => btn.classList.add("is-pressed");
    const release = () => btn.classList.remove("is-pressed");
    btn.addEventListener("pointerdown", press);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", release);
    btn.addEventListener("pointercancel", release);
  });
}

document.querySelectorAll(".size-pick").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".size-pick").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    rows = parseInt(btn.dataset.rows, 10);
    cols = parseInt(btn.dataset.cols, 10);
    playSound("click");
    resetSurvivalClock();
    resetGame();
  });
});

document.getElementById("btn-restart").addEventListener("click", () => {
  playSound("click");
  resetSurvivalClock();
  resetGame();
  showToast("New game");
});

document.getElementById("btn-clear").addEventListener("click", () => {
  if (tipped || collapsing) return;
  playSound("click");
  resetSurvivalClock();
  resetGame();
  showToast("Tray cleared");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  playSound("click");
  resetSurvivalClock();
  resetGame();
});

btnPause.addEventListener("click", togglePause);
btnSound.addEventListener("click", toggleSound);
bindInteractiveButtons();

try {
  soundOn = localStorage.getItem(SOUND_KEY) === "1";
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "Sound on" : "Sound off";
} catch {
  /* ignore */
}

loadHighScore();
initThree();
buildGrid();
