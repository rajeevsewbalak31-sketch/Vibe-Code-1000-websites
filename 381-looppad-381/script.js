function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const W="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor".split(" ");
function gen(p){let t=[];for(let i=0;i<p;i++){let s=[];for(let j=0;j<40+Math.floor(Math.random()*30);j++)s.push(W[Math.floor(Math.random()*W.length)]);t.push(s.join(" ").replace(/^./,c=>c.toUpperCase())+".");}return t.join("\n\n");}
document.getElementById("btn").onclick=()=>{document.getElementById("out").value=gen(parseInt(document.getElementById("n").value,10)||2);};
document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").value);showToast("Copied");};
document.getElementById("btn").click();