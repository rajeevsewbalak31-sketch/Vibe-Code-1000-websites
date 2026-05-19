const i = document.getElementById("text-in"), d = document.getElementById("display");
i.oninput = () => {
  const t = i.value.trim(), w = t ? t.split(/\s+/).length : 0;
  d.innerHTML = w + " words · " + i.value.length + " chars<br>~<b>" + Math.max(1, Math.ceil(w / 200)) + "</b> min read";
};
