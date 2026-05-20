function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

const canvas = document.getElementById("qr");
const btn = document.getElementById("btn");
const dl = document.getElementById("dl");
const status = document.getElementById("status");
const input = document.getElementById("in");
const sizeEl = document.getElementById("size");

function ready() {
  return typeof QRCode !== "undefined";
}

function generate() {
  const v = input.value.trim();
  if (!v) {
    showToast("Enter text or URL");
    return;
  }
  if (!ready()) {
    status.textContent = "Loading library…";
    return;
  }
  const px = parseInt(sizeEl.value, 10) || 240;
  canvas.width = canvas.height = px;
  QRCode.toCanvas(
    canvas,
    v,
    { width: px, margin: 2, errorCorrectionLevel: "M" },
    (err) => {
      if (err) {
        status.textContent = "Could not generate";
        dl.disabled = true;
        showToast("Error generating QR");
      } else {
        status.textContent = "QR ready — download or share";
        dl.disabled = false;
      }
    }
  );
}

btn.addEventListener("click", generate);
input.addEventListener("input", () => {
  clearTimeout(input._t);
  input._t = setTimeout(generate, 400);
});
sizeEl.addEventListener("input", generate);

dl.addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = "plotview-qr.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
  showToast("Download started");
});

window.addEventListener("load", () => {
  if (ready()) generate();
  else status.textContent = "Loading…";
});
