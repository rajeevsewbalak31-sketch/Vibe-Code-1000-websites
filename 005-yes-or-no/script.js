const answers = ["Yes", "No", "Maybe", "Ask again later", "Definitely yes", "Not today"];
document.getElementById("btn-action").onclick = () => {
  document.getElementById("display").textContent = answers[Math.floor(Math.random() * answers.length)];
};
