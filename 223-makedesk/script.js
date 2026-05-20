function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
function calc(){const kg=parseFloat(document.getElementById("kg").value)||0,h=(parseFloat(document.getElementById("cm").value)||0)/100;
if(!h){document.getElementById("display").textContent="Enter height";return;}
const bmi=(kg/(h*h)).toFixed(1);let cat="Normal";if(bmi<18.5)cat="Underweight";else if(bmi>=25)cat="Overweight";else if(bmi>=30)cat="Obese";
document.getElementById("display").innerHTML="BMI: <strong>"+bmi+"</strong><br><span style=\"font-size:1rem;color:var(--muted)\">"+cat+"</span>";}
document.getElementById("btn").onclick=calc;["kg","cm"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();