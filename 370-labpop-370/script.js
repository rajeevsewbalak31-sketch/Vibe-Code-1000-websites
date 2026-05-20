function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const zones=["UTC","America/New_York","Europe/London","Europe/Amsterdam","Asia/Tokyo","Australia/Sydney"];
function tick(){document.getElementById("display").innerHTML=zones.map(z=>"<strong>"+z.split("/").pop()+"</strong>: "+new Date().toLocaleTimeString("en-GB",{timeZone:z,hour:"2-digit",minute:"2-digit",second:"2-digit"})).join("<br>");}
setInterval(tick,1000);tick();