/** Lab templates #501–1000 */

export const BATCH3_TEMPLATES = {
  "text-reverse": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">Vibe Code 1000</textarea><p id="out" class="display" style="font-size:1.2rem">—</p></div>`,
    script: () => `document.getElementById("in").oninput=()=>{document.getElementById("out").textContent=document.getElementById("in").value.split("").reverse().join("");};document.getElementById("in").dispatchEvent(new Event("input"));`,
  },
  "caesar-cipher": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">Hello</textarea>
      <label class="field-label">Shift <input type="number" id="sh" value="3" min="1" max="25" class="input" /></label>
      <pre id="out" class="code-out"></pre></div>`,
    script: () => `function enc(t,s){return t.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+s)%26+b);});}
function upd(){document.getElementById("out").textContent=enc(document.getElementById("in").value,parseInt(document.getElementById("sh").value,10)||3);}
document.getElementById("in").oninput=document.getElementById("sh").oninput=upd;upd();`,
  },
  "prime-check": {
    body: `<div class="app-panel"><input type="number" id="n" value="17" class="input" /><p id="display" class="display">—</p></div>`,
    script: () => `function isPrime(n){if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}
function chk(){const n=parseInt(document.getElementById("n").value,10);document.getElementById("display").textContent=isPrime(n)?n+" is prime ✓":n+" is not prime";}
document.getElementById("n").oninput=chk;chk();`,
  },
  "fibonacci": {
    body: `<div class="app-panel"><label class="field-label">Count <input type="number" id="c" value="12" min="3" max="30" class="input" /></label>
      <pre id="out" class="code-out"></pre></div>`,
    script: () => `function gen(n){const a=[0,1];for(let i=2;i<n;i++)a.push(a[i-1]+a[i-2]);return a.join(", ");}
document.getElementById("c").oninput=()=>{document.getElementById("out").textContent=gen(parseInt(document.getElementById("c").value,10)||10);};
document.getElementById("c").dispatchEvent(new Event("input"));`,
  },
  "discount-calc": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Price € <input type="number" id="p" value="100" class="input" /></label>
      <label class="field-label">Discount % <input type="number" id="d" value="25" class="input" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const p=parseFloat(document.getElementById("p").value)||0,d=parseFloat(document.getElementById("d").value)||0;
const sale=p*(1-d/100);document.getElementById("display").innerHTML="Sale: <strong>€"+sale.toFixed(2)+"</strong><br>You save €"+(p-sale).toFixed(2);}
["p","d"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },
  "compound-interest": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Principal € <input type="number" id="p" value="1000" class="input" /></label>
      <label class="field-label">Rate % <input type="number" id="r" value="5" class="input" step="0.1" /></label>
      <label class="field-label">Years <input type="number" id="y" value="10" class="input" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const p=+document.getElementById("p").value,r=+document.getElementById("r").value/100,y=+document.getElementById("y").value;
const f=p*Math.pow(1+r,y);document.getElementById("display").innerHTML="Future: <strong>€"+f.toFixed(2)+"</strong>";}
["p","r","y"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },
  "sleep-calc": {
    body: `<div class="app-panel"><label class="field-label">Wake at <input type="time" id="wake" class="input" /></label>
      <p id="display" class="display" style="font-size:1rem">—</p></div>`,
    script: () => `const w=document.getElementById("wake");const n=new Date();w.value=n.getHours().toString().padStart(2,"0")+":"+n.getMinutes().toString().padStart(2,"0");
