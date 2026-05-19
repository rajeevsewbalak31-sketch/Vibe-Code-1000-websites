const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const answers = ["Yes", "No", "Maybe", "Ask again later", "Definitely yes", "Not today"];
const display = document.getElementById("display");
const btn = document.getElementById("btn-action");
btn.addEventListener("click", () => {
  display.classList.add("pulse");
  display.textContent = answers[Math.floor(Math.random() * answers.length)];
  setTimeout(() => display.classList.remove("pulse"), 300);
});