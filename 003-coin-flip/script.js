const display = document.getElementById("display");
document.getElementById("btn-action").addEventListener("click", () => {
  display.textContent = "…";
  setTimeout(() => {
    display.textContent = Math.random() < 0.5 ? "Heads" : "Tails";
  }, 400);
});
