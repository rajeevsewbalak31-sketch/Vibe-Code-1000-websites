const C = ["Rock", "Paper", "Scissors"], d = document.getElementById("display");
document.querySelectorAll("[data-pick]").forEach((btn) => {
  btn.onclick = () => {
    const y = btn.dataset.pick, c = C[Math.floor(Math.random() * 3)];
    let r = "Draw";
    if ((y === "Rock" && c === "Scissors") || (y === "Paper" && c === "Rock") || (y === "Scissors" && c === "Paper")) r = "You win!";
    else if (y !== c) r = "CPU wins";
    d.innerHTML = "You: <b>" + y + "</b> · CPU: <b>" + c + "</b><br>" + r;
  };
});
