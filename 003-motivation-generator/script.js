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
  { text: "Limit your always and your nevers.", author: "Amy Poehler" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
];

const card = document.getElementById("quote-card");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const btn = document.getElementById("btn-generate");
const btnCopy = document.getElementById("btn-copy");
const hint = document.getElementById("hint");

let lastIndex = -1;

function pickQuote() {
  let idx;
  do {
    idx = Math.floor(Math.random() * QUOTES.length);
  } while (idx === lastIndex && QUOTES.length > 1);
  lastIndex = idx;
  return QUOTES[idx];
}

function setQuote({ text, author }, animate = true) {
  if (!animate) {
    quoteText.textContent = text;
    quoteAuthor.textContent = author;
    btnCopy.hidden = false;
    return;
  }

  card.classList.add("is-changing");
  setTimeout(() => {
    quoteText.textContent = text;
    quoteAuthor.textContent = author;
    card.classList.remove("is-changing");
    btnCopy.hidden = false;
    hint.textContent = `${QUOTES.length} unique quotes · tap again anytime`;
  }, 280);
}

function generate() {
  btn.classList.add("is-pressed");
  setQuote(pickQuote());
  setTimeout(() => btn.classList.remove("is-pressed"), 400);
}

btn.addEventListener("click", generate);

btnCopy.addEventListener("click", async () => {
  const line = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
  try {
    await navigator.clipboard.writeText(line);
    btnCopy.textContent = "Copied!";
    setTimeout(() => {
      btnCopy.textContent = "Copy quote";
    }, 1600);
  } catch {
    btnCopy.textContent = "Copy failed";
  }
});
