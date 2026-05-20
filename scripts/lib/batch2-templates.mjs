/** Creative tool templates #301–500 */

export const BATCH2_TEMPLATES = {
  "lorem-ipsum": {
    body: `<div class="app-panel">
      <label class="field-label">Paragraphs <input type="number" id="n" value="3" min="1" max="8" class="input" /></label>
      <textarea id="out" class="textarea" readonly></textarea>
      <button type="button" id="btn" class="btn btn--primary">Generate</button>
      <button type="button" id="copy" class="btn btn--ghost">Copy</button>
    </div>`,
    script: () => `const W="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor".split(" ");
function gen(p){let t=[];for(let i=0;i<p;i++){let s=[];for(let j=0;j<40+Math.floor(Math.random()*30);j++)s.push(W[Math.floor(Math.random()*W.length)]);t.push(s.join(" ").replace(/^./,c=>c.toUpperCase())+".");}return t.join("\\n\\n");}
document.getElementById("btn").onclick=()=>{document.getElementById("out").value=gen(parseInt(document.getElementById("n").value,10)||2);};
document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").value);showToast("Copied");};
document.getElementById("btn").click();`,
  },
  "uuid-gen": {
    body: `<div class="app-panel"><p id="display" class="display" style="font-size:1rem;word-break:break-all">—</p>
      <div class="actions"><button type="button" id="btn" class="btn btn--primary">New UUID</button><button type="button" id="copy" class="btn btn--ghost">Copy</button></div></div>`,
    script: () => `function uuid(){return crypto.randomUUID();}
function show(){document.getElementById("display").textContent=uuid();}
document.getElementById("btn").onclick=show;document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied");};show();`,
  },
  "base64-codec": {
    body: `<div class="app-panel"><textarea id="in" class="textarea" placeholder="Text to encode/decode">Hello Vibe Code</textarea>
      <div class="actions"><button type="button" id="enc" class="btn btn--primary">Encode</button><button type="button" id="dec" class="btn btn--ghost">Decode</button></div>
      <pre id="out" class="code-out"></pre></div>`,
    script: () => `document.getElementById("enc").onclick=()=>{document.getElementById("out").textContent=btoa(unescape(encodeURIComponent(document.getElementById("in").value)));};
document.getElementById("dec").onclick=()=>{try{document.getElementById("out").textContent=decodeURIComponent(escape(atob(document.getElementById("in").value)));}catch(e){showToast("Invalid Base64");}};`,
  },
  "slug-maker": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">My Cool Page Title!</textarea>
      <p id="display" class="display" style="font-size:1.2rem">—</p></div>`,
    script: () => `function slug(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function upd(){document.getElementById("display").textContent=slug(document.getElementById("in").value)||"—";}
document.getElementById("in").addEventListener("input",upd);upd();`,
  },
  "color-contrast": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Text <input type="color" id="fg" value="#ffffff" class="input" /></label>
      <label class="field-label">Background <input type="color" id="bg" value="#0a0d12" class="input" /></label></div>
      <div id="prev" class="app-preview" style="font-size:1.25rem;font-weight:600">Sample text Aa</div>
      <p id="display" class="display" style="font-size:1rem">—</p></div>`,
    script: () => `function lum(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
return (0.299*r+0.587*g+0.114*b)/255;}
function upd(){const fg=document.getElementById("fg").value,bg=document.getElementById("bg").value;
const p=document.getElementById("prev");p.style.color=fg;p.style.background=bg;
const L1=lum(fg)+0.05,L2=lum(bg)+0.05;const ratio=(Math.max(L1,L2)/Math.min(L1,L2)).toFixed(2);
document.getElementById("display").textContent="Contrast "+ratio+":1 — "+(ratio>=4.5?"AA pass":"Low contrast");}
document.getElementById("fg").oninput=document.getElementById("bg").oninput=upd;upd();`,
  },
  "hsl-picker": {
    body: `<div class="app-panel"><label class="field-label">Hue <input type="range" id="h" min="0" max="360" value="200" class="input" /></label>
      <div id="swatch" class="app-preview" style="min-height:5rem"></div><p id="display" class="display" style="font-size:1rem">—</p></div>`,
    script: () => `function upd(){const h=document.getElementById("h").value;const css="hsl("+h+" 65% 55%)";
document.getElementById("swatch").style.background=css;document.getElementById("display").textContent=css;}
document.getElementById("h").oninput=upd;upd();`,
  },
  "date-diff": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">From <input type="date" id="a" class="input" /></label>
      <label class="field-label">To <input type="date" id="b" class="input" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `const today=new Date().toISOString().slice(0,10);
document.getElementById("a").value=today;document.getElementById("b").value=today;
function calc(){const a=new Date(document.getElementById("a").value),b=new Date(document.getElementById("b").value);
const days=Math.round(Math.abs(b-a)/86400000);document.getElementById("display").innerHTML="<strong>"+days+"</strong> days apart";}
document.getElementById("a").onchange=document.getElementById("b").onchange=calc;calc();`,
  },
  "fuel-calc": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Distance (km) <input type="number" id="km" value="100" class="input" /></label>
      <label class="field-label">L/100km <input type="number" id="l" value="7" class="input" step="0.1" /></label>
      <label class="field-label">€/liter <input type="number" id="price" value="1.85" class="input" step="0.01" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const km=parseFloat(document.getElementById("km").value)||0,l=parseFloat(document.getElementById("l").value)||0,p=parseFloat(document.getElementById("price").value)||0;
