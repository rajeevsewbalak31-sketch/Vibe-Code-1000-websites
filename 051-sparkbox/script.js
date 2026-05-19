const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const lines = [
  "You're doing better than you think.",
  "Your energy makes a difference.",
  "Someone is glad you exist.",
  "You learn faster than you give yourself credit for.",
  "Today is lucky to have you in it.",
  "Your kindness doesn't go unnoticed.",
  "You're allowed to be proud of small wins.",
  "The world needs your particular weirdness.",
  "You are more resilient than yesterday proved.",
  "Keep going — momentum loves you.",
];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.textContent = lines[Math.floor(Math.random() * lines.length)];
});