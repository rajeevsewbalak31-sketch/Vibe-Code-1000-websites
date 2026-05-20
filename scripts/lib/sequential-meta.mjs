import { LOGICS, PALETTES, PREFIXES, SUFFIXES, TAGLINES, buildCatalogEntry } from "./catalog.mjs";
import { buildGameEntry } from "./games-catalog.mjs";
import { buildAppEntry } from "./apps-catalog.mjs";
import { buildBatch2Entry } from "./batch2-catalog.mjs";
import { buildBatch3Entry } from "./batch3-catalog.mjs";
import { formatSiteId } from "./sequential-scan.mjs";

/** Logics that must not be auto-generated (hand-built folders). */
export const HANDCRAFTED_LOGICS = new Set([
  "egg-balance",
  "motivation-generator",
  "ai-tools-landing",
]);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Early tools #004–022 (before catalog engine at #023). */
function buildEarlyToolEntry(idNum) {
  const id = formatSiteId(idNum);
  const offset = idNum - 4;
  const logic = LOGICS[offset % LOGICS.length];
  const palette = PALETTES[offset % PALETTES.length];
  const names = [
    "FlipCoin",
    "RollDice",
    "YesNo",
    "HueDrop",
    "KeyForge",
    "TickDown",
    "FocusTomato",
    "TipQuick",
    "Brighten",
    "Oracle8",
    "RPS Arena",
    "LuckyDraw",
    "WordScope",
    "SwiftLap",
    "BreatheFlow",
    "SpinPick",
    "MetricMate",
    "MoodMap",
    "NameHat",
    "ThankDrop",
  ];
  const name = names[offset % names.length] || PREFIXES[offset % PREFIXES.length] + SUFFIXES[offset % SUFFIXES.length];
  return {
    id,
    slug: slugify(name),
    name,
    tagline: TAGLINES[logic] || "A free mini tool from Vibe Code 1000",
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

/** Unique site metadata for a numeric slot (does not check disk). */
export function buildSiteForId(idNum) {
  if (idNum === 1) return null;
  if (idNum === 2) {
    return {
      id: "002",
      slug: "daily-ai-tools",
      name: "Daily AI Tools",
      tagline: "Ten curated AI apps for writing, code, images, and search.",
      accent: "#818cf8",
      accent2: "#22d3ee",
      logic: "ai-tools-landing",
    };
  }
  if (idNum === 3) {
    return {
      id: "003",
      slug: "motivation-generator",
      name: "Motivation Generator",
      tagline: "One tap for a fresh motivational quote",
      accent: "#f59e0b",
      accent2: "#fb7185",
      logic: "motivation-generator",
    };
  }
  if (idNum >= 501) return buildBatch3Entry(idNum);
  if (idNum >= 301) return buildBatch2Entry(idNum);
  if (idNum >= 201) return buildAppEntry(idNum);
  if (idNum >= 101) return buildGameEntry(idNum);
  if (idNum >= 23) return buildCatalogEntry(idNum);
  if (idNum >= 4) return buildEarlyToolEntry(idNum);
  return null;
}
