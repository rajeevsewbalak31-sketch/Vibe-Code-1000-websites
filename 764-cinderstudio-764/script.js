function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}
const key="habits";let items=JSON.parse(localStorage.getItem(key)||"[]");
function save(){localStorage.setItem(key,JSON.stringify(items));render();}
function render(){document.getElementById("list").innerHTML=items.map((h,i)=>"<li><label><input type=checkbox "+(h.done?"checked":"")+" data-i="+i+"> "+h.text+"</label></li>").join("");
document.querySelectorAll("#list input").forEach(cb=>cb.onchange=()=>{items[cb.dataset.i].done=cb.checked;save();});}
document.getElementById("add").onclick=()=>{const t=document.getElementById("habit").value.trim();if(t){items.push({text:t,done:false});document.getElementById("habit").value="";save();}};
render();