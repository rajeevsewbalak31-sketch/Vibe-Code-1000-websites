/** Labs catalog #501–1000 (25 templates × 20 variants) */

export const BATCH3_LOGICS = [
  "text-reverse",
  "caesar-cipher",
  "prime-check",
  "fibonacci",
  "discount-calc",
  "compound-interest",
  "sleep-calc",
  "water-intake",
  "hash-display",
  "random-name",
  "team-picker",
  "event-countdown",
  "metronome",
  "habit-tracker",
  "notes-pad",
  "emoji-grid",
  "poll-vote",
  "card-draw",
  "meme-text",
  "sales-tax",
  "steps-km",
  "dice-visual",
  "binary-text",
  "lorem-title",
  "color-palette-gen",
];

export const BATCH3_PALETTES = [
  { accent: "#6c5ce7", accent2: "#a29bfe" },
  { accent: "#00b894", accent2: "#55efc4" },
  { accent: "#e17055", accent2: "#fab1a0" },
  { accent: "#0984e3", accent2: "#74b9ff" },
  { accent: "#fdcb6e", accent2: "#ffeaa7" },
  { accent: "#e84393", accent2: "#fd79a8" },
  { accent: "#00cec9", accent2: "#81ecec" },
  { accent: "#d63031", accent2: "#ff7675" },
  { accent: "#2d3436", accent2: "#636e72" },
  { accent: "#e8a87c", accent2: "#5eead4" },
];

export const BATCH3_NAMES = [
  "Alpha", "Beta", "Gamma", "Delta", "Sigma", "Omega", "Nova", "Astra", "Helio", "Luna",
  "Terra", "Vapor", "Nimbus", "Cinder", "Frost", "Blaze", "Surge", "Quiet", "Rapid", "Solid",
  "Prime", "Vector", "Scalar", "Matrix", "Tensor", "Photon", "Neuron", "Cipher", "Signal", "Pulse",
  "Orbit", "Comet", "Meteor", "Rocket", "Satellite", "Station", "Module", "Circuit", "Binary", "Logic",
  "Cloud", "Stream", "Packet", "Socket", "Server", "Client", "Portal", "Gateway", "Bridge", "Channel",
];

export const BATCH3_SUFFIXES = [
  "Lab", "Kit", "Hub", "Box", "Pad", "Desk", "Port", "Mint", "Works", "Forge",
  "Studio", "Core", "Node", "Base", "Zone", "Spot", "Bay", "Den", "Run", "Flow",
];

export const BATCH3_TAGLINES = {
  "text-reverse": "Reverse any string instantly",
  "caesar-cipher": "Shift letters — classic Caesar cipher",
  "prime-check": "Is it prime? Fast number check",
  "fibonacci": "Generate Fibonacci sequences",
  "discount-calc": "Sale price from percent off",
  "compound-interest": "Compound growth calculator",
  "sleep-calc": "Best bedtime for wake-up time",
  "water-intake": "Daily water goal tracker",
  "hash-display": "Simple text fingerprint hash",
  "random-name": "Random character names for stories",
  "team-picker": "Split names into random teams",
  "event-countdown": "Count down to your event",
  "metronome": "Tap tempo — audible metronome",
  "habit-tracker": "Daily habit checkboxes — saved locally",
  "notes-pad": "Quick notes — auto-saved in browser",
  "emoji-grid": "Pick emojis — copy to clipboard",
  "poll-vote": "Quick two-option poll — share results",
  "card-draw": "Draw a random playing card",
  "meme-text": "Top & bottom meme text overlay",
  "sales-tax": "Add sales tax to any price",
  "steps-km": "Convert steps to kilometers",
  "dice-visual": "Roll 1–6 with a 3D-style die",
  "binary-text": "Text to binary and back",
  "lorem-title": "Generate product / startup names",
  "color-palette-gen": "Random harmonious color palette",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function buildBatch3Entry(idNum) {
  const id = String(idNum).padStart(3, "0");
  const offset = idNum - 501;
  const logic = BATCH3_LOGICS[offset % BATCH3_LOGICS.length];
  const palette = BATCH3_PALETTES[offset % BATCH3_PALETTES.length];
  const name =
    BATCH3_NAMES[offset % BATCH3_NAMES.length] +
    BATCH3_SUFFIXES[(offset + 7) % BATCH3_SUFFIXES.length];
  return {
    id,
    slug: slugify(name) + "-" + id,
    name,
    tagline: BATCH3_TAGLINES[logic],
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

export function buildBatch3Range(from = 501, to = 1000) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(buildBatch3Entry(n));
  return out;
}

export const BATCH3_LOGIC_SET = new Set(BATCH3_LOGICS);
