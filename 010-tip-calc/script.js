const bill = document.getElementById("bill"), pct = document.getElementById("tip-pct"), people = document.getElementById("people"), d = document.getElementById("display");
function c() {
  const b = +bill.value || 0, p = +pct.value || 15, n = Math.max(1, +people.value || 1);
  const tip = b * p / 100, tot = b + tip;
  d.innerHTML = "Tip: <strong>€" + tip.toFixed(2) + "</strong><br>Total: <strong>€" + tot.toFixed(2) + "</strong><br>Each: <strong>€" + (tot / n).toFixed(2) + "</strong>";
}
[bill, pct, people].forEach((e) => e.addEventListener("input", c));
c();
