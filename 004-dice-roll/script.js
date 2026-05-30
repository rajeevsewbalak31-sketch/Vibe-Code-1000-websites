/**
 * Roll a Dice — 3D d6 with shadows, sound, and roll history.
 */
import * as THREE from "three";

const DICE_SIZE = 1;
const ROLL_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 520 : 1500;
const MAX_DPR = 2;
const HISTORY_MAX = 5;
const SOUND_KEY = "dice-roll-sound";
const HISTORY_KEY = "dice-roll-history";

const FACE_NORMALS = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];
const FACE_VALUES = [3, 4, 1, 6, 2, 5];

const TOP_ROTATION = {
  1: new THREE.Euler(0, 0, 0, "XYZ"),
  2: new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ"),
  3: new THREE.Euler(0, 0, -Math.PI / 2, "XYZ"),
  4: new THREE.Euler(0, 0, Math.PI / 2, "XYZ"),
  5: new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"),
  6: new THREE.Euler(Math.PI, 0, 0, "XYZ"),
};

const TOP_QUATERNION = Object.fromEntries(
  [1, 2, 3, 4, 5, 6].map((v) => [v, new THREE.Quaternion().setFromEuler(TOP_ROTATION[v])])
);

const PIP_LAYOUT = {
  1: [[0.5, 0.5]],
  2: [
    [0.28, 0.28],
    [0.72, 0.72],
  ],
  3: [
    [0.28, 0.28],
    [0.5, 0.5],
    [0.72, 0.72],
  ],
  4: [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  5: [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.5, 0.5],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  6: [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.28, 0.5],
    [0.72, 0.5],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
};

const canvas = document.getElementById("dice-canvas");
const stage = document.getElementById("dice-stage");
const display = document.getElementById("display");
const displayTotal = document.getElementById("display-total");
const countEl = document.getElementById("dice-count");
const btnRoll = document.getElementById("btn-roll");
const btnAgain = document.getElementById("btn-again");
const btnSound = document.getElementById("btn-sound");
const historyList = document.getElementById("history-list");

const _worldUp = new THREE.Vector3(0, 1, 0);
const _worldQuat = new THREE.Quaternion();
const _faceDir = new THREE.Vector3();
const _spinDelta = new THREE.Quaternion();
const _eulerScratch = new THREE.Euler();

let renderer;
let scene;
let camera;
let diceGroup;
let diceMeshes = [];
let rolling = false;
let rollStates = [];
let rollHistory = [];
let textureCache = new Map();
let sharedGeo;
let sharedMaterials;
let audioCtx = null;
let soundOn = false;
/** 0 when idle; avoids stacking rAF callbacks when restarting the loop */
let rafId = 0;
/** false when the stage has scrolled out of view; pauses the render loop */
let stageVisible = true;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

function loadSoundPref() {
  try {
    soundOn = localStorage.getItem(SOUND_KEY) === "1";
  } catch {
    soundOn = false;
  }
  syncSoundButton();
}

function syncSoundButton() {
  if (!btnSound) return;
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "Sound on" : "Sound off";
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      rollHistory = parsed.slice(0, HISTORY_MAX).filter((e) => Array.isArray(e?.values));
    }
  } catch {
    rollHistory = [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(rollHistory));
  } catch {
    /* ignore quota/private-mode errors */
  }
}

function initAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx?.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration, type = "sine", gain = 0.05) {
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
  if (kind === "roll") {
    playTone(90, 0.08, "triangle", 0.04);
    setTimeout(() => playTone(120, 0.1, "sine", 0.03), 40);
  } else if (kind === "land") {
    playTone(180, 0.05, "sine", 0.05);
    setTimeout(() => playTone(70, 0.12, "triangle", 0.035), 30);
  } else if (kind === "click") {
    playTone(400, 0.03, "sine", 0.03);
  }
}

function clampCount() {
  const raw = parseInt(countEl.value, 10);
  const n = Number.isFinite(raw) ? raw : 1;
  return Math.min(6, Math.max(1, n));
}

function syncCountInput() {
  const n = clampCount();
  countEl.value = String(n);
  return n;
}

function readTopValue(die) {
  die.getWorldQuaternion(_worldQuat);
  let best = 1;
  let bestDot = -Infinity;
  for (let i = 0; i < 6; i++) {
    _faceDir.copy(FACE_NORMALS[i]).applyQuaternion(_worldQuat);
    const d = _faceDir.dot(_worldUp);
    if (d > bestDot) {
      bestDot = d;
      best = FACE_VALUES[i];
    }
  }
  return best;
}

function createPipTexture(value) {
  if (textureCache.has(value)) return textureCache.get(value);

  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#fcfaf4");
  grad.addColorStop(1, "#e6dfd2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, size - 10, size - 10);

  const pipR = size * 0.088;
  ctx.fillStyle = "#1c1c24";
  for (const [px, py] of PIP_LAYOUT[value]) {
    ctx.beginPath();
    ctx.arc(px * size, py * size, pipR, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(value, tex);
  return tex;
}

function initSharedAssets() {
  sharedGeo = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
  sharedMaterials = [3, 4, 1, 6, 2, 5].map(
    (v) =>
      new THREE.MeshStandardMaterial({
        map: createPipTexture(v),
        roughness: 0.38,
        metalness: 0.06,
      })
  );
}

function createDieMesh() {
  const mesh = new THREE.Mesh(sharedGeo, sharedMaterials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function layoutPositions(count) {
  const spread = DICE_SIZE * 1.35;
  if (count === 1) return [{ x: 0, y: 0, z: 0 }];
  if (count === 2) {
    return [
      { x: -spread * 0.55, y: 0, z: 0 },
      { x: spread * 0.55, y: 0, z: 0 },
    ];
  }
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = count <= 4 ? spread * 0.75 : spread;
    out.push({
      x: Math.cos(a) * r,
      y: 0,
      z: Math.sin(a) * r * 0.35,
    });
  }
  return out;
}

function rebuildDice(count) {
  while (diceGroup.children.length) diceGroup.remove(diceGroup.children[0]);
  diceMeshes = [];
  layoutPositions(count).forEach((pos, i) => {
    const die = createDieMesh();
    die.position.set(pos.x, pos.y, pos.z);
    die.userData.index = i;
    die.quaternion.setFromEuler(new THREE.Euler(0, Math.random() * Math.PI * 2, 0));
    diceGroup.add(die);
    diceMeshes.push(die);
  });
  fitCamera(count);
}

function fitCamera(count) {
  const dist = count === 1 ? 3.5 : 4.3 + count * 0.11;
  camera.position.set(0.15, dist * 0.42, dist);
  camera.lookAt(0, 0, 0);
}

function setupLights() {
  scene.add(new THREE.HemisphereLight(0xe8eef8, 0x1a2030, 0.45));

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xfff8f0, 1.15);
  key.position.set(3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(
    window.innerWidth < 600 ? 512 : 1024,
    window.innerWidth < 600 ? 512 : 1024
  );
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x8899cc, 0.25);
  rim.position.set(-3, 2, -2);
  scene.add(rim);
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141a24);
  scene.fog = new THREE.Fog(0x141a24, 7, 16);

  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  fitCamera(1);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "default",
  });
  renderer.setPixelRatio(Math.min(MAX_DPR, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  initSharedAssets();
  setupLights();

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5, 40),
    new THREE.MeshStandardMaterial({
      color: 0x0c1018,
      roughness: 0.92,
      metalness: 0.02,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -DICE_SIZE * 0.52;
  floor.receiveShadow = true;
  scene.add(floor);

  diceGroup = new THREE.Group();
  scene.add(diceGroup);
  rebuildDice(1);

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibilityChange);
  observeStage();
  startRenderLoop();
}

/** When the tab is hidden and nothing is rolling, stop scheduling frames to save GPU/CPU/battery. */
function onVisibilityChange() {
  if (!document.hidden) {
    resize();
    startRenderLoop();
  }
}

/** Pause the loop when the dice stage scrolls off-screen; resume when it returns. */
function observeStage() {
  if (typeof IntersectionObserver !== "function") return;
  const observer = new IntersectionObserver(
    (entries) => {
      stageVisible = entries[0].isIntersecting;
      if (stageVisible) startRenderLoop();
    },
    { threshold: 0.01 }
  );
  observer.observe(stage);
}

function startRenderLoop() {
  if (rafId || !renderer) return;
  rafId = requestAnimationFrame(animate);
}

function resize() {
  const rect = stage.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function tickRollState(state, now, dt) {
  if (!state.active || now < state.start) return;

  const t = Math.min(1, (now - state.start) / state.duration);
  const die = state.mesh;
  const targetQ = TOP_QUATERNION[state.target];

  if (t < 0.68) {
    const spin = easeOutCubic(t / 0.68);
    const damp = Math.max(0.08, 1 - spin);
    const speed = dt * 60 * damp;

    _eulerScratch.set(state.vx * speed, state.vy * speed, state.vz * speed);
    _spinDelta.setFromEuler(_eulerScratch);
    die.quaternion.multiply(_spinDelta);

    const hop = Math.sin(t * Math.PI * 2.8) * 0.26 * (1 - t) ** 1.2;
    die.position.y = state.baseY + hop;
    die.position.x = state.baseX + Math.sin(t * 12 + state.phase) * 0.04 * (1 - t);
    die.position.z = state.baseZ + Math.cos(t * 10 + state.phase) * 0.04 * (1 - t);
  } else {
    const settle = easeOutQuart((t - 0.68) / 0.32);
    die.quaternion.slerp(targetQ, Math.min(1, settle * 0.32));
    die.position.y = THREE.MathUtils.lerp(die.position.y, state.baseY, settle * 0.22);
    die.position.x = THREE.MathUtils.lerp(die.position.x, state.baseX, settle * 0.22);
    die.position.z = THREE.MathUtils.lerp(die.position.z, state.baseZ, settle * 0.22);
  }

  if (t >= 1 && state.active) {
    die.quaternion.copy(targetQ);
    die.position.set(state.baseX, state.baseY, state.baseZ);
    die.rotation.setFromQuaternion(die.quaternion);
    state.active = false;
    if (!state.landed) {
      state.landed = true;
      playSound("land");
    }
  }
}

function animate(now) {
  rafId = 0;
  const dt = Math.min(0.05, 1 / 60);

  rollStates.forEach((state) => tickRollState(state, now, dt));

  if (rolling && rollStates.length && rollStates.every((s) => !s.active)) {
    finishRoll();
  }

  const canDraw = !document.hidden && stageVisible;

  if (canDraw) {
    if (!rolling && !stage.classList.contains("has-result")) {
      diceGroup.rotation.y += 0.0008;
    }
    diceGroup.updateMatrixWorld(true);
    renderer.render(scene, camera);
  } else if (rolling) {
    /* Roll can finish while hidden/off-screen; skip draws to reduce GPU use. */
    diceGroup.updateMatrixWorld(true);
  }

  if (canDraw || rolling) {
    rafId = requestAnimationFrame(animate);
  }
}

function startRoll() {
  if (rolling) return;
  const count = syncCountInput();
  rebuildDice(count);

  rolling = true;
  rollStates = [];
  playSound("roll");

  display.classList.add("is-rolling");
  display.classList.remove("is-reveal");
  display.textContent = "…";
  displayTotal.hidden = true;
  stage.classList.add("is-rolling");
  stage.classList.remove("has-result");
  btnRoll.disabled = true;
  countEl.disabled = true;
  btnAgain.hidden = true;

  const targets = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));

  diceMeshes.forEach((die, i) => {
    const stagger = i * 85;
    rollStates.push({
      mesh: die,
      target: targets[i],
      baseX: die.position.x,
      baseY: die.position.y,
      baseZ: die.position.z,
      phase: Math.random() * Math.PI * 2,
      start: performance.now() + stagger,
      duration: ROLL_MS + stagger * 0.3,
      active: true,
      landed: false,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.48,
      vz: (Math.random() - 0.5) * 0.42,
    });
  });
}

function formatHistoryLabel(values, sum, count) {
  if (count === 1) return String(values[0]);
  return `${values.join(" · ")} · ${sum}`;
}

function pushHistory(values, sum, count) {
  const entry = {
    values: [...values],
    sum,
    count,
    label: formatHistoryLabel(values, sum, count),
    time: new Date(),
  };
  rollHistory.unshift(entry);
  if (rollHistory.length > HISTORY_MAX) rollHistory.length = HISTORY_MAX;
  saveHistory();
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = rollHistory
    .map((entry, i) => {
      const meta =
        entry.count > 1
          ? `${entry.count} dice · total ${entry.sum}`
          : "1 die";
      const tag = i === 0 ? '<span class="history-tag">Latest</span> ' : "";
      return `<li class="history-item">
        <span class="history-values">${tag}${entry.label}</span>
        <span class="history-meta">${meta}</span>
      </li>`;
    })
    .join("");
}

function finishRoll() {
  if (!rolling) return;
  rolling = false;

  const count = diceMeshes.length;
  const values = diceMeshes.map((die) => readTopValue(die));
  const sum = values.reduce((a, b) => a + b, 0);

  display.classList.remove("is-rolling");
  display.classList.add("is-reveal");
  display.textContent = count === 1 ? String(values[0]) : values.join(" · ");

  if (count > 1) {
    displayTotal.textContent = `Total: ${sum}`;
    displayTotal.hidden = false;
  } else {
    displayTotal.hidden = true;
  }

  stage.classList.remove("is-rolling");
  stage.classList.add("has-result");
  btnRoll.disabled = false;
  countEl.disabled = false;
  btnAgain.hidden = false;

  pushHistory(values, sum, count);
}

function onCountChange() {
  if (rolling) return;
  rebuildDice(syncCountInput());
  display.textContent = "—";
  display.classList.remove("is-reveal");
  displayTotal.hidden = true;
  stage.classList.remove("has-result");
  btnAgain.hidden = true;
}

function toggleSound() {
  soundOn = !soundOn;
  try {
    localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0");
  } catch {
    /* ignore */
  }
  syncSoundButton();
  if (soundOn) {
    initAudio();
    playSound("click");
  }
}

btnRoll.addEventListener("click", startRoll);
btnAgain.addEventListener("click", startRoll);
btnSound?.addEventListener("click", toggleSound);
countEl.addEventListener("change", onCountChange);
countEl.addEventListener("input", onCountChange);
stage.addEventListener("click", () => {
  if (!rolling) startRoll();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== " " && e.key !== "Enter") return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  e.preventDefault();
  if (!rolling) startRoll();
});

loadSoundPref();
loadHistory();
renderHistory();
initThree();
