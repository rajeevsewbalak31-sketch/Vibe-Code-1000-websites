const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Small steps every day become big journeys.", author: "Unknown" },
];

const card = document.getElementById("quote-card");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const btn = document.getElementById("btn-generate");
const btnCopy = document.getElementById("btn-copy");
const btnFav = document.getElementById("btn-fav");
const btnShare = document.getElementById("btn-share");
const hint = document.getElementById("hint");
const favSection = document.getElementById("favorites");
const favList = document.getElementById("fav-list");

let lastIndex = -1;
let current = null;
const FAV_KEY = "motivation-favs";

function getFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  renderFavs();
}

function renderFavs() {
  const favs = getFavs();
  if (!favs.length) {
    favSection.hidden = true;
    return;
  }
  favSection.hidden = false;
  favList.innerHTML = favs
    .map(
      (f, i) =>
        `<li><button type="button" data-i="${i}" class="fav-item">"${f.text}" — ${f.author}</button></li>`
    )
    .join("");
  favList.querySelectorAll(".fav-item").forEach((b) => {
    b.addEventListener("click", () => {
      const f = favs[parseInt(b.dataset.i, 10)];
      setQuote(f, true);
      current = f;
    });
  });
}

function pickQuote() {
  let idx;
  do {
    idx = Math.floor(Math.random() * QUOTES.length);
  } while (idx === lastIndex && QUOTES.length > 1);
  lastIndex = idx;
  return QUOTES[idx];
}

function setQuote(q, animate = true) {
  current = q;
  const showExtras = () => {
    btnCopy.hidden = btnFav.hidden = btnShare.hidden = false;
    hint.textContent = `${QUOTES.length} quotes · ${getFavs().length} saved`;
  };
  if (!animate) {
    quoteText.textContent = q.text;
    quoteAuthor.textContent = q.author;
    showExtras();
    return;
  }
  card.classList.add("is-changing");
  setTimeout(() => {
    quoteText.textContent = q.text;
    quoteAuthor.textContent = q.author;
    card.classList.remove("is-changing");
    showExtras();
  }, 280);
}

function generate() {
  btn.classList.add("is-pressed");
  setQuote(pickQuote());
  setTimeout(() => btn.classList.remove("is-pressed"), 400);
}

btn.addEventListener("click", generate);

btnCopy.addEventListener("click", async () => {
  if (!current) return;
  const line = `"${current.text}" — ${current.author}`;
  try {
    await navigator.clipboard.writeText(line);
    btnCopy.textContent = "Copied!";
    setTimeout(() => (btnCopy.textContent = "Copy"), 1500);
  } catch {
    btnCopy.textContent = "Failed";
  }
});

btnFav.addEventListener("click", () => {
  if (!current) return;
  const favs = getFavs();
  const key = current.text + current.author;
  if (favs.some((f) => f.text + f.author === key)) {
    showToast("Already saved");
    return;
  }
  favs.unshift(current);
  saveFavs(favs.slice(0, 8));
  btnFav.textContent = "★ Saved";
});

btnShare.addEventListener("click", async () => {
  if (!current) return;
  const payload = { title: "Motivation", text: `"${current.text}" — ${current.author}` };
  try {
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard.writeText(payload.text);
  } catch {
    /* cancelled */
  }
});

function showToast(msg) {
  const t = document.createElement("p");
  t.className = "toast is-visible";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

renderFavs();