const liters=km*l/100;const cost=liters*p;document.getElementById("display").innerHTML="Fuel: <strong>"+liters.toFixed(1)+" L</strong><br>Cost: <strong>€"+cost.toFixed(2)+"</strong>";}
["km","l","price"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },
  "aspect-ratio": {
    body: `<div class="app-panel"><label class="field-label">Width <input type="number" id="w" value="1920" class="input" /></label>
      <label class="field-label">Height <input type="number" id="h" value="1080" class="input" /></label>
      <label class="field-label"><input type="checkbox" id="lock" checked /> Lock 16:9</label>
      <p id="display" class="display" style="font-size:1rem">—</p></div>`,
    script: () => `let lock=true;document.getElementById("lock").onchange=e=>{lock=e.target.checked;};
document.getElementById("w").oninput=()=>{if(lock){const w=parseFloat(document.getElementById("w").value)||1;document.getElementById("h").value=Math.round(w*9/16);}upd();};
document.getElementById("h").oninput=upd;function upd(){const w=document.getElementById("w").value,h=document.getElementById("h").value;
document.getElementById("display").textContent=w+" × "+h+" · ratio "+(w/h).toFixed(3);}upd();`,
  },
  "timezone-clocks": {
    body: `<div class="app-panel"><p id="display" class="display" style="font-size:0.95rem;text-align:left;align-items:flex-start;line-height:1.8">—</p></div>`,
    script: () => `const zones=["UTC","America/New_York","Europe/London","Europe/Amsterdam","Asia/Tokyo","Australia/Sydney"];
function tick(){document.getElementById("display").innerHTML=zones.map(z=>"<strong>"+z.split("/").pop()+"</strong>: "+new Date().toLocaleTimeString("en-GB",{timeZone:z,hour:"2-digit",minute:"2-digit",second:"2-digit"})).join("<br>");}
setInterval(tick,1000);tick();`,
  },
  "word-frequency": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">the quick brown fox jumps over the lazy dog</textarea>
      <pre id="out" class="code-out" style="text-align:left"></pre></div>`,
    script: () => `function upd(){const words=document.getElementById("in").value.toLowerCase().match(/[a-z']+/g)||[];
const m={};words.forEach(w=>m[w]=(m[w]||0)+1);
const top=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([w,c])=>w+": "+c).join("\\n");
document.getElementById("out").textContent=top||"—";}
document.getElementById("in").addEventListener("input",upd);upd();`,
  },
  "typing-test": {
    body: `<div class="app-panel"><p id="display" class="display">Click Start</p>
      <textarea id="in" class="textarea" placeholder="Type here when test starts" disabled></textarea>
      <button type="button" id="btn" class="btn btn--primary">Start 30s</button></div>`,
    script: () => `const phrase="the quick brown fox jumps over the lazy dog and vibes with code";
let t0=0,timer=null;document.getElementById("btn").onclick=()=>{const inp=document.getElementById("in");inp.disabled=false;inp.value="";inp.focus();t0=Date.now();
document.getElementById("display").textContent="Go!";clearInterval(timer);timer=setInterval(()=>{const left=30-Math.floor((Date.now()-t0)/1000);
if(left<=0){clearInterval(timer);inp.disabled=true;const words=inp.value.trim().split(/\\s+/).filter(Boolean).length;
document.getElementById("display").innerHTML="<strong>"+Math.round(words*2)+" WPM</strong>";return;}
document.getElementById("display").textContent=left+"s left";},200);};`,
  },
  "password-meter": {
    body: `<div class="app-panel"><input type="password" id="pwd" class="input" placeholder="Type a password" autocomplete="off" />
      <div id="bar" style="height:.4rem;border-radius:999px;background:rgba(255,255,255,.1);margin:1rem 0;overflow:hidden"><div id="fill" style="height:100%;width:0;background:var(--accent);transition:width .2s"></div></div>
      <p id="display" class="display" style="font-size:1rem">—</p></div>`,
    script: () => `document.getElementById("pwd").oninput=()=>{const p=document.getElementById("pwd").value;let s=0;
if(p.length>=8)s++;if(p.length>=12)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;
const labels=["Weak","Fair","Good","Strong","Excellent"];document.getElementById("fill").style.width=(s*20)+"%";
document.getElementById("display").textContent=labels[s]||"Weak";};`,
  },
  "url-encode": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">hello world & more</textarea>
      <div class="actions"><button type="button" id="enc" class="btn btn--primary">Encode</button><button type="button" id="dec" class="btn btn--ghost">Decode</button></div>
      <pre id="out" class="code-out"></pre></div>`,
    script: () => `document.getElementById("enc").onclick=()=>{document.getElementById("out").textContent=encodeURIComponent(document.getElementById("in").value);};
document.getElementById("dec").onclick=()=>{try{document.getElementById("out").textContent=decodeURIComponent(document.getElementById("in").value);}catch(e){showToast("Invalid");}};`,
  },
  "qr-maker": {
    body: `<div class="app-panel"><textarea id="in" class="textarea">https://websites-eosin-delta.vercel.app</textarea>
      <canvas id="qr" style="margin:1rem auto;display:block;background:#fff;padding:8px;border-radius:.5rem;max-width:100%"></canvas>
      <button type="button" id="btn" class="btn btn--primary">Generate QR</button></div>`,
    script: () => `const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";s.onload=()=>{};
document.head.appendChild(s);
document.getElementById("btn").onclick=()=>{const v=document.getElementById("in").value;if(typeof QRCode==="undefined"){showToast("Loading library…");return;}
QRCode.toCanvas(document.getElementById("qr"),v,{width:200,margin:1},e=>{if(e)showToast("Error");else showToast("QR ready");});};`,
  },
  "flex-playground": {
    body: `<div class="app-panel"><div id="row" class="app-preview" style="display:flex;gap:.5rem;min-height:5rem;align-items:center;justify-content:flex-start;padding:1rem">
      <div style="width:3rem;height:3rem;background:var(--accent);border-radius:.5rem"></div>
      <div style="width:3rem;height:3rem;background:var(--accent-2);border-radius:.5rem"></div>
      <div style="width:3rem;height:3rem;background:rgba(255,255,255,.2);border-radius:.5rem"></div></div>
      <div class="actions"><button type="button" data-j="center" class="btn btn--ghost">Center</button><button type="button" data-j="space-between" class="btn btn--ghost">Space between</button>
      <button type="button" data-d="column" class="btn btn--ghost">Column</button></div></div>`,
    script: () => `const row=document.getElementById("row");
document.querySelectorAll("[data-j]").forEach(b=>b.onclick=()=>{row.style.justifyContent=b.dataset.j;});
document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{row.style.flexDirection=b.dataset.d;});`,
  },
  "tone-gen": {
    body: `<div class="app-panel"><label class="field-label">Frequency Hz <input type="range" id="f" min="200" max="1200" value="440" class="input" /></label>
      <p id="display" class="display">440 Hz</p>
      <div class="actions"><button type="button" id="play" class="btn btn--primary">Play tone</button><button type="button" id="stop" class="btn btn--ghost">Stop</button></div></div>`,
    script: () => `let ctx,osc;document.getElementById("f").oninput=()=>{document.getElementById("display").textContent=document.getElementById("f").value+" Hz";};
document.getElementById("play").onclick=()=>{ctx=ctx||new AudioContext();if(osc)osc.stop();osc=ctx.createOscillator();osc.frequency.value=document.getElementById("f").value;
osc.connect(ctx.destination);osc.start();};document.getElementById("stop").onclick=()=>{if(osc){osc.stop();osc=null;}};`,
  },
  "pixel-doodle": {
    body: `<div class="app-panel"><div id="grid" class="pixel-grid"></div>
      <button type="button" id="clr" class="btn btn--ghost">Clear</button></div>`,
    style: `.pixel-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:2px;max-width:16rem;margin:0 auto}
.pixel-grid button{aspect-ratio:1;border:none;border-radius:2px;background:rgba(255,255,255,.08);cursor:pointer;padding:0}
.pixel-grid button.on{background:var(--accent)}`,
    script: () => `const g=document.getElementById("grid");for(let i=0;i<256;i++){const b=document.createElement("button");b.type="button";
b.onclick=()=>b.classList.toggle("on");g.appendChild(b);}
document.getElementById("clr").onclick=()=>g.querySelectorAll("button").forEach(b=>b.classList.remove("on"));`,
  },
  "tip-splitter": {
    body: `<div class="app-panel"><div class="form-grid">
      <label class="field-label">Bill € <input type="number" id="bill" value="80" class="input" /></label>
      <label class="field-label">Tip % <input type="number" id="tip" value="18" class="input" /></label>
      <label class="field-label">People <input type="number" id="n" value="4" class="input" min="1" /></label></div>
      <p id="display" class="display">—</p></div>`,
    script: () => `function calc(){const b=parseFloat(document.getElementById("bill").value)||0,t=parseFloat(document.getElementById("tip").value)||0,n=Math.max(1,parseInt(document.getElementById("n").value,10));
const tip=b*t/100,tot=b+tip;document.getElementById("display").innerHTML="Each pays <strong>€"+(tot/n).toFixed(2)+"</strong><br>Tip €"+tip.toFixed(2);}
["bill","tip","n"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },
  "coin-stats": {
    body: `<div class="app-panel"><p id="display" class="display">Heads: 0 · Tails: 0</p>
      <div class="actions"><button type="button" id="flip" class="btn btn--primary">Flip</button><button type="button" id="rst" class="btn btn--ghost">Reset</button></div></div>`,
    script: () => `let h=0,t=0;document.getElementById("flip").onclick=()=>{if(Math.random()<0.5)h++;else t++;
const tot=h+t;document.getElementById("display").innerHTML="Heads: <strong>"+h+"</strong> ("+Math.round(100*h/tot)+"%)<br>Tails: <strong>"+t+"</strong> ("+Math.round(100*t/tot)+"%)";};
document.getElementById("rst").onclick=()=>{h=t=0;document.getElementById("display").textContent="Heads: 0 · Tails: 0";};`,
  },
};
