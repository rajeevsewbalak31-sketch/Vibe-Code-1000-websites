function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

const key = "habits-v2";
const today = new Date().toDateString();

function load() {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

let items = load();

function save() {
  localStorage.setItem(key, JSON.stringify(items));
  render();
}

function updateStats() {
  const total = items.length;
  const doneToday = items.filter((h) => h.lastDone === today).length;
  document.getElementById("total").textContent = total;
  document.getElementById("done-today").textContent = doneToday;
  const streak = parseInt(localStorage.getItem("habit-streak") || "0", 10);
  document.getElementById("streak").textContent = streak;
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = items
    .map(
      (h, i) => `
    <li class="habit-item ${h.lastDone === today ? "is-done" : ""}">
      <label>
        <input type="checkbox" data-i="${i}" ${h.lastDone === today ? "checked" : ""} />
        <span>${esc(h.text)}</span>
      </label>
      <button type="button" class="habit-del" data-del="${i}" aria-label="Remove">×</button>
    </li>`
    )
    .join("");

  list.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const h = items[parseInt(cb.dataset.i, 10)];
      if (cb.checked) {
        h.lastDone = today;
        const prev = localStorage.getItem("habit-last-day");
        let streak = parseInt(localStorage.getItem("habit-streak") || "0", 10);
        if (prev === today) {
          /* same day */
        } else if (prev && new Date(prev).getTime() === new Date(today).getTime() - 86400000) {
          streak++;
        } else {
          streak = 1;
        }
        localStorage.setItem("habit-streak", String(streak));
        localStorage.setItem("habit-last-day", today);
        showToast("Nice — habit logged!");
      } else {
        h.lastDone = null;
      }
      save();
    });
  });

  list.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      items.splice(parseInt(btn.dataset.del, 10), 1);
      save();
      showToast("Habit removed");
    });
  });

  updateStats();
}

document.getElementById("add").addEventListener("click", () => {
  const t = document.getElementById("habit").value.trim();
  if (!t) return;
  items.push({ text: t, lastDone: null });
  document.getElementById("habit").value = "";
  save();
});

document.getElementById("habit").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("add").click();
});

render();
