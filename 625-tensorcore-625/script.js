function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function gen(){const h=Math.floor(Math.random()*360);const cols=[0,1,2,3].map(i=>"hsl("+(h+i*30)%360+" 55% 55%)");
document.getElementById("swatches").innerHTML=cols.map(c=>'<div style="flex:1;background:'+c+'"></div>').join("");
document.getElementById("out").textContent=cols.join("\n");}
document.getElementById("btn").onclick=gen;gen();