function calc(){const [h,m]=document.getElementById("wake").value.split(":").map(Number);
const beds=[];for(let c of [90,60,30]){const d=new Date();d.setHours(h,m-c*6-15,0,0);
beds.push(d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}));}
document.getElementById("display").innerHTML="Try sleeping at:<br><strong>"+beds.join("</strong><br><strong>")+"</strong>";}
document.getElementById("wake").onchange=calc;calc();`,
  },
  "water-intake": {
    body: `<div class="app-panel"><label class="field-label">Glasses today <input type="number" id="g" value="0" min="0" class="input" /></label>
      <p id="display" class="display">—</p><button type="button" id="plus" class="btn btn--primary">+1 glass</button></div>`,
    script: () => `const goal=8;function upd(){const g=parseInt(document.getElementById("g").value,10)||0;
document.getElementById("display").innerHTML=g+"/"+goal+" glasses · <strong>"+Math.round(g*250)+" ml</strong>";}
document.getElementById("g").oninput=upd;document.getElementById("plus").onclick=()=>{document.getElementById("g").value=(+document.getElementById("g").value||0)+1;upd();};upd();`,
  },
  "hash-display": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">hash me</textarea><pre id="out" class="code-out"></pre></div>`,
    script: () => `async function h(t){const b=new TextEncoder().encode(t);const d=await crypto.subtle.digest("SHA-256",b);
return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("");}
async function upd(){document.getElementById("out").textContent=await h(document.getElementById("in").value);}
document.getElementById("in").oninput=upd;upd();`,
  },
  "random-name": {
    body: `<div class="app-panel"><button type="button" id="btn" class="btn btn--primary">Random name</button><p id="display" class="display">—</p></div>`,
    script: () => `const first="Alex Sam Jordan Riley Morgan Casey Avery Quinn Sage River Sky Blake Dakota Reese Logan".split(" ");
const last="Vale Ashford Reed Moss Hart Fox Lane Brooks Shaw Quinn Frost Hartley Moss".split(" ");
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=first[Math.floor(Math.random()*first.length)]+" "+last[Math.floor(Math.random()*last.length)];};`,
  },
  "team-picker": {
    body: `<div class="app-panel"><textarea id="names" class="textarea">Alice, Bob, Charlie, Dana, Eve, Frank</textarea>
      <label class="field-label">Teams <input type="number" id="t" value="2" min="2" max="6" class="input" /></label>
      <button type="button" id="btn" class="btn btn--primary">Split teams</button><pre id="out" class="code-out" style="text-align:left"></pre></div>`,
    script: () => `document.getElementById("btn").onclick=()=>{const names=document.getElementById("names").value.split(/[,\\n]/).map(s=>s.trim()).filter(Boolean);
const t=Math.max(2,parseInt(document.getElementById("t").value,10));const teams=Array.from({length:t},()=>[]);
names.sort(()=>Math.random()-0.5).forEach((n,i)=>teams[i%t].push(n));
document.getElementById("out").textContent=teams.map((tm,i)=>"Team "+(i+1)+": "+tm.join(", ")).join("\\n");};`,
  },
  "event-countdown": {
    body: `<div class="app-panel"><label class="field-label">Event date <input type="datetime-local" id="ev" class="input" /></label>
      <p id="display" class="display">—</p></div>`,
    script: () => `function tick(){const end=new Date(document.getElementById("ev").value).getTime();
const left=Math.max(0,end-Date.now());const d=Math.floor(left/86400000),h=Math.floor(left%86400000/3600000);
document.getElementById("display").innerHTML="<strong>"+d+"</strong> days · <strong>"+h+"</strong> hours";}
const d=new Date();d.setDate(d.getDate()+30);document.getElementById("ev").value=d.toISOString().slice(0,16);
document.getElementById("ev").onchange=tick;setInterval(tick,1000);tick();`,
  },
  "metronome": {
    body: `<div class="app-panel"><label class="field-label">BPM <input type="range" id="bpm" min="40" max="200" value="100" class="input" /></label>
      <p id="display" class="display">100 BPM</p>
      <button type="button" id="btn" class="btn btn--primary">Start</button></div>`,
    script: () => `let iv=null,ctx;document.getElementById("bpm").oninput=()=>{document.getElementById("display").textContent=document.getElementById("bpm").value+" BPM";};
document.getElementById("btn").onclick=()=>{if(iv){clearInterval(iv);iv=null;document.getElementById("btn").textContent="Start";return;}
ctx=ctx||new AudioContext();const bpm=+document.getElementById("bpm").value;const ms=60000/bpm;
iv=setInterval(()=>{const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
o.frequency.value=800;g.gain.value=0.1;o.start();o.stop(ctx.currentTime+0.05);},ms);document.getElementById("btn").textContent="Stop";};`,
  },
  "habit-tracker": {
    body: `<div class="app-panel"><input type="text" id="habit" class="input" placeholder="New habit" />
      <button type="button" id="add" class="btn btn--ghost">Add</button><ul id="list" class="lap-list"></ul></div>`,
    script: () => `const key="habits";let items=JSON.parse(localStorage.getItem(key)||"[]");
function save(){localStorage.setItem(key,JSON.stringify(items));render();}
function render(){document.getElementById("list").innerHTML=items.map((h,i)=>"<li><label><input type=checkbox "+(h.done?"checked":"")+" data-i="+i+"> "+h.text+"</label></li>").join("");
document.querySelectorAll("#list input").forEach(cb=>cb.onchange=()=>{items[cb.dataset.i].done=cb.checked;save();});}
document.getElementById("add").onclick=()=>{const t=document.getElementById("habit").value.trim();if(t){items.push({text:t,done:false});document.getElementById("habit").value="";save();}};
render();`,
  },
  "notes-pad": {
    body: `<div class="app-panel"><textarea id="note" class="textarea" style="min-height:10rem" placeholder="Notes…"></textarea>
      <p class="hint" style="margin-top:.5rem">Auto-saved in this browser</p></div>`,
    script: () => `const k="notes";const n=document.getElementById("note");n.value=localStorage.getItem(k)||"";
n.oninput=()=>localStorage.setItem(k,n.value);`,
  },
  "emoji-grid": {
    body: `<div class="app-panel"><div id="grid" class="emoji-grid"></div></div>`,
    style: `.emoji-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:.35rem;font-size:1.5rem}
.emoji-grid button{border:none;background:rgba(255,255,255,.06);border-radius:.35rem;padding:.4rem;cursor:pointer}`,
    script: () => `const em="😀😂🥰😎🤔👍🎉🔥✨🚀💡🎯⭐🌟🎮🎲🎨🎵🍕☕🌈🌙☀️🐱🐶🦊🐸🌸🌻⚡️💎🏆".split("");
const g=document.getElementById("grid");em.forEach(e=>{const b=document.createElement("button");b.textContent=e;b.onclick=()=>{navigator.clipboard.writeText(e);showToast("Copied "+e);};g.appendChild(b);});`,
  },
  "poll-vote": {
    body: `<div class="app-panel"><input type="text" id="a" class="input" value="Option A" /><input type="text" id="b" class="input" value="Option B" />
      <div class="actions"><button type="button" data-v="a" class="btn btn--ghost">Vote A</button><button type="button" data-v="b" class="btn btn--ghost">Vote B</button></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `let va=0,vb=0;function upd(){const t=va+vb||1;document.getElementById("display").innerHTML=
document.getElementById("a").value+": <strong>"+Math.round(100*va/t)+"%</strong><br>"+document.getElementById("b").value+": <strong>"+Math.round(100*vb/t)+"%</strong>";}
document.querySelector('[data-v="a"]').onclick=()=>{va++;upd();};document.querySelector('[data-v="b"]').onclick=()=>{vb++;upd();};`,
  },
  "card-draw": {
    body: `<div class="app-panel"><p id="display" class="display" style="font-size:2rem">?</p>
      <button type="button" id="btn" class="btn btn--primary">Draw card</button></div>`,
    script: () => `const suits="♠♥♦♣", ranks="A23456789TJQK";
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=
ranks[Math.floor(Math.random()*13)]+suits[Math.floor(Math.random()*4)];};`,
  },
  "meme-text": {
    body: `<div class="app-panel"><input type="text" id="top" class="input" placeholder="Top text" value="WHEN YOU" />
      <input type="text" id="bot" class="input" placeholder="Bottom text" value="SHIP SITE #500" />
      <div id="meme" class="app-preview" style="min-height:8rem;display:grid;align-content:space-between;text-align:center;font-weight:800;font-size:1.1rem;padding:1rem;background:linear-gradient(135deg,#333,#111)"></div></div>`,
    script: () => `function upd(){const m=document.getElementById("meme");
m.innerHTML="<div>"+document.getElementById("top").value.toUpperCase()+"</div><div>"+document.getElementById("bot").value.toUpperCase()+"</div>";}
document.getElementById("top").oninput=document.getElementById("bot").oninput=upd;upd();`,
  },
  "sales-tax": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Price € <input type="number" id="p" value="50" class="input" /></label>
      <label class="field-label">Tax % <input type="number" id="t" value="21" class="input" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const p=+document.getElementById("p").value,t=+document.getElementById("t").value;
const tax=p*t/100;document.getElementById("display").innerHTML="Total: <strong>€"+(p+tax).toFixed(2)+"</strong> (tax €"+tax.toFixed(2)+")";}
["p","t"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },
  "steps-km": {
    body: `<div class="app-panel"><label class="field-label">Steps <input type="number" id="s" value="10000" class="input" /></label>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const s=+document.getElementById("s").value;const km=(s*0.000762).toFixed(2);
