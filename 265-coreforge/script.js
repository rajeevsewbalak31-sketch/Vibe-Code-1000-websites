function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const map=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
function toRoman(n){let s="";for(const [v,sym] of map){while(n>=v){s+=sym;n-=v;}}return s;}
function upd(){const n=parseInt(document.getElementById("num").value,10)||0;document.getElementById("display").textContent=n>0&&n<4000?toRoman(n):"Out of range";}
document.getElementById("num").addEventListener("input",upd);document.getElementById("btn").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied!");};upd();