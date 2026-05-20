const TOOLS = [
  {
    name: "ChatGPT",
    tag: "Chat",
    icon: "💬",
    desc: "Conversational AI for drafting, brainstorming, and quick answers.",
    href: "https://chat.openai.com/",
  },
  {
    name: "Claude",
    tag: "Chat",
    icon: "✦",
    desc: "Long-context assistant for analysis, writing, and careful reasoning.",
    href: "https://claude.ai/",
  },
  {
    name: "Gemini",
    tag: "Chat",
    icon: "◇",
    desc: "Google’s multimodal AI — search, images, and workspace integration.",
    href: "https://gemini.google.com/",
  },
  {
    name: "Perplexity",
    tag: "Search",
    icon: "🔍",
    desc: "AI search with citations — research without tab overload.",
    href: "https://www.perplexity.ai/",
  },
  {
    name: "GitHub Copilot",
    tag: "Code",
    icon: "⌨",
    desc: "Inline code suggestions inside your editor and pull requests.",
    href: "https://github.com/features/copilot",
  },
  {
    name: "Cursor",
    tag: "Code",
    icon: "⚡",
    desc: "AI-native IDE for editing, refactoring, and shipping faster.",
    href: "https://cursor.com/",
  },
  {
    name: "Midjourney",
    tag: "Image",
    icon: "🎨",
    desc: "Generate striking visuals from text prompts for brands and concepts.",
    href: "https://www.midjourney.com/",
  },
  {
    name: "Runway",
    tag: "Video",
    icon: "🎬",
    desc: "AI video editing and generation for creators and marketers.",
    href: "https://runwayml.com/",
  },
  {
    name: "ElevenLabs",
    tag: "Voice",
    icon: "🎙",
    desc: "Realistic text-to-speech and voice cloning for podcasts and apps.",
    href: "https://elevenlabs.io/",
  },
  {
    name: "Notion AI",
    tag: "Docs",
    icon: "📝",
    desc: "Summarize, draft, and organize inside your Notion workspace.",
    href: "https://www.notion.so/product/ai",
  },
];

const grid = document.getElementById("tool-grid");
const cta = document.getElementById("cta-explore");
const toolsSection = document.getElementById("tools");

function renderTools() {
  grid.innerHTML = TOOLS.map(
    (t, i) => `
    <li class="tool-card" style="transition-delay: ${i * 50}ms">
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
  ).join("");
}

function scrollToTools() {
  toolsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function observeCards() {
  const cards = grid.querySelectorAll(".tool-card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  cards.forEach((c) => io.observe(c));
}

cta.addEventListener("click", scrollToTools);

if (location.hash === "#tools") {
  requestAnimationFrame(scrollToTools);
}

renderTools();
observeCards();