document.getElementById("display").innerHTML="<strong>"+km+"</strong> km walked";}
document.getElementById("s").oninput=calc;calc();`,
  },
  "dice-visual": {
    body: `<div class="app-panel"><div id="die" class="app-preview" style="font-size:4rem;font-weight:700;min-height:6rem;display:grid;place-items:center">?</div>
      <button type="button" id="btn" class="btn btn--primary">Roll</button></div>`,
    script: () => `document.getElementById("btn").onclick=()=>{const v=1+Math.floor(Math.random()*6);
const die=document.getElementById("die");die.textContent=v;die.style.transform="rotate("+Math.random()*20+"deg) scale(1.05)";setTimeout(()=>die.style.transform="",200);};`,
  },
  "binary-text": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">Hi</textarea><pre id="out" class="code-out"></pre>
      <button type="button" id="dec" class="btn btn--ghost">To text</button></div>`,
    script: () => `document.getElementById("in").oninput=()=>{document.getElementById("out").textContent=
document.getElementById("in").value.split("").map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");};
document.getElementById("dec").onclick=()=>{try{document.getElementById("in").value=document.getElementById("out").textContent.split(/\\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join("");}catch(e){showToast("Invalid");}};
document.getElementById("in").dispatchEvent(new Event("input"));`,
  },
  "lorem-title": {
    body: `<div class="app-panel"><button type="button" id="btn" class="btn btn--primary">Generate name</button><p id="display" class="display">—</p></div>`,
    script: () => `const a="Nova Pulse Drift Prism Echo Flux Spark Orbit Zenith Lumen".split(" ");
const b="Labs Hub Kit Box Works Studio Forge Port Mint".split(" ");
document.getElementById("btn").onclick=()=>{document.getElementById("display").textContent=
a[Math.floor(Math.random()*a.length)]+" "+b[Math.floor(Math.random()*b.length)];};`,
  },
  "color-palette-gen": {
    body: `<div class="app-panel"><div id="swatches" style="display:flex;height:4rem;border-radius:.5rem;overflow:hidden;margin-bottom:1rem"></div>
      <pre id="out" class="code-out"></pre><button type="button" id="btn" class="btn btn--primary">New palette</button></div>`,
    script: () => `function gen(){const h=Math.floor(Math.random()*360);const cols=[0,1,2,3].map(i=>"hsl("+(h+i*30)%360+" 55% 55%)");
document.getElementById("swatches").innerHTML=cols.map(c=>'<div style="flex:1;background:'+c+'"></div>').join("");
document.getElementById("out").textContent=cols.join("\\n");}
document.getElementById("btn").onclick=gen;gen();`,
  },
};
