const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Perspective" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Resilience" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { text: "Spread love everywhere you go. Let no one ever come without leaving happier.", author: "Mother Teresa", category: "Kindness" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", category: "Learning" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb", category: "Action" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Courage" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "Progress" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar", category: "Growth" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Habits" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", category: "Creativity" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Beginnings" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "Purpose" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Fear" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Impact" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "Dreams" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Perseverance" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "Optimism" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "Creativity" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Doubt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Action" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien", category: "Adventure" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Design" },
];

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const quoteCategory = document.getElementById("quote-category");
const card = document.querySelector(".card");
const btnNew = document.getElementById("btn-new");
const btnCopy = document.getElementById("btn-copy");
const toast = document.getElementById("toast");

let lastIndex = -1;
let toastTimer;

function pickQuote() {
  if (quotes.length === 1) return 0;
  let index;
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (index === lastIndex);
  lastIndex = index;
  return index;
}

function showQuote(animate = true) {
  const { text, author, category } = quotes[pickQuote()];

  const apply = () => {
    quoteText.textContent = text;
    quoteAuthor.textContent = author;
    quoteCategory.textContent = category;
    card.classList.remove("is-changing");
  };

  if (!animate) {
    apply();
    return;
  }

  card.classList.add("is-changing");
  setTimeout(apply, 280);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyQuote() {
  const text = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Quote copied!");
  } catch {
    showToast("Could not copy — try selecting manually");
  }
}

btnNew.addEventListener("click", () => showQuote(true));
btnCopy.addEventListener("click", copyQuote);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !e.target.closest("button, input, textarea")) {
    e.preventDefault();
    showQuote(true);
  }
});

showQuote(false);
