const TOOLS = [
  { name: "ChatGPT", tag: "Chat", icon: "💬", desc: "Conversational AI for drafting, brainstorming, and quick answers.", href: "https://chat.openai.com/" },
  { name: "Claude", tag: "Chat", icon: "✦", desc: "Long-context assistant for analysis, writing, and careful reasoning.", href: "https://claude.ai/" },
  { name: "Gemini", tag: "Chat", icon: "◇", desc: "Google's multimodal AI — search, images, and workspace integration.", href: "https://gemini.google.com/" },
  { name: "Perplexity", tag: "Search", icon: "🔍", desc: "AI search with citations — research without tab overload.", href: "https://www.perplexity.ai/" },
  { name: "GitHub Copilot", tag: "Code", icon: "⌨", desc: "Inline code suggestions inside your editor and pull requests.", href: "https://github.com/features/copilot" },
  { name: "Cursor", tag: "Code", icon: "⚡", desc: "AI-native IDE for editing, refactoring, and shipping faster.", href: "https://cursor.com/" },
  { name: "Midjourney", tag: "Image", icon: "🎨", desc: "Generate striking visuals from text prompts for brands and concepts.", href: "https://www.midjourney.com/" },
  { name: "Runway", tag: "Video", icon: "🎬", desc: "AI video editing and generation for creators and marketers.", href: "https://runwayml.com/" },
  { name: "ElevenLabs", tag: "Voice", icon: "🎙", desc: "Realistic text-to-speech and voice cloning for podcasts and apps.", href: "https://elevenlabs.io/" },
  { name: "Notion AI", tag: "Docs", icon: "📝", desc: "Summarize, draft, and organize inside your Notion workspace.", href: "https://www.notion.so/product/ai" },
];

const grid = document.getElementById("tool-grid");
const cta = document.getElementById("cta-explore");
const toolsSection = document.getElementById("tools");
const search = document.getElementById("tool-search");
const filtersEl = document.getElementById("filters");
const noResults = document.getElementById("no-results");

let activeTag = "All";
const tags = ["All", ...new Set(TOOLS.map((t) => t.tag))];

tags.forEach((tag) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "filter-btn" + (tag === "All" ? " is-active" : "");
  b.textContent = tag;
  b.addEventListener("click", () => {
    activeTag = tag;
    filtersEl.querySelectorAll(".filter-btn").forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    renderTools();
  });
  filtersEl.appendChild(b);
});

function filtered() {
  const q = search.value.trim().toLowerCase();
  return TOOLS.filter((t) => {
    if (activeTag !== "All" && t.tag !== activeTag) return false;
    if (!q) return true;
    return (t.name + t.tag + t.desc).toLowerCase().includes(q);
  });
}

function renderTools() {
  const list = filtered();
  noResults.hidden = list.length > 0;
  grid.innerHTML = list
    .map(
      (t, i) => `
    <li class="tool-card is-visible">
      <a href="${t.href}" target="_blank" rel="noopener noreferrer">
        <div class="tool-card-top">
          <span class="tool-icon" aria-hidden="true">${t.icon}</span>
          <span class="tool-tag">${t.tag}</span>
        </div>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <span class="tool-card-foot">Open ${t.name} →</span>
      </a>
    </li>`
    )
    .join("");
}

search.addEventListener("input", renderTools);
cta.addEventListener("click", () => toolsSection.scrollIntoView({ behavior: "smooth" }));
if (location.hash === "#tools") requestAnimationFrame(() => toolsSection.scrollIntoView({ behavior: "smooth" }));
renderTools();
