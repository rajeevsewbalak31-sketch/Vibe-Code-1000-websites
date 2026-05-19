/** Shared catalog + naming for the site generation engine (Phase 2). */

export const LOGICS = [
  "coin-flip",
  "dice-roll",
  "yes-or-no",
  "random-color",
  "password-gen",
  "countdown",
  "pomodoro",
  "tip-calc",
  "compliment",
  "magic-8ball",
  "rps",
  "lucky-number",
  "word-counter",
  "stopwatch",
  "breathing",
  "spin-wheel",
  "unit-convert",
  "mood-picker",
  "name-picker",
  "gratitude",
];

export const PALETTES = [
  { accent: "#e74c3c", accent2: "#f5b7b1" },
  { accent: "#3498db", accent2: "#85c1e9" },
  { accent: "#2ecc71", accent2: "#82e0aa" },
  { accent: "#9b59b6", accent2: "#d7bde2" },
  { accent: "#f39c12", accent2: "#f8c471" },
  { accent: "#1abc9c", accent2: "#76d7c4" },
  { accent: "#e67e22", accent2: "#f5cba7" },
  { accent: "#34495e", accent2: "#aeb6bf" },
  { accent: "#e84393", accent2: "#f8b4d9" },
  { accent: "#00b894", accent2: "#55efc4" },
  { accent: "#6c5ce7", accent2: "#a29bfe" },
  { accent: "#fd79a8", accent2: "#fab1c9" },
  { accent: "#00cec9", accent2: "#81ecec" },
  { accent: "#d63031", accent2: "#ff7675" },
  { accent: "#0984e3", accent2: "#74b9ff" },
];

export const PREFIXES = [
  "Swift",
  "Nova",
  "Echo",
  "Pixel",
  "Zen",
  "Flash",
  "Orbit",
  "Pulse",
  "Spark",
  "Drift",
  "Glide",
  "Prism",
  "Flux",
  "Apex",
  "Lumen",
  "Cipher",
  "Rune",
  "Bolt",
  "Crest",
  "Vivid",
];

export const SUFFIXES = [
  "Lab",
  "Box",
  "Kit",
  "Hub",
  "Go",
  "Tap",
  "Pop",
  "Zone",
  "Deck",
  "Mint",
  "Forge",
  "Nest",
  "Dash",
  "Wave",
  "Core",
  "Port",
  "Spot",
  "Bay",
  "Den",
  "Pad",
];

export const TAGLINES = {
  "coin-flip": "Heads or tails — fate in one tap",
  "dice-roll": "Roll dice instantly",
  "yes-or-no": "A decisive answer when you need one",
  "random-color": "Discover your next palette color",
  "password-gen": "Strong passwords in one click",
  countdown: "Count down to any moment",
  pomodoro: "Focused work in timed bursts",
  "tip-calc": "Split the bill like a pro",
  compliment: "A kind line when you need one",
  "magic-8ball": "Ask the oracle — get an answer",
  rps: "Rock, paper, scissors vs CPU",
  "lucky-number": "Your random number awaits",
  "word-counter": "Words, chars, and reading time",
  stopwatch: "Lap times with millisecond flair",
  breathing: "Guided calm breathing cycles",
  "spin-wheel": "Add options, spin to decide",
  "unit-convert": "Quick unit conversion",
  "mood-picker": "Name your mood, save the moment",
  "name-picker": "Pick a random winner from your list",
  gratitude: "Write gratitude, send good vibes",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Build one catalog entry for numeric id (e.g. 23 → "023"). */
export function buildCatalogEntry(idNum) {
  const id = String(idNum).padStart(3, "0");
  const offset = idNum - 23;
  const logic = LOGICS[offset % LOGICS.length];
  const palette = PALETTES[offset % PALETTES.length];
  const name = PREFIXES[offset % PREFIXES.length] + SUFFIXES[Math.floor(offset / PREFIXES.length) % SUFFIXES.length];
  const slug = slugify(name);
  return {
    id,
    slug,
    name,
    tagline: TAGLINES[logic],
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

/** Generate catalog entries for id range [from, to] inclusive. */
export function buildCatalogRange(from = 23, to = 100) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(buildCatalogEntry(n));
  return out;
}
