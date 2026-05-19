const L = ["You're doing better than you think.", "Your energy makes a difference.", "Someone is glad you exist.", "Small wins count — celebrate them.", "Keep going. Momentum is on your side."];
document.getElementById("btn-action").onclick = () => {
  document.getElementById("display").textContent = L[Math.floor(Math.random() * L.length)];
};
