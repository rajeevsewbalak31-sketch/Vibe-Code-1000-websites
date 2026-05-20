function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const M={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."};
function enc(t){return t.toUpperCase().split("").map(c=>M[c]|| (c===" "?"/":"")).filter(Boolean).join(" ");}
function upd(){document.getElementById("display").textContent=enc(document.getElementById("text").value)||"—";}
document.getElementById("text").addEventListener("input",upd);document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied!");};upd();