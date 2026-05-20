/** Catalog for vibe-coded games #101–200 */

export const GAME_LOGICS = [
  "egg-balance",
  "stack-tower",
  "catch-fall",
  "snake-mini",
  "paddle-break",
  "memory-flip",
  "reaction-tap",
  "tap-fly",
  "whack-pop",
  "merge-numbers",
];

export const GAME_PALETTES = [
  { accent: "#f5e6c8", accent2: "#e8a87c" },
  { accent: "#ff6b6b", accent2: "#feca57" },
  { accent: "#48dbfb", accent2: "#0abde3" },
  { accent: "#55efc4", accent2: "#00b894" },
  { accent: "#a29bfe", accent2: "#6c5ce7" },
  { accent: "#fd79a8", accent2: "#e84393" },
  { accent: "#ffeaa7", accent2: "#fdcb6e" },
  { accent: "#81ecec", accent2: "#00cec9" },
  { accent: "#fab1a0", accent2: "#e17055" },
  { accent: "#74b9ff", accent2: "#0984e3" },
];

export const GAME_NAMES = [
  "Egg", "Yolk", "Nest", "Hatch", "Shell", "Cluck", "Farm", "Coop", "Brood", "Peck",
  "Arcade", "Pixel", "Neon", "Retro", "Turbo", "Blitz", "Rush", "Dash", "Bolt", "Zap",
  "Orbit", "Nova", "Comet", "Lunar", "Solar", "Star", "Cosmo", "Astro", "Pulse", "Drift",
  "Prism", "Flux", "Spark", "Glide", "Crest", "Rune", "Cipher", "Lumen", "Vivid", "Apex",
  "Zen", "Echo", "Swift", "Flash", "Myth", "Quest", "Loot", "Boss", "Level", "Coin",
  "Dodge", "Jump", "Spin", "Roll", "Flip", "Pop", "Tap", "Snap", "Bounce", "Swing",
  "Stack", "Catch", "Balance", "Merge", "Match", "Break", "Snake", "Paddle", "Fly", "Whack",
  "Golden", "Silver", "Ruby", "Jade", "Onyx", "Coral", "Amber", "Ivory", "Crimson", "Violet",
  "Wild", "Calm", "Bold", "Sly", "Keen", "Brave", "Lucky", "Mighty", "Tiny", "Giant",
  "Day", "Night", "Dawn", "Dusk", "Storm", "Breeze", "Frost", "Ember", "Mist", "Glow",
];

export const GAME_SUFFIXES = [
  "Balance", "Stack", "Catch", "Run", "Break", "Flip", "Rush", "Pop", "Merge", "Quest",
];

export const GAME_TAGLINES = {
  "egg-balance": "Balance eggs in the carton — physics decides if it tips",
  "stack-tower": "Stack blocks — keep the tower centered or it falls",
  "catch-fall": "Move the basket — catch what falls, dodge bombs",
  "snake-mini": "Classic snake — eat, grow, don't bite yourself",
  "paddle-break": "Break every brick — don't lose the ball",
  "memory-flip": "Flip cards — find matching pairs in fewest moves",
  "reaction-tap": "Tap when green — how fast are your reflexes?",
  "tap-fly": "Tap to fly — dodge the gaps",
  "whack-pop": "Whack the targets before they hide",
  "merge-numbers": "Slide tiles — merge numbers to reach 256",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Site #101 is always Egg Balance (Rajeev's invention). */
export function buildGameEntry(idNum) {
  const id = String(idNum).padStart(3, "0");
  if (idNum === 101) {
    return {
      id,
      slug: "egg-balance",
      name: "EggBalance",
      tagline: GAME_TAGLINES["egg-balance"],
      accent: GAME_PALETTES[0].accent,
      accent2: GAME_PALETTES[0].accent2,
      logic: "egg-balance",
    };
  }
  const offset = idNum - 102;
  const logic = GAME_LOGICS[1 + (offset % (GAME_LOGICS.length - 1))];
  const palette = GAME_PALETTES[offset % GAME_PALETTES.length];
  const name =
    GAME_NAMES[offset % GAME_NAMES.length] +
    GAME_SUFFIXES[(offset + 1) % GAME_SUFFIXES.length];
  return {
    id,
    slug: slugify(name),
    name,
    tagline: GAME_TAGLINES[logic],
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

export function buildGamesRange(from = 101, to = 200) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(buildGameEntry(n));
  return out;
}

export const GAME_LOGIC_SET = new Set(GAME_LOGICS);
