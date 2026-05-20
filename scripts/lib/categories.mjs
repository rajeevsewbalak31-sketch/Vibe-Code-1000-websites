/** Hub gallery categories (maps site → discoverable group). */

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "tools", label: "Tools" },
  { id: "games", label: "Games" },
  { id: "utilities", label: "Utilities" },
  { id: "landing-pages", label: "Landing Pages" },
  { id: "experiments", label: "Experiments" },
  { id: "creative", label: "Creative" },
  { id: "labs", label: "Labs" },
];

const GAME_LOGICS = new Set([
  "coin-flip",
  "dice-roll",
  "yes-or-no",
  "magic-8ball",
  "rps",
  "lucky-number",
  "spin-wheel",
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
]);

const UTILITY_LOGICS = new Set([
  "password-gen",
  "tip-calc",
  "unit-convert",
  "word-counter",
  "countdown",
  "stopwatch",
  "pomodoro",
  "breathing",
]);

const TOOL_LOGICS = new Set([
  "compliment",
  "gratitude",
  "mood-picker",
  "name-picker",
  "random-color",
]);

/** @param {{ id: string, logic?: string, slug?: string }} site */
export function getCategory(site) {
  const id = site.id;
  const logic = site.logic || "";

  if (id === "001") return "landing-pages";
  if (id === "002") return "tools";
  if (parseInt(id, 10) >= 501) return "labs";
  if (parseInt(id, 10) >= 301) return "creative";
  if (parseInt(id, 10) >= 201) return "experiments";
  if (parseInt(id, 10) >= 101 && parseInt(id, 10) <= 200) return "games";
  if (parseInt(id, 10) >= 23 && parseInt(id, 10) <= 100) return "experiments";
  if (GAME_LOGICS.has(logic)) return "games";
  if (UTILITY_LOGICS.has(logic)) return "utilities";
  if (TOOL_LOGICS.has(logic)) return "tools";
  return "tools";
}

export function isFeaturedId(id, spotlightSet) {
  return spotlightSet.has(id);
}
