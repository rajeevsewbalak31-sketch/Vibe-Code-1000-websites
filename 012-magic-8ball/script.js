const R = ["It is certain", "Yes", "Outlook good", "Maybe", "Ask again", "Unlikely", "No", "Very doubtful"];
document.getElementById("btn-action").onclick = () => {
  const d = document.getElementById("display");
  d.textContent = "…";
  setTimeout(() => { d.textContent = R[Math.floor(Math.random() * R.length)]; }, 500);
};
