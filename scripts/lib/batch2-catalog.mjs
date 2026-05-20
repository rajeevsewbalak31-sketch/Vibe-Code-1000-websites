/** Creative tools catalog #301–500 (20 templates × 10 variants) */

export const BATCH2_LOGICS = [
  "lorem-ipsum",
  "uuid-gen",
  "base64-codec",
  "slug-maker",
  "color-contrast",
  "hsl-picker",
  "date-diff",
  "fuel-calc",
  "aspect-ratio",
  "timezone-clocks",
  "word-frequency",
  "typing-test",
  "password-meter",
  "url-encode",
  "qr-maker",
  "flex-playground",
  "tone-gen",
  "pixel-doodle",
  "tip-splitter",
  "coin-stats",
];

export const BATCH2_PALETTES = [
  { accent: "#a29bfe", accent2: "#6c5ce7" },
  { accent: "#55efc4", accent2: "#00b894" },
  { accent: "#fab1a0", accent2: "#e17055" },
  { accent: "#74b9ff", accent2: "#0984e3" },
  { accent: "#ffeaa7", accent2: "#fdcb6e" },
  { accent: "#fd79a8", accent2: "#e84393" },
  { accent: "#81ecec", accent2: "#00cec9" },
  { accent: "#ff7675", accent2: "#d63031" },
  { accent: "#b2bec3", accent2: "#636e72" },
  { accent: "#dfe6e9", accent2: "#b2bec3" },
];

export const BATCH2_NAMES = [
  "Vibe", "Spark", "Flux", "Nova", "Drift", "Prism", "Echo", "Mint", "Craft", "Bolt",
  "Wave", "Glow", "Rune", "Lens", "Plot", "Sync", "Dash", "Hub", "Kit", "Lab",
  "Arc", "Beam", "Core", "Edge", "Fuse", "Grid", "Hive", "Ion", "Jade", "Keen",
  "Loop", "Mesh", "Nest", "Orb", "Pulse", "Quest", "Rise", "Sage", "Tide", "Unit",
  "Vent", "Wire", "Xen", "Yarn", "Zest", "Apex", "Bold", "Calm", "Dawn", "Ember",
];

export const BATCH2_SUFFIXES = [
  "Forge", "Mint", "Works", "Studio", "Desk", "Pad", "Box", "Port", "Bay", "Den",
  "Kit", "Lab", "Hub", "Go", "Pop", "Tap", "Run", "Flow", "Cast", "View",
];

export const BATCH2_TAGLINES = {
  "lorem-ipsum": "Generate placeholder paragraphs instantly",
  "uuid-gen": "Fresh UUID v4 identifiers — one click",
  "base64-codec": "Encode and decode Base64 text",
  "slug-maker": "Turn titles into URL-safe slugs",
  "color-contrast": "Check WCAG contrast between two colors",
  "hsl-picker": "Pick a hue — get HSL and hex codes",
  "date-diff": "Days between two dates",
  "fuel-calc": "Trip fuel cost from distance & consumption",
  "aspect-ratio": "Resize dimensions with locked ratio",
  "timezone-clocks": "Live time across world zones",
  "word-frequency": "Count word frequency in any text",
  "typing-test": "30-second typing speed test",
  "password-meter": "Visual password strength meter",
  "url-encode": "Encode or decode URL components",
  "qr-maker": "Text to QR code — download PNG",
  "flex-playground": "Toggle flexbox — see layout shift",
  "tone-gen": "Play pure tones — set frequency",
  "pixel-doodle": "Paint on a 16×16 pixel grid",
  "tip-splitter": "Split bills with tax and tip",
  "coin-stats": "Flip coins — watch stats converge",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function buildBatch2Entry(idNum) {
  const id = String(idNum).padStart(3, "0");
  const offset = idNum - 301;
  const logic = BATCH2_LOGICS[offset % BATCH2_LOGICS.length];
  const palette = BATCH2_PALETTES[offset % BATCH2_PALETTES.length];
  const name =
    BATCH2_NAMES[offset % BATCH2_NAMES.length] +
    BATCH2_SUFFIXES[(offset + 5) % BATCH2_SUFFIXES.length];
  return {
    id,
    slug: slugify(name) + "-" + id,
    name,
    tagline: BATCH2_TAGLINES[logic],
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

export function buildBatch2Range(from = 301, to = 500) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(buildBatch2Entry(n));
  return out;
}

export const BATCH2_LOGIC_SET = new Set(BATCH2_LOGICS);
