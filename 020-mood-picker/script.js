const d = document.getElementById("display"), log = document.getElementById("mood-log");
document.querySelectorAll("[data-mood]").forEach((btn) => {
  btn.onclick = () => {
    const m = btn.dataset.mood;
    d.textContent = "Feeling " + m;
    const li = document.createElement("li");
    li.textContent = new Date().toLocaleTimeString() + " — " + m;
    log.prepend(li);
  };
});
