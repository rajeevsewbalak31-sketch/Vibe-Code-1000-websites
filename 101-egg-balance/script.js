/**
 * EggBalance — center-of-mass physics on a tilting egg carton.
 * Invented for Vibe Code 1000 (#101).
 */
const cartonEl = document.getElementById("carton");
const gridEl = document.getElementById("carton-grid");
const trayEl = document.getElementById("tray");
const gamePanel = document.getElementById("game-panel");
const statusPill = document.getElementById("status-pill");
const eggCountEl = document.getElementById("egg-count");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const streakEl = document.getElementById("streak");
const streakWrap = document.getElementById("streak-wrap");
const tiltFill = document.getElementById("tilt-fill");
const tiltMeter = document.querySelector(".tilt-meter");
const moveFeedback = document.getElementById("move-feedback");
const cartonScene = document.getElementById("carton-scene");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayRecord = document.getElementById("overlay-record");
const overlayMsg = document.getElementById("overlay-msg");
const overlayScore = document.getElementById("overlay-score");
const overlayBest = document.getElementById("overlay-best");
const btnPause = document.getElementById("btn-pause");
const btnSound = document.getElementById("btn-sound");

let rows = 2;
let cols = 2;
let cells = [];
let tipped = false;
let collapsing = false;
let paused = false;
let dragEgg = null;
let pointerDownCup = null;
let wobbleRaf = 0;
let displayTiltX = 0;
let displayTiltY = 0;
let targetTiltX = 0;
let targetTiltY = 0;
let streak = 0;
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

const SOUND_KEY = "eggbalance-sound";
const HIGH_SCORE_KEY = "eggbalance-best";

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
  } else if (kind === "warn") playTone(280, 0.12, "triangle", 0.05);
  else if (kind === "tip") playTone(120, 0.35, "sawtooth", 0.07);
  else if (kind === "click") playTone(400, 0.04, "sine", 0.04);
  else if (kind === "level") {
    playTone(440, 0.06, "sine", 0.05);
    setTimeout(() => playTone(554, 0.08, "sine", 0.05), 70);
  } else if (kind === "gameover") {
    playTone(90, 0.2, "sawtooth", 0.08);
    setTimeout(() => playTone(55, 0.45, "triangle", 0.06), 100);
    setTimeout(() => playTone(40, 0.3, "sine", 0.04), 220);
  } else if (kind === "record") {
    playTone(523, 0.1, "sine", 0.07);
    setTimeout(() => playTone(659, 0.1, "sine", 0.07), 90);
    setTimeout(() => playTone(784, 0.14, "sine", 0.08), 180);
    setTimeout(() => playTone(988, 0.2, "sine", 0.06), 280);
  }
}

