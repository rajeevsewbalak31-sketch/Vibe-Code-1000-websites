# Run from repo:  powershell -ExecutionPolicy Bypass -File websites\scripts\build-all.ps1
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Sites = Get-Content (Join-Path $PSScriptRoot "sites.json") -Raw | ConvertFrom-Json
$PayPal = "https://paypal.me/RajeevSewbalak"

function Get-Css($accent, $accent2) {
  $glow = $accent + "59"
  @"
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg-deep:#0c0f14;--bg-card:rgba(255,255,255,.06);--border:rgba(255,255,255,.1);--text:#f4f0ea;--text-muted:rgba(244,240,234,.55);--accent:$accent;--accent-glow:$glow;--accent-2:$accent2;--font-display:"Fraunces",Georgia,serif;--font-ui:"Outfit",system-ui,sans-serif;--radius:1.25rem}
html{font-size:100%;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;font-family:var(--font-ui);color:var(--text);background:var(--bg-deep);overflow-x:hidden}
.bg{position:fixed;inset:0;z-index:0;overflow:hidden;background:radial-gradient(ellipse 120% 80% at 50% 0%,#1a2332 0%,var(--bg-deep) 55%)}
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.45;animation:drift 18s ease-in-out infinite}
.orb--1{width:min(55vw,420px);height:min(55vw,420px);background:color-mix(in srgb,var(--accent) 40%,#1a2332);top:-10%;left:-8%}
.orb--2{width:min(45vw,320px);height:min(45vw,320px);background:color-mix(in srgb,var(--accent-2) 35%,#0c0f14);bottom:5%;right:-5%;animation-delay:-6s}
.grain{position:absolute;inset:0;opacity:.04;pointer-events:none}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(4%,6%)}}
.page{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;min-height:100dvh;padding:2rem 1.25rem 5rem;max-width:32rem;margin:0 auto}
.header{text-align:center;margin-bottom:1.5rem}
.eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem}
.logo{font-family:var(--font-display);font-size:clamp(2rem,8vw,2.75rem);font-weight:600}
.tagline{margin-top:.35rem;color:var(--text-muted)}
.card{width:100%;padding:1.75rem 1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 24px 80px rgba(0,0,0,.45)}
.display{font-family:var(--font-display);font-size:clamp(1.25rem,5vw,2rem);text-align:center;min-height:3rem;display:flex;align-items:center;justify-content:center;flex-direction:column}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-top:1.5rem}
.btn{padding:.85rem 1.5rem;font-family:var(--font-ui);font-size:.95rem;font-weight:500;border:none;border-radius:999px;cursor:pointer}
.btn--primary{color:var(--bg-deep);background:linear-gradient(135deg,var(--accent),var(--accent-2))}
.btn--ghost{color:var(--text);background:rgba(255,255,255,.08);border:1px solid var(--border)}
.field-label{display:flex;flex-direction:column;gap:.35rem;font-size:.8rem;color:var(--text-muted);margin-bottom:.75rem}
.form-grid{display:grid;gap:.75rem;margin-bottom:1rem}
.input,.textarea{width:100%;padding:.65rem .85rem;font-size:1rem;color:var(--text);background:rgba(0,0,0,.25);border:1px solid var(--border);border-radius:.75rem}
.textarea{min-height:5rem;resize:vertical}
.color-swatch{width:100%;height:5rem;border-radius:.75rem;margin-bottom:1rem;border:1px solid var(--border)}
.rps-row,.mood-grid{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:1rem}
.lap-list{list-style:none;margin-top:1rem;max-height:8rem;overflow-y:auto;font-size:.85rem;color:var(--text-muted)}
#ring{width:7rem;height:7rem;margin:0 auto 1rem;border-radius:50%;border:3px solid var(--accent);transition:transform 1s ease}
.tip-jar{margin-top:2rem;text-align:center;padding-top:1.5rem;border-top:1px solid var(--border);width:100%}
.tip-jar p{font-size:.85rem;color:var(--text-muted);margin-bottom:.5rem}
.tip-link{display:inline-block;padding:.55rem 1.1rem;font-size:.85rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#0070ba,#003087);border-radius:999px;text-decoration:none}
.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);padding:.65rem 1.25rem;background:var(--accent-2);border-radius:999px;opacity:0;transition:opacity .3s;z-index:10}
.toast.is-visible{opacity:1}
"@
}

