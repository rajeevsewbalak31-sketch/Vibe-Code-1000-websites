const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const choices = ["Rock", "Paper", "Scissors"];
const display = document.getElementById("display");
document.querySelectorAll("[data-pick]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const you = btn.dataset.pick;
    const cpu = choices[Math.floor(Math.random() * 3)];
    let result = "Draw";
    if (
      (you === "Rock" && cpu === "Scissors") ||
      (you === "Paper" && cpu === "Rock") ||
      (you === "Scissors" && cpu === "Paper")
    ) result = "You win!";
    else if (you !== cpu) result = "CPU wins";
    display.innerHTML = "You: <strong>" + you + "</strong> · CPU: <strong>" + cpu + "</strong><br>" + result;
  });
});