function loadHighScore() {
  try {
    const v = parseFloat(localStorage.getItem(HIGH_SCORE_KEY) || "0");
    highScore = Number.isFinite(v) ? v : 0;
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

function formatTime(seconds) {
  const s = Math.max(0, seconds);
  if (s >= 60) {
    const m = Math.floor(s / 60);
    const r = (s % 60).toFixed(1);
    return `${m}:${r.padStart(4, "0")}`;
  }
  return `${s.toFixed(1)}s`;
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
  if (scoreRaf) {
    cancelAnimationFrame(scoreRaf);
    scoreRaf = 0;
  }
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
  const level = getDifficultyLevel();
  return 1 + level * 0.35;
}

function updateLiveScore() {
  const sec = getSurvivalSeconds();
  const level = getDifficultyLevel();
  if (level !== difficultyLevel) {
    difficultyLevel = level;
    if (level > lastDifficultyAnnounced && level > 0) {
      lastDifficultyAnnounced = level;
      showMoveFeedback(`Level ${level + 1} — wobble up!`, "move-feedback--warn");
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
    return { tiltX: 0, tiltY: 0, stable: true, tipped: false, w: 0, mag: 0, limit: 0, normX: 0, normY: 0 };
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
  return { tiltX, tiltY, stable, tipped: tippedNow, w, mag, limit, normX, normY };
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

function ratePlacement(index, physBefore, physAfter) {
  const offset = cupOffsetFromCenter(index);
  const tiltGain = physAfter.mag - physBefore.mag;

  if (physAfter.tipped) return { text: "Too far!", cls: "move-feedback--bad", points: 0 };
  if (offset < 0.25 && physAfter.stable) {
    return { text: "Perfect!", cls: "move-feedback--perfect", points: 25 };
  }
  if (offset >= 0.65 || tiltGain > 2.5) {
    return { text: "Too far!", cls: "move-feedback--bad", points: 5 };
  }
  if (!physAfter.stable) {
    return { text: "Risky…", cls: "move-feedback--warn", points: 10 };
  }
  return { text: "Nice!", cls: "move-feedback--good", points: 15 };
}

function showMoveFeedback(text, cls) {
  clearTimeout(feedbackTimer);
  moveFeedback.textContent = text;
  moveFeedback.className = `move-feedback ${cls} is-visible`;
  feedbackTimer = setTimeout(() => {
    moveFeedback.classList.remove("is-visible");
  }, 900);
}

function bumpTimeDisplay() {
  if (!scoreEl) return;
  scoreEl.classList.remove("score-bump");
  void scoreEl.offsetWidth;
  scoreEl.classList.add("score-bump");
}

function updateStreak(rating) {
  if (rating.cls === "move-feedback--perfect" || rating.cls === "move-feedback--good") {
    streak += 1;
    streakWrap.hidden = false;
    streakEl.textContent = String(streak);
    streakEl.classList.remove("streak-pop");
    void streakEl.offsetWidth;
    streakEl.classList.add("streak-pop");
  } else {
    streak = 0;
    streakWrap.hidden = true;
    streakEl.textContent = "0";
  }
}

function fillTray() {
  trayEl.innerHTML = "";
  const n = Math.min(8, rows * cols);
  for (let i = 0; i < n; i++) {
    const egg = document.createElement("span");
    egg.className = "tray-egg";
    egg.setAttribute("aria-hidden", "true");
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

function createEggElement() {
  const egg = document.createElement("span");
  egg.className = "egg is-placing";
  egg.setAttribute("aria-hidden", "true");
  return egg;
}

function buildGrid() {
  cells = Array(rows * cols).fill(false);
  gridEl.style.setProperty("--cup-size", cupSize());
  gridEl.style.gridTemplateColumns = `repeat(${cols}, var(--cup-size))`;
  gridEl.innerHTML = "";
  for (let i = 0; i < rows * cols; i++) {
    const cup = document.createElement("button");
    cup.type = "button";
    cup.className = "cup btn-interactive";
    cup.dataset.index = String(i);
    const r = Math.floor(i / cols) + 1;
    const c = (i % cols) + 1;
    cup.setAttribute("aria-label", `Cup row ${r} column ${c}, empty`);
    cup.setAttribute("role", "gridcell");

    cup.addEventListener("pointerdown", (e) => {
      if (paused || tipped || collapsing) return;
      pointerDownCup = cup;
      cup.classList.add("is-pressed");
      if (cells[i]) {
        const egg = cup.querySelector(".egg");
        if (egg) startDrag(e, egg, i, cup);
      }
    });

    cup.addEventListener("pointerup", (e) => {
      cup.classList.remove("is-pressed");
      if (paused || tipped || collapsing) return;
      if (dragEgg) return;
      if (pointerDownCup === cup && !cells[i]) {
        e.preventDefault();
        placeEgg(i, cup);
      }
      pointerDownCup = null;
    });

    cup.addEventListener("pointercancel", () => {
      cup.classList.remove("is-pressed");
      pointerDownCup = null;
    });

    gridEl.appendChild(cup);
  }
  tipped = false;
  collapsing = false;
  streak = 0;
  streakWrap.hidden = true;
  cartonEl.classList.remove("is-tipped", "is-collapsing");
  fillTray();
  updatePhysics();
}

function placeEgg(index, cup) {
  if (paused || tipped || collapsing || cells[index]) return;

  const physBefore = computePhysics();
  cells[index] = true;
  cup.classList.add("cup--filled");
  cup.setAttribute("aria-label", cup.getAttribute("aria-label").replace("empty", "has egg"));

  const egg = createEggElement();
  cup.appendChild(egg);
  requestAnimationFrame(() => {
    egg.classList.remove("is-placing");
    egg.classList.add("is-settled");
  });

  if (!survivalActive) startSurvivalClock();

  const physAfter = computePhysics();
  const rating = ratePlacement(index, physBefore, physAfter);
  updateStreak(rating);
  bumpTimeDisplay();
  showMoveFeedback(rating.text, rating.cls);

  playSound(rating.cls === "move-feedback--perfect" ? "perfect" : "place");
  if (rating.cls === "move-feedback--perfect") vibrate(18);
  else if (rating.cls === "move-feedback--bad") vibrate([8, 40, 8]);
  else vibrate(10);

  updatePhysics();
}

function removeEgg(index) {
  const cup = gridEl.children[index];
  if (!cup) return;
  cells[index] = false;
  cup.classList.remove("cup--filled");
  cup.innerHTML = "";
  const r = Math.floor(index / cols) + 1;
  const c = (index % cols) + 1;
  cup.setAttribute("aria-label", `Cup row ${r} column ${c}, empty`);
}

function updateStatus(phys) {
  eggCountEl.textContent = phys.w;
  const max = maxTiltForGrid() * 1.1;
  const pct = 50 + (phys.tiltX / max) * 40;
  const clamped = Math.min(92, Math.max(8, pct));
  tiltFill.style.left = `${clamped}%`;
  if (tiltMeter) tiltMeter.setAttribute("aria-valuenow", String(Math.round(clamped)));

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

function triggerScreenShake() {
  gamePanel?.classList.add("is-shake");
  cartonScene?.classList.add("is-shake");
  setTimeout(() => {
    gamePanel?.classList.remove("is-shake");
    cartonScene?.classList.remove("is-shake");
  }, 520);
}

function triggerTip() {
  if (tipped || collapsing) return;
  tipped = true;
  collapsing = true;
  const finalTime = getSurvivalSeconds();
  stopScoreLoop();
  setScoreDisplay(finalTime);

  playSound("tip");
  playSound("gameover");
  vibrate([20, 60, 30, 80, 40]);
  triggerScreenShake();

  const isRecord = finalTime > highScore;
  const previousBest = highScore;
  if (isRecord) saveHighScore(finalTime);
  if (isRecord) {
    playSound("record");
    vibrate([30, 50, 30, 50, 80]);
  }

  cartonEl.classList.add("is-collapsing");
  targetTiltX = displayTiltX * 2.8 + (Math.random() > 0.5 ? 32 : -32);
  targetTiltY = displayTiltY * 2.2 + 22;

  const eggs = [...gridEl.querySelectorAll(".egg")];
  eggs.forEach((egg, i) => {
    egg.classList.remove("is-settled", "is-placing");
    egg.classList.add("is-falling");
    egg.style.setProperty("--fall-x", `${(Math.random() - 0.5) * 80}px`);
    egg.style.setProperty("--fall-rot", `${(Math.random() - 0.5) * 120}deg`);
    egg.style.animationDelay = `${i * 0.06}s`;
  });

  if (!wobbleRaf) animateTilt();

  setTimeout(() => {
    cartonEl.classList.add("is-tipped");
    overlay.hidden = false;
    overlay.classList.add("is-visible");
    overlay.classList.toggle("overlay-tip--record", isRecord);

    if (overlayTitle) overlayTitle.textContent = isRecord ? "New record!" : "Carton tipped!";
    if (overlayRecord) overlayRecord.hidden = !isRecord;
    if (overlayMsg) {
      overlayMsg.textContent = isRecord
        ? "You held on longer than ever — incredible balance."
        : "The center of mass left the base — eggs everywhere.";
    }
    overlayScore.textContent = `Survived ${formatTime(finalTime)}${streak > 1 ? ` · Streak ${streak}` : ""}`;
    if (overlayBest) {
      overlayBest.textContent = isRecord
        ? `Previous best: ${formatTime(previousBest)}`
        : `Personal best: ${formatTime(highScore)}`;
      overlayBest.hidden = false;
    }
    showToast(isRecord ? "New high score!" : "The carton tipped over!");
    collapsing = false;
  }, 950);
}

function updatePhysics() {
  if (paused && !collapsing) return;
  const phys = computePhysics();
  targetTiltX = phys.tiltX;
  targetTiltY = phys.tiltY;
  updateStatus(phys);
  if (phys.tipped && !tipped) triggerTip();
  if (!wobbleRaf) animateTilt();
}

function animateTilt() {
  const easing = collapsing ? 0.12 : 0.18;
  displayTiltX += (targetTiltX - displayTiltX) * easing;
  displayTiltY += (targetTiltY - displayTiltY) * easing;
  const tiltMag = Math.hypot(displayTiltX, displayTiltY);
  const diffScale = getWobbleScale();
  const envWobble =
    tipped || collapsing || paused
      ? 0
      : Math.sin(Date.now() / (280 - difficultyLevel * 12)) * (0.35 + difficultyLevel * 0.22) * diffScale;
  const tiltWobble = tipped || collapsing ? 0 : Math.sin(Date.now() / 220) * tiltMag * 0.04 * diffScale;
  const wobble = envWobble + tiltWobble;
  cartonEl.style.transform = `rotateX(${displayTiltY + wobble}deg) rotateZ(${displayTiltX + wobble * 0.35}deg)`;

  const done =
    Math.abs(targetTiltX - displayTiltX) < 0.08 &&
    Math.abs(targetTiltY - displayTiltY) < 0.08;

  if (!done || collapsing || (!tipped && !paused)) {
    wobbleRaf = requestAnimationFrame(animateTilt);
  } else {
    wobbleRaf = 0;
  }
}

function startDrag(e, el, cellIndex, cup) {
  if (paused || tipped || collapsing) return;
  e.preventDefault();
  dragEgg = { el, cellIndex, ghost: el.cloneNode(true), moved: false };
  const g = dragEgg.ghost;
  g.classList.add("egg", "egg--ghost");
  g.style.position = "fixed";
  g.style.zIndex = "100";
  g.style.pointerEvents = "none";
  g.style.width = "2rem";
  g.style.height = "2.5rem";
  g.style.left = `${e.clientX - 16}px`;
  g.style.top = `${e.clientY - 20}px`;
  document.body.appendChild(g);
  el.style.visibility = "hidden";
  if (cellIndex !== null) removeEgg(cellIndex);

  const move = (ev) => {
    dragEgg.moved = true;
    g.style.left = `${ev.clientX - 16}px`;
    g.style.top = `${ev.clientY - 20}px`;
    const target = document.elementFromPoint(ev.clientX, ev.clientY);
    gridEl.querySelectorAll(".cup").forEach((c) => c.classList.remove("cup--hover"));
    const hoverCup = target?.closest?.(".cup");
    if (hoverCup && !cells[parseInt(hoverCup.dataset.index, 10)]) {
      hoverCup.classList.add("cup--hover");
    }
  };

  const up = (ev) => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", up);
    g.remove();
    if (cup) cup.classList.remove("is-pressed");
    gridEl.querySelectorAll(".cup").forEach((c) => c.classList.remove("cup--hover"));

    const target = document.elementFromPoint(ev.clientX, ev.clientY);
    const dropCup = target?.closest?.(".cup");
    if (dropCup && dropCup.dataset.index !== undefined) {
      const idx = parseInt(dropCup.dataset.index, 10);
      if (!cells[idx]) placeEgg(idx, dropCup);
    } else if (dragEgg.cellIndex !== null) {
      const orig = gridEl.children[dragEgg.cellIndex];
      if (orig) {
        cells[dragEgg.cellIndex] = true;
        orig.classList.add("cup--filled");
        const restored = createEggElement();
        restored.classList.remove("is-placing");
        restored.classList.add("is-settled");
        orig.appendChild(restored);
      }
    }
    dragEgg = null;
    updatePhysics();
  };

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}

function resetSurvivalState() {
  resetSurvivalClock();
  setScoreDisplay(0);
  scoreEl?.classList.remove("score-value--hot");
}

function resetGame(keepSize = true) {
  overlay.hidden = true;
  overlay.classList.remove("is-visible", "overlay-tip--record");
  if (overlayRecord) overlayRecord.hidden = true;
  if (overlayBest) overlayBest.hidden = true;
  tipped = false;
  collapsing = false;
  paused = false;
  resetSurvivalState();
  displayTiltX = displayTiltY = targetTiltX = targetTiltY = 0;
  gamePanel.classList.remove("game-panel--paused");
  btnPause.setAttribute("aria-pressed", "false");
  btnPause.textContent = "Pause";
  moveFeedback.textContent = "";
  moveFeedback.className = "move-feedback";
  if (!keepSize) return;
  buildGrid();
}

function togglePause() {
  if (tipped || collapsing) return;
  if (!paused && survivalActive) {
    pauseStartedAt = performance.now();
  } else if (paused && pauseStartedAt) {
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
  showToast(paused ? "Paused" : "Resumed");
}

function toggleSound() {
  soundOn = !soundOn;
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "Sound on" : "Sound off";
  btnSound.setAttribute("aria-label", soundOn ? "Sound effects on" : "Sound effects off");
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
    resetGame(true);
  });
});

document.getElementById("btn-restart").addEventListener("click", () => {
  playSound("click");
  vibrate(8);
  resetGame(true);
  showToast("New game");
});

document.getElementById("btn-clear").addEventListener("click", () => {
  if (tipped || collapsing) return;
  playSound("click");
  resetSurvivalState();
  streak = 0;
  streakWrap.hidden = true;
  buildGrid();
  showToast("Carton cleared");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  playSound("click");
  resetGame(true);
});

btnPause.addEventListener("click", togglePause);
btnSound.addEventListener("click", toggleSound);

bindInteractiveButtons();

try {
  soundOn = localStorage.getItem(SOUND_KEY) === "1";
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "Sound on" : "Sound off";
  btnSound.setAttribute("aria-label", soundOn ? "Sound effects on" : "Sound effects off");
} catch {
  /* ignore */
}

loadHighScore();
buildGrid();