function Get-Script($logic) {
  $toast = @'
function showToast(m){const t=document.getElementById("toast");if(!t)return;t.textContent=m;t.classList.add("is-visible");setTimeout(()=>t.classList.remove("is-visible"),2200);}
'@
  switch ($logic) {
    "coin-flip" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>{d.textContent="…";setTimeout(()=>d.textContent=Math.random()<.5?"Heads":"Tails",400);};
'@ }
    "dice-roll" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),n=document.getElementById("dice-count");
b.onclick=()=>{const c=Math.min(6,Math.max(1,+n.value||1));d.textContent=Array.from({length:c},()=>1+Math.floor(Math.random()*6)).join(" · ");};
'@ }
    "yes-or-no" { return $toast + @'
const a=["Yes","No","Maybe","Ask again","Definitely","Not today"],d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>d.textContent=a[Math.floor(Math.random()*a.length)];
'@ }
    "random-color" { return $toast + @'
const s=document.getElementById("swatch"),d=document.getElementById("display"),b=document.getElementById("btn-action"),c=document.getElementById("btn-copy");
function pick(){const h="#"+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0");s.style.background=h;d.textContent=h.toUpperCase();}
b.onclick=pick;c.onclick=()=>{navigator.clipboard.writeText(d.textContent);showToast("Copied!");};pick();
'@ }
    "password-gen" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),l=document.getElementById("pwd-len"),c=document.getElementById("btn-copy"),ch="abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
function gen(){const n=Math.min(64,Math.max(8,+l.value||16));let p="";const a=new Uint32Array(n);crypto.getRandomValues(a);for(let i=0;i<n;i++)p+=ch[a[i]%ch.length];d.textContent=p;}
b.onclick=gen;c.onclick=()=>{navigator.clipboard.writeText(d.textContent);showToast("Copied!");};gen();
'@ }
    "countdown" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),s=document.getElementById("btn-stop"),m=document.getElementById("minutes");
let t,e;function tick(){const l=Math.max(0,e-Date.now()),sec=Math.ceil(l/1000);d.textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0");if(l<=0){clearInterval(t);showToast("Done!");}}
b.onclick=()=>{e=Date.now()+(Math.max(1,+m.value||5)*60000);clearInterval(t);t=setInterval(tick,200);tick();};
s.onclick=()=>{clearInterval(t);d.textContent="Stopped";};
'@ }
    "pomodoro" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),r=document.getElementById("btn-reset");
let s=1500,t,run;function R(){d.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
b.onclick=()=>{if(run){clearInterval(t);run=0;b.textContent="Resume";return;}run=1;b.textContent="Pause";t=setInterval(()=>{if(s<=0){clearInterval(t);run=0;s=1500;R();showToast("Done!");b.textContent="Start 25 min";return;}s--;R();},1000);};
r.onclick=()=>{clearInterval(t);run=0;s=1500;R();b.textContent="Start 25 min";};R();
'@ }
    "tip-calc" { return $toast + @'
const bill=document.getElementById("bill"),pct=document.getElementById("tip-pct"),people=document.getElementById("people"),d=document.getElementById("display");
function c(){const b=+bill.value||0,p=+pct.value||15,n=Math.max(1,+people.value||1),tip=b*p/100,tot=b+tip;d.innerHTML="Tip: <strong>€"+tip.toFixed(2)+"</strong><br>Total: <strong>€"+tot.toFixed(2)+"</strong><br>Each: <strong>€"+(tot/n).toFixed(2)+"</strong>";}
[bill,pct,people].forEach(e=>e.oninput=c);c();
'@ }
    "compliment" { return $toast + @'
const L=["You're doing great.","Your energy matters.","Small wins count.","Keep going — you've got this.","The world needs your vibe.","You're stronger than you think.","Today is better with you in it."],d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>d.textContent=L[Math.floor(Math.random()*L.length)];
'@ }
    "magic-8ball" { return $toast + @'
const R=["It is certain","Yes","Outlook good","Maybe","Ask again","Unlikely","No","Very doubtful"],d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>{d.textContent="…";setTimeout(()=>d.textContent=R[Math.floor(Math.random()*R.length)],500);};
'@ }
    "rps" { return $toast + @'
const C=["Rock","Paper","Scissors"],d=document.getElementById("display");
document.querySelectorAll("[data-pick]").forEach(btn=>btn.onclick=()=>{const y=btn.dataset.pick,c=C[Math.floor(Math.random()*3)];let r="Draw";if((y==="Rock"&&c==="Scissors")||(y==="Paper"&&c==="Rock")||(y==="Scissors"&&c==="Paper"))r="You win!";else if(y!==c)r="CPU wins";d.innerHTML="You: <b>"+y+"</b> · CPU: <b>"+c+"</b><br>"+r;});
'@ }
    "lucky-number" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),mn=document.getElementById("min"),mx=document.getElementById("max");
b.onclick=()=>{const a=+mn.value||1,z=+mx.value||100,lo=Math.min(a,z),hi=Math.max(a,z);d.textContent=lo+Math.floor(Math.random()*(hi-lo+1));};
'@ }
    "word-counter" { return $toast + @'
const i=document.getElementById("text-in"),d=document.getElementById("display");
i.oninput=()=>{const t=i.value.trim(),w=t?t.split(/\s+/).length:0;d.innerHTML=w+" words · "+i.value.length+" chars<br>~<b>"+Math.max(1,Math.ceil(w/200))+"</b> min read";};
'@ }
    "stopwatch" { return $toast + @'
const d=document.getElementById("display"),b=document.getElementById("btn-action"),lap=document.getElementById("btn-lap"),rst=document.getElementById("btn-reset"),L=document.getElementById("laps");
let st=0,el=0,t,run;
function F(ms){const s=Math.floor(ms/1000),cs=Math.floor(ms%1000/10);return s+"."+String(cs).padStart(2,"0")+"s";}
function R(){d.textContent=F(run?Date.now()-st+el:el);}
b.onclick=()=>{if(!run){st=Date.now();run=1;b.textContent="Stop";t=setInterval(R,50);}else{clearInterval(t);el+=Date.now()-st;run=0;b.textContent="Start";R();}};
lap.onclick=()=>{if(!run)return;const li=document.createElement("li");li.textContent="Lap: "+F(Date.now()-st+el);L.prepend(li);};
rst.onclick=()=>{clearInterval(t);run=0;el=0;L.innerHTML="";d.textContent="0.00s";b.textContent="Start";};
'@ }
    "breathing" { return $toast + @'
const d=document.getElementById("display"),ring=document.getElementById("ring"),b=document.getElementById("btn-action");
const P=[{l:"Inhale",s:4,sc:1.2},{l:"Hold",s:7,sc:1.2},{l:"Exhale",s:8,sc:.85}];
let run,i,left,t;
function step(){const p=P[i];d.textContent=p.l+" · "+left+"s";ring.style.transform="scale("+p.sc+")";if(left<=0){i=(i+1)%P.length;left=P[i].s;return;}left--;}
b.onclick=()=>{if(run){clearInterval(t);run=0;b.textContent="Start 4-7-8";return;}run=1;b.textContent="Stop";i=0;left=P[0].s;t=setInterval(step,1000);step();};
'@ }
    "spin-wheel" { return $toast + @'
const o=document.getElementById("options"),d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>{const opts=o.value.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);if(!opts.length){d.textContent="Add options";return;}d.textContent=opts[Math.floor(Math.random()*opts.length)];};
'@ }
    "unit-convert" { return $toast + @'
const km=document.getElementById("km"),mi=document.getElementById("miles");let lock=0;
km.oninput=()=>{if(lock)return;lock=1;mi.value=(+km.value*0.621371||0).toFixed(2);lock=0;};
mi.oninput=()=>{if(lock)return;lock=1;km.value=(+mi.value*1.60934||0).toFixed(2);lock=0;};
'@ }
    "mood-picker" { return $toast + @'
const d=document.getElementById("display"),log=document.getElementById("mood-log");
document.querySelectorAll("[data-mood]").forEach(btn=>btn.onclick=()=>{const m=btn.dataset.mood;d.textContent="Feeling "+m;const li=document.createElement("li");li.textContent=new Date().toLocaleTimeString()+" — "+m;log.prepend(li);});
'@ }
    "name-picker" { return $toast + @'
const n=document.getElementById("names"),d=document.getElementById("display"),b=document.getElementById("btn-action");
b.onclick=()=>{const a=n.value.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);if(!a.length){d.textContent="Add names";return;}d.textContent=a[Math.floor(Math.random()*a.length)];};
'@ }
    "gratitude" { return $toast + @'
const n=document.getElementById("note"),log=document.getElementById("log"),b=document.getElementById("btn-action");
b.onclick=()=>{const t=n.value.trim();if(!t)return;const li=document.createElement("li");li.textContent=t;log.prepend(li);n.value="";showToast("Saved!");};
'@ }
    default { return $toast + "/* no script */" }
  }
}

function Get-ExtraHtml($logic) {
  switch ($logic) {
    "dice-roll" { return '<label class="field-label">Dice <input id="dice-count" type="number" min="1" max="6" value="2" class="input"/></label>' }
    "random-color" { return '<div id="swatch" class="color-swatch"></div>' }
    "password-gen" { return '<label class="field-label">Length <input id="pwd-len" type="number" min="8" max="64" value="16" class="input"/></label>' }
    "countdown" { return '<label class="field-label">Minutes <input id="minutes" type="number" min="1" value="5" class="input"/></label>' }
    "tip-calc" { return '<motion-div class="form-grid"><label class="field-label">Bill €<input id="bill" type="number" value="50" class="input"/></label><label class="field-label">Tip %<input id="tip-pct" type="number" value="15" class="input"/></label><label class="field-label">People<input id="people" type="number" value="2" class="input"/></label></motion-div>' -replace 'motion-div','div' }
    "rps" { return '<div class="rps-row"><button type="button" class="btn btn--ghost" data-pick="Rock">Rock</button><button type="button" class="btn btn--ghost" data-pick="Paper">Paper</button><button type="button" class="btn btn--ghost" data-pick="Scissors">Scissors</button></div>' }
    "lucky-number" { return '<div class="form-grid"><label class="field-label">Min<input id="min" type="number" value="1" class="input"/></label><label class="field-label">Max<input id="max" type="number" value="100" class="input"/></label></div>' }
    "word-counter" { return '<textarea id="text-in" class="textarea" placeholder="Paste text…"></textarea>' }
    "stopwatch" { return '<ul id="laps" class="lap-list"></ul>' }
    "spin-wheel" { return '<textarea id="options" class="textarea" placeholder="Pizza, Sushi, Tacos"></textarea>' }
    "unit-convert" { return '<motion-div class="form-grid"><label class="field-label">Km<input id="km" type="number" value="10" class="input"/></label><label class="field-label">Miles<input id="miles" type="number" value="6.21" class="input"/></label></motion-div>' -replace 'motion-div','motion-div' -replace 'motion-div','motion-div' }
    "mood-picker" { return '<div class="mood-grid">' + ((@("Calm","Excited","Tired","Grateful","Curious","Stressed","Hopeful","Playful") | ForEach-Object { "<button type=`"button`" class=`"btn btn--ghost`" data-mood=`"$_`">$_</button>" }) -join '') + '</div><ul id="mood-log" class="lap-list"></ul>' }
    "name-picker" { return '<textarea id="names" class="textarea" placeholder="Alice, Bob, Charlie"></textarea>' }
    "gratitude" { return '<textarea id="note" class="textarea" placeholder="I am grateful for…"></textarea><ul id="log" class="lap-list"></ul>' }
    "breathing" { return '<div id="ring"></div>' }
    default { return '' }
  }
}

function Get-Buttons($logic) {
  $labels = @{ "countdown"="Start"; "pomodoro"="Start 25 min"; "gratitude"="Save"; "name-picker"="Pick"; "spin-wheel"="Spin"; "breathing"="Start 4-7-8"; "stopwatch"="Start"; "password-gen"="Generate"; "random-color"="New color"; "coin-flip"="Flip" }
  $label = if ($labels.ContainsKey($logic)) { $labels[$logic] } else { "Go" }
  $main = if (@("rps","mood-picker","unit-convert","word-counter") -contains $logic) { "" } else { "<button type=`"button`" id=`"btn-action`" class=`"btn btn--primary`">$label</button>" }
  $extra = switch ($logic) {
    "countdown" { '<button type="button" id="btn-stop" class="btn btn--ghost">Stop</button>' }
    "pomodoro" { '<button type="button" id="btn-reset" class="btn btn--ghost">Reset</button>' }
    "random-color" { '<button type="button" id="btn-copy" class="btn btn--ghost">Copy</button>' }
    "password-gen" { '<button type="button" id="btn-copy" class="btn btn--ghost">Copy</button>' }
    "stopwatch" { '<button type="button" id="btn-lap" class="btn btn--ghost">Lap</button><button type="button" id="btn-reset" class="btn btn--ghost">Reset</button>' }
    default { "" }
  }
  return $main + $extra
}

$created = 0
foreach ($site in $Sites) {
  $dir = Join-Path $Root "$($site.id)-$($site.slug)"
  if (Test-Path $dir) { Write-Host "Skip $($site.id)"; continue }
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  $extra = Get-ExtraHtml $site.logic
  if ($site.logic -eq "unit-convert") { $extra = '<div class="form-grid"><label class="field-label">Km<input id="km" type="number" value="10" class="input"/></label><label class="field-label">Miles<input id="miles" type="number" value="6.21" class="input"/></label></div>' }
  if ($site.logic -eq "tip-calc") { $extra = '<motion-div class="form-grid"><label class="field-label">Bill<input id="bill" type="number" value="50" class="input"/></label><label class="field-label">Tip %<input id="tip-pct" type="number" value="15" class="input"/></label><label class="field-label">People<input id="people" type="number" value="2" class="input"/></label></motion-div>' -replace 'motion-div','div' }
  $disp = if (@("tip-calc","rps","word-counter") -contains $site.logic) { '<div id="display" class="display">—</div>' } else { '<p id="display" class="display">—</p>' }
  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="description" content="$($site.tagline)"/>
<title>$($site.name) — #$($site.id)</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="style.css"/>
</head>
<body>
<div class="bg" aria-hidden="true"><span class="orb orb--1"></span><span class="orb orb--2"></span><span class="grain"></span></div>
<main class="page">
<header class="header"><p class="eyebrow">Website #$($site.id)</p><h1 class="logo">$($site.name)</h1><p class="tagline">$($site.tagline)</p></header>
<article class="card">$extra$disp<div class="actions">$(Get-Buttons $site.logic)</div></article>
<footer class="tip-jar"><p>Enjoying this tool? Support the 1000 Websites Challenge</p>
<a class="tip-link" href="$PayPal" target="_blank" rel="noopener">Tip via PayPal</a></footer>
</main>
<p id="toast" class="toast" role="status"></p>
<script src="script.js"></script>
</body>
</html>
"@
  Set-Content (Join-Path $dir "index.html") $html -Encoding UTF8
  Set-Content (Join-Path $dir "style.css") (Get-Css $site.accent $site.accent2) -Encoding UTF8
  Set-Content (Join-Path $dir "script.js") (Get-Script $site.logic) -Encoding UTF8
  $created++
  Write-Host "Created $($site.id)-$($site.slug)"
}
Write-Host "Done. $created new sites in $Root"
