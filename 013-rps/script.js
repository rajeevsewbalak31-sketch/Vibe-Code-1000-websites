function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

const choices = ["Rock", "Paper", "Scissors"];
const display = document.getElementById("display");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const drawsEl = document.getElementById("draws");
const streakEl = document.getElementById("streak");

let wins = 0;
let losses = 0;
let draws = 0;
let streak = 0;

function beats(a, b) {
  return (
    (a === "Rock" && b === "Scissors") ||
    (a === "Paper" && b === "Rock") ||
    (a === "Scissors" && b === "Paper")
  );
}

function updateBoard() {
  winsEl.textContent = wins;
  lossesEl.textContent = losses;
  drawsEl.textContent = draws;
  streakEl.textContent = streak;
}

document.querySelectorAll("[data-pick]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const you = btn.dataset.pick;
    const cpu = choices[Math.floor(Math.random() * 3)];
    let result = "Draw";
    let cls = "";
    if (beats(you, cpu)) {
      result = "You win!";
      wins++;
      streak++;
      cls = "is-win";
    } else if (beats(cpu, you)) {
      result = "CPU wins";
      losses++;
      streak = 0;
      cls = "is-lose";
    } else {
      draws++;
      streak = 0;
    }
    display.className = "arena-result " + cls;
    display.innerHTML =
      "You: <strong>" +
      you +
      "</strong> · CPU: <strong>" +
      cpu +
      "</strong><br><span style='font-size:1.2em'>" +
      result +
      "</span>";
    updateBoard();
    if (streak >= 3) showToast(streak + " win streak!");
  });
});

document.getElementById("btn-reset").addEventListener("click", () => {
  wins = losses = draws = streak = 0;
  display.className = "arena-result";
  display.textContent = "Pick your move";
  updateBoard();
  showToast("Scores reset");
});

updateBoard();
