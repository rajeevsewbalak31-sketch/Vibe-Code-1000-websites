/** Interactive apps catalog #201–300 */

export const APP_LOGICS = [
  "gradient-gen",
  "shadow-gen",
  "bmi-calc",
  "percent-calc",
  "roman-num",
  "binary-convert",
  "morse-code",
  "age-calc",
  "json-pretty",
  "markdown-preview",
];

export const APP_PALETTES = [
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

export const APP_PREFIXES = [
  "Pixel", "Code", "Data", "Logic", "Cloud", "Byte", "Node", "Grid", "Form", "Calc",
  "Meta", "Proto", "Alpha", "Beta", "Core", "Sync", "Flow", "Wave", "Spark", "Mint",
  "Craft", "Build", "Make", "Edit", "View", "Cast", "Plot", "Chart", "Lens", "Scope",
  "Quick", "Smart", "Clear", "Pure", "True", "Open", "Free", "Easy", "Fast", "Lite",
  "Studio", "Desk", "Pad", "Kit", "Box", "Hub", "Lab", "Bay", "Den", "Port",
];

export const APP_SUFFIXES = [
  "Lab", "Kit", "Box", "Pad", "Hub", "Desk", "Studio", "Forge", "Mint", "Works",
];

export const APP_TAGLINES = {
  "gradient-gen": "Build CSS gradients — copy ready-made code",
  "shadow-gen": "Design box-shadows with a live preview",
  "bmi-calc": "Body mass index with healthy range hints",
  "percent-calc": "Percent of, increase, decrease — instant math",
  "roman-num": "Convert Arabic ↔ Roman numerals",
  "binary-convert": "Decimal, binary, and hex side by side",
  "morse-code": "Text to Morse — sound and copy",
  "age-calc": "Exact age in years, months, and days",
  "json-pretty": "Format, validate, and minify JSON",
  "markdown-preview": "Write Markdown — see live HTML preview",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function buildAppEntry(idNum) {
  const id = String(idNum).padStart(3, "0");
  const offset = idNum - 201;
  const logic = APP_LOGICS[offset % APP_LOGICS.length];
  const palette = APP_PALETTES[offset % APP_PALETTES.length];
  const name =
    APP_PREFIXES[offset % APP_PREFIXES.length] +
    APP_SUFFIXES[(offset + 3) % APP_SUFFIXES.length];
  return {
    id,
    slug: slugify(name),
    name,
    tagline: APP_TAGLINES[logic],
    accent: palette.accent,
    accent2: palette.accent2,
    logic,
  };
}

export function buildAppsRange(from = 201, to = 300) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(buildAppEntry(n));
  return out;
}

export const APP_LOGIC_SET = new Set(APP_LOGICS);
