const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const replies = [
  "It is certain", "Without a doubt", "Yes definitely", "You may rely on it",
  "Ask again later", "Cannot predict now", "Don't count on it", "My reply is no",
  "Outlook good", "Signs point to yes", "Very doubtful", "Concentrate and ask again",
];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.textContent = "…";
  setTimeout(() => {
    display.textContent = replies[Math.floor(Math.random() * replies.length)];
  }, 500);
});