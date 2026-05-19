const km = document.getElementById("km"), mi = document.getElementById("miles");
let lock = 0;
km.oninput = () => { if (lock) return; lock = 1; mi.value = ((+km.value || 0) * 0.621371).toFixed(2); lock = 0; };
mi.oninput = () => { if (lock) return; lock = 1; km.value = ((+mi.value || 0) * 1.60934).toFixed(2); lock = 0; };
