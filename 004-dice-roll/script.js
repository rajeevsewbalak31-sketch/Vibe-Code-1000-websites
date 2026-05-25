/**
 * Roll a Dice — 3D d6 roller (Three.js)
 */
import * as THREE from "three";

const DICE_SIZE = 1;
const ROLL_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 1400;
const MAX_DPR = 2;

/** Euler (XYZ) so the given value faces +Y (top). Face map: +Y=1, -Y=6, +Z=2, -Z=5, +X=3, -X=4 */
const TOP_ROTATION = {
  1: new THREE.Euler(0, 0, 0, "XYZ"),
  2: new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ"),
  3: new THREE.Euler(0, 0, -Math.PI / 2, "XYZ"),
  4: new THREE.Euler(0, 0, Math.PI / 2, "XYZ"),
  5: new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"),
  6: new THREE.Euler(Math.PI, 0, 0, "XYZ"),
};

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
const stageHint = document.getElementById("stage-hint");
const display = document.getElementById("display");
const displayTotal = document.getElementById("display-total");
const countEl = document.getElementById("dice-count");
const btnRoll = document.getElementById("btn-roll");
const btnAgain = document.getElementById("btn-again");

let renderer;
let scene;
let camera;
let diceGroup;
let diceMeshes = [];
let animId = 0;
let rolling = false;
let rollStates = [];
let textureCache = new Map();

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

function clampCount() {
  return Math.min(6, Math.max(1, parseInt(countEl.value, 10) || 1));
}

function createPipTexture(value) {
  if (textureCache.has(value)) return textureCache.get(value);

  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#faf8f2");
  grad.addColorStop(1, "#e8e2d6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, size - 8, size - 8);

  const pipR = size * 0.09;
  ctx.fillStyle = "#1a1a22";
  for (const [px, py] of PIP_LAYOUT[value]) {
    ctx.beginPath();
    ctx.arc(px * size, py * size, pipR, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(value, tex);
  return tex;
}

function createDieMesh() {
  const geo = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
  const mats = [
    createPipTexture(3),
    createPipTexture(4),
    createPipTexture(1),
    createPipTexture(6),
    createPipTexture(2),
    createPipTexture(5),
  ].map(
    (map) =>
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.42,
        metalness: 0.04,
      })
  );

  const mesh = new THREE.Mesh(geo, mats);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
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
  while (diceGroup.children.length) {
    const m = diceGroup.children.pop();
    diceGroup.remove(m);
  }
  diceMeshes = [];
  const positions = layoutPositions(count);
  positions.forEach((pos, i) => {
    const die = createDieMesh();
    die.position.set(pos.x, pos.y, pos.z);
    die.userData.index = i;
    die.rotation.set(0, Math.random() * Math.PI * 2, 0);
    diceGroup.add(die);
    diceMeshes.push(die);
  });
  fitCamera(count);
}

function fitCamera(count) {
  const dist = count === 1 ? 3.4 : 4.2 + count * 0.12;
  camera.position.set(0, dist * 0.35, dist);
  camera.lookAt(0, 0, 0);
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121820);
  scene.fog = new THREE.Fog(0x121820, 6, 14);

  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  fitCamera(1);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(MAX_DPR, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xfff5eb, 1.05);
  key.position.set(2.5, 4, 3);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8899bb, 0.35);
  fill.position.set(-2, 1, -2);
  scene.add(fill);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(4, 32),
    new THREE.MeshStandardMaterial({
      color: 0x0d1118,
      roughness: 0.9,
      metalness: 0,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -DICE_SIZE * 0.52;
  scene.add(floor);

  diceGroup = new THREE.Group();
  scene.add(diceGroup);
  rebuildDice(1);

  resize();
  window.addEventListener("resize", resize);
  animate();
}

function resize() {
  const rect = stage.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate() {
  animId = requestAnimationFrame(animate);
  const now = performance.now();

  rollStates.forEach((state) => {
    if (!state.active) return;
    if (now < state.start) return;
    const t = Math.min(1, (now - state.start) / state.duration);
    const die = state.mesh;

    if (t < 0.72) {
      const spin = easeOutCubic(t / 0.72);
      const damp = 1 - spin;
      die.rotation.x += state.vx * damp * 0.016;
      die.rotation.y += state.vy * damp * 0.016;
      die.rotation.z += state.vz * damp * 0.016;
      die.position.y = state.baseY + Math.sin(t * Math.PI * 3) * 0.22 * (1 - t);
    } else {
      const settle = easeOutQuart((t - 0.72) / 0.28);
      const e = TOP_ROTATION[state.target];
      die.rotation.x = THREE.MathUtils.lerp(die.rotation.x, e.x, settle * 0.22);
      die.rotation.y = THREE.MathUtils.lerp(die.rotation.y, e.y, settle * 0.22);
      die.rotation.z = THREE.MathUtils.lerp(die.rotation.z, e.z, settle * 0.22);
      die.position.y = THREE.MathUtils.lerp(die.position.y, state.baseY, settle * 0.18);
    }

    if (t >= 1) {
      const e = TOP_ROTATION[state.target];
      die.rotation.copy(e);
      die.position.y = state.baseY;
      state.active = false;
    }
  });

  if (rolling && rollStates.length) {
    const allDone = rollStates.every((s) => {
      if (s.active) return false;
      return true;
    });
    if (allDone) finishRoll();
  }

  diceGroup.rotation.y += 0.0012;
  renderer.render(scene, camera);
}

function rollValues(count) {
  return Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
}

function startRoll() {
  if (rolling) return;
  const count = clampCount();
  rebuildDice(count);

  const values = rollValues(count);
  rolling = true;
  rollStates = [];

  display.classList.add("is-rolling");
  display.classList.remove("is-reveal");
  display.textContent = "…";
  displayTotal.hidden = true;
  stage.classList.add("is-rolling");
  stage.classList.remove("has-result");
  btnRoll.disabled = true;
  countEl.disabled = true;
  btnAgain.hidden = true;

  diceMeshes.forEach((die, i) => {
    const stagger = i * 90;
    rollStates.push({
      mesh: die,
      target: values[i],
      baseY: die.position.y,
      start: performance.now() + stagger,
      duration: ROLL_MS + stagger * 0.35,
      active: true,
      vx: (Math.random() - 0.5) * 28,
      vy: (Math.random() - 0.5) * 32,
      vz: (Math.random() - 0.5) * 28,
    });
  });
}

function finishRoll() {
  rolling = false;
  const count = diceMeshes.length;
  const values = rollStates.map((s) => s.target);
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
  btnRoll.textContent = "Roll";
}

function onCountChange() {
  if (rolling) return;
  rebuildDice(clampCount());
  display.textContent = "—";
  display.classList.remove("is-reveal");
  displayTotal.hidden = true;
  stage.classList.remove("has-result");
  btnAgain.hidden = true;
}

btnRoll.addEventListener("click", startRoll);
btnAgain.addEventListener("click", startRoll);
countEl.addEventListener("change", onCountChange);
countEl.addEventListener("input", onCountChange);
stage.addEventListener("click", () => {
  if (!rolling) startRoll();
});

initThree();
