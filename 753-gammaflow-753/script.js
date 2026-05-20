function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function isPrime(n){if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}
function chk(){const n=parseInt(document.getElementById("n").value,10);document.getElementById("display").textContent=isPrime(n)?n+" is prime ✓":n+" is not prime";}
document.getElementById("n").oninput=chk;chk();