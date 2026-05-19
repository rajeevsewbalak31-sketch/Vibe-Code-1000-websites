const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const moods = ["Calm", "Excited", "Tired", "Grateful", "Curious", "Stressed", "Hopeful", "Playful"];
const display = document.getElementById("display");
const log = document.getElementById("mood-log");
document.querySelectorAll("[data-mood]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const m = btn.dataset.mood;
    display.textContent = "You're feeling " + m;
    const li = document.createElement("li");
    li.textContent = new Date().toLocaleTimeString() + " — " + m;
    log.prepend(li);
  });
});