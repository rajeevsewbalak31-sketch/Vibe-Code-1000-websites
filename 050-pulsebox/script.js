const PAYPAL_SUPPORT = "https://paypal.me/RajeevSewbalak";
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const bill = document.getElementById("bill");
const pct = document.getElementById("tip-pct");
const people = document.getElementById("people");
const display = document.getElementById("display");
function calc() {
  const b = parseFloat(bill.value) || 0;
  const p = parseFloat(pct.value) || 15;
  const n = Math.max(1, parseInt(people.value, 10) || 1);
  const tip = b * (p / 100);
  const total = b + tip;
  const each = total / n;
  display.innerHTML = "Tip: <strong>€" + tip.toFixed(2) + "</strong><br>Total: <strong>€" + total.toFixed(2) + "</strong><br>Per person: <strong>€" + each.toFixed(2) + "</strong>";
}
[bill, pct, people].forEach((el) => el.addEventListener("input", calc));
calc();