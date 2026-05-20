/** Interactive app templates #201–300 */

export const APP_TEMPLATES = {
  "gradient-gen": {
    body: `<div class="app-panel">
      <div class="form-grid">
        <label class="field-label">Color A <input type="color" id="c1" value="#6c5ce7" class="input" /></label>
        <label class="field-label">Color B <input type="color" id="c2" value="#a29bfe" class="input" /></label>
        <label class="field-label">Angle <input type="range" id="ang" min="0" max="360" value="135" class="input" /></label>
      </div>
      <div id="prev" class="app-preview" style="min-height:6rem"></div>
      <pre id="out" class="code-out"></pre>
      <div class="actions"><button type="button" id="copy" class="btn btn--primary">Copy CSS</button></div>
    </div>`,
    script: () => `function upd(){const a=document.getElementById("c1").value,b=document.getElementById("c2").value,ang=document.getElementById("ang").value;
const css=\`background: linear-gradient(\${ang}deg, \${a}, \${b});\`;
document.getElementById("prev").style.background=\`linear-gradient(\${ang}deg, \${a}, \${b})\`;
document.getElementById("out").textContent=css;}
["c1","c2","ang"].forEach(id=>document.getElementById(id).addEventListener("input",upd));
document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").textContent);showToast("Copied!");};
upd();`,
  },

  "shadow-gen": {
    body: `<div class="app-panel">
      <div class="form-grid">
        <label class="field-label">X <input type="range" id="x" min="-40" max="40" value="0" /></label>
        <label class="field-label">Y <input type="range" id="y" min="-40" max="40" value="12" /></label>
        <label class="field-label">Blur <input type="range" id="blur" min="0" max="80" value="24" /></label>
        <label class="field-label">Spread <input type="range" id="spread" min="-20" max="40" value="0" /></label>
      </div>
      <div class="app-preview" style="display:grid;place-items:center;min-height:8rem"><div id="box" style="width:5rem;height:5rem;background:var(--accent);border-radius:.75rem"></div></div>
      <pre id="out" class="code-out"></pre>
      <button type="button" id="copy" class="btn btn--primary">Copy CSS</button>
    </div>`,
    script: () => `function upd(){const x=document.getElementById("x").value,y=document.getElementById("y").value,b=document.getElementById("blur").value,s=document.getElementById("spread").value;
const sh=\`box-shadow: \${x}px \${y}px \${b}px \${s}px rgba(0,0,0,.45);\`;
document.getElementById("box").style.boxShadow=\`\${x}px \${y}px \${b}px \${s}px rgba(0,0,0,.45)\`;
document.getElementById("out").textContent=sh;}
["x","y","blur","spread"].forEach(id=>document.getElementById(id).addEventListener("input",upd));document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("out").textContent);showToast("Copied!");};upd();`,
  },

  "bmi-calc": {
    body: `<div class="app-panel">
      <div class="form-grid">
        <label class="field-label">Weight (kg) <input type="number" id="kg" value="70" class="input" min="1" /></label>
        <label class="field-label">Height (cm) <input type="number" id="cm" value="175" class="input" min="50" /></label>
      </div>
      <p id="display" class="display">—</p>
      <button type="button" id="btn" class="btn btn--primary">Calculate</button>
    </div>`,
    script: () => `function calc(){const kg=parseFloat(document.getElementById("kg").value)||0,h=(parseFloat(document.getElementById("cm").value)||0)/100;
if(!h){document.getElementById("display").textContent="Enter height";return;}
const bmi=(kg/(h*h)).toFixed(1);let cat="Normal";if(bmi<18.5)cat="Underweight";else if(bmi>=25)cat="Overweight";else if(bmi>=30)cat="Obese";
document.getElementById("display").innerHTML="BMI: <strong>"+bmi+"</strong><br><span style=\\"font-size:1rem;color:var(--muted)\\">"+cat+"</span>";}
document.getElementById("btn").onclick=calc;["kg","cm"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },

  "percent-calc": {
    body: `<div class="app-panel">
      <div class="form-grid">
        <label class="field-label">Value <input type="number" id="val" value="200" class="input" /></label>
        <label class="field-label">Percent % <input type="number" id="pct" value="15" class="input" /></label>
      </div>
      <p id="display" class="display">—</p>
    </div>`,
    script: () => `function calc(){const v=parseFloat(document.getElementById("val").value)||0,p=parseFloat(document.getElementById("pct").value)||0;
const part=(v*p/100).toFixed(2);const total=(v+part).toFixed(2);
document.getElementById("display").innerHTML=p+"% of "+v+" = <strong>"+part+"</strong><br>Total: <strong>"+total+"</strong>";}
["val","pct"].forEach(id=>document.getElementById(id).addEventListener("input",calc));calc();`,
  },

  "roman-num": {
    body: `<div class="app-panel">
      <label class="field-label">Number (1–3999) <input type="number" id="num" value="2024" class="input" min="1" max="3999" /></label>
      <p id="display" class="display">—</p>
      <button type="button" id="btn" class="btn btn--ghost">Copy Roman</button>
    </div>`,
    script: () => `const map=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
function toRoman(n){let s="";for(const [v,sym] of map){while(n>=v){s+=sym;n-=v;}}return s;}
function upd(){const n=parseInt(document.getElementById("num").value,10)||0;document.getElementById("display").textContent=n>0&&n<4000?toRoman(n):"Out of range";}
document.getElementById("num").addEventListener("input",upd);document.getElementById("btn").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied!");};upd();`,
  },

  "binary-convert": {
    body: `<div class="app-panel">
      <label class="field-label">Decimal <input type="number" id="dec" value="42" class="input" /></label>
      <p id="display" class="display" style="font-size:1rem;text-align:left;align-items:flex-start"></p>
    </div>`,
    script: () => `function upd(){const n=parseInt(document.getElementById("dec").value,10)||0;
document.getElementById("display").innerHTML="Binary: <strong>"+n.toString(2)+"</strong><br>Hex: <strong>0x"+n.toString(16).toUpperCase()+"</strong><br>Octal: <strong>0o"+n.toString(8)+"</strong>";}
document.getElementById("dec").addEventListener("input",upd);upd();`,
  },

  "morse-code": {
    body: `<div class="app-panel">
      <textarea id="text" class="textarea" placeholder="Type a message">SOS</textarea>
      <p id="display" class="display" style="font-size:1.1rem;letter-spacing:.15em">—</p>
      <button type="button" id="copy" class="btn btn--ghost">Copy Morse</button>
    </div>`,
    script: () => `const M={A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."};
function enc(t){return t.toUpperCase().split("").map(c=>M[c]|| (c===" "?"/":"")).filter(Boolean).join(" ");}
function upd(){document.getElementById("display").textContent=enc(document.getElementById("text").value)||"—";}
document.getElementById("text").addEventListener("input",upd);document.getElementById("copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("display").textContent);showToast("Copied!");};upd();`,
  },

  "age-calc": {
    body: `<div class="app-panel">
      <label class="field-label">Birth date <input type="date" id="dob" class="input" /></label>
      <p id="display" class="display">—</p>
    </div>`,
    script: () => `const inp=document.getElementById("dob");inp.valueAsDate=new Date(2000,0,1);
function calc(){const b=inp.valueAsDate;if(!b)return;const now=new Date();let y=now.getFullYear()-b.getFullYear();let m=now.getMonth()-b.getMonth();let d=now.getDate()-b.getDate();
if(d<0){m--;d+=30;}if(m<0){y--;m+=12;}
document.getElementById("display").innerHTML="<strong>"+y+"</strong> years · <strong>"+m+"</strong> months · <strong>"+d+"</strong> days";}
inp.addEventListener("change",calc);calc();`,
  },

  "json-pretty": {
    body: `<div class="app-panel">
      <textarea id="raw" class="textarea" placeholder='{"hello":"world"}'>{"hello":"world","n":42}</textarea>
      <pre id="out" class="code-out" style="text-align:left;max-height:12rem;overflow:auto"></pre>
      <div class="actions"><button type="button" id="fmt" class="btn btn--primary">Format</button><button type="button" id="min" class="btn btn--ghost">Minify</button></div>
    </div>`,
    script: () => `document.getElementById("fmt").onclick=()=>{try{document.getElementById("out").textContent=JSON.stringify(JSON.parse(document.getElementById("raw").value),null,2);showToast("Valid JSON");}catch(e){showToast("Invalid JSON");}};
document.getElementById("min").onclick=()=>{try{document.getElementById("out").textContent=JSON.stringify(JSON.parse(document.getElementById("raw").value));showToast("Minified");}catch(e){showToast("Invalid JSON");}};`,
  },

  "markdown-preview": {
    body: `<div class="app-panel">
      <textarea id="md" class="textarea" placeholder="# Hello"># Hello\\n\\nWrite **Markdown** here.</textarea>
      <div id="preview" class="app-preview md-preview"></div>
    </div>`,
    style: `.textarea{min-height:6rem}`,
    script: () => `function render(md){return md.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>")
.replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\\*(.+?)\\*/g,"<em>$1</em>").replace(/\`([^\`]+)\`/g,"<code>$1</code>").replace(/\\n/g,"<br>");}
function upd(){document.getElementById("preview").innerHTML=render(document.getElementById("md").value);}
document.getElementById("md").addEventListener("input",upd);upd();`,
  },
};
