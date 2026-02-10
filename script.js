const $ = (id) => document.getElementById(id);

const state = {
  step: "first",
  noMoves: 0,
  love: 100
};

function motionOk(){
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyTheme() {
  const c = window.config;
  document.documentElement.style.setProperty("--bg1", c.colors.backgroundStart);
  document.documentElement.style.setProperty("--bg2", c.colors.backgroundEnd);
  document.documentElement.style.setProperty("--accent", c.colors.buttonBackground);
  document.documentElement.style.setProperty("--accent2", c.colors.buttonHover);
  document.documentElement.style.setProperty("--text", c.colors.textColor);

  $("pageTitle").textContent = c.pageTitle;
  document.title = c.pageTitle;
  $("heroTitle").textContent = c.pageTitle;
  $("heroSub").textContent = `${c.valentineName} ❤️`;
}

function spawnFloaters() {
  const layer = $("floatLayer");
  if (!layer) return;

  const { hearts, bears } = window.config.floatingEmojis;
  const emojis = [...hearts, ...bears];

  const count = 22;
  layer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "float";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const x = Math.floor(Math.random() * 100);
    const drift = (Math.random() * 2 - 1) * parseFloat(window.config.animations.floatDistance || "50");
    const dur = window.config.animations.floatDuration || "15s";
    const delay = (-Math.random() * 12).toFixed(2) + "s";
    const size = 18 + Math.floor(Math.random() * 16);

    el.style.setProperty("--x", x + "vw");
    el.style.setProperty("--drift", drift + "px");
    el.style.setProperty("--dur", dur);
    el.style.fontSize = size + "px";
    el.style.animationDelay = delay;

    layer.appendChild(el);
  }
}

function burstFX({ x, y, count = 60, emojis = ["❤️","💖","💝","💕","✨"] }){
  if (!motionOk()) return;

  const layer = $("fxLayer");
  if (!layer) return;

  const scale = window.config.animations?.heartExplosionSize ?? 1.0;
  const realCount = Math.round(count * Math.max(0.6, Math.min(2.2, scale)));

  for (let i = 0; i < realCount; i++){
    const p = document.createElement("div");
    p.className = "fx";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = Math.random() * Math.PI * 2;
    const power = (80 + Math.random() * 260) * scale;

    const dx = Math.cos(angle) * power;
    const dy = Math.sin(angle) * power - (80 + Math.random() * 120);
    const r = (Math.random() * 520 - 260).toFixed(0) + "deg";
    const t = (700 + Math.random() * 700).toFixed(0) + "ms";
    const size = (16 + Math.random() * 18) * (0.9 + 0.25*scale);

    p.style.setProperty("--x", x + "px");
    p.style.setProperty("--y", y + "px");
    p.style.setProperty("--dx", dx.toFixed(0) + "px");
    p.style.setProperty("--dy", dy.toFixed(0) + "px");
    p.style.setProperty("--r", r);
    p.style.setProperty("--t", t);
    p.style.setProperty("--size", size.toFixed(0) + "px");

    layer.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}

/* Floating hearts INSIDE memories div */
function mountMemFloatLayer(){
  const root = $("memories");
  if (!root) return null;

  let layer = root.querySelector(".mem-float-layer");
  if (!layer){
    layer = document.createElement("div");
    layer.className = "mem-float-layer";
    root.prepend(layer);
  }
  return layer;
}

function spawnMemHearts(){
  if (!motionOk()) return;

  const root = $("memories");
  if (!root || !root.innerHTML.trim()) return;

  const layer = mountMemFloatLayer();
  if (!layer) return;

  layer.innerHTML = "";
  const hearts = (window.config.floatingEmojis?.hearts || ["❤️","💖","💝","💕","💗"]);

  const count = 26; // richer inside quote div
  for (let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.className = "mem-float";
    el.textContent = hearts[Math.floor(Math.random()*hearts.length)];

    const x = Math.floor(Math.random()*100);
    const dx = (Math.random()*2 - 1) * 90;
    const t = (5 + Math.random()*6).toFixed(2) + "s";
    const s = (14 + Math.random()*20).toFixed(0) + "px";
    const delay = (-Math.random()*7).toFixed(2) + "s";

    const h = Math.floor(Math.random()*360) + "deg";
    const hc = (2.8 + Math.random()*4.5).toFixed(2) + "s";

    el.style.setProperty("--x", x + "%");
    el.style.setProperty("--dx", dx.toFixed(0) + "px");
    el.style.setProperty("--t", t);
    el.style.setProperty("--s", s);
    el.style.setProperty("--h", h);
    el.style.setProperty("--hc", hc);
    el.style.animationDelay = delay;

    layer.appendChild(el);
  }
}

function renderMemories(stepKey) {
  const mem = window.config.memories?.[stepKey];
  const root = $("memories");
  if (!root) return;
  if (!mem) { root.innerHTML = ""; return; }

  const cards = (mem.items || []).map(it => `
    <figure class="mem-card">
      <img src="${it.img}" alt="${it.caption || ''}" loading="lazy">
      <figcaption>${it.caption || ""}</figcaption>
    </figure>
  `).join("");

  root.innerHTML = `
    <div class="mem-head">
      <h2>${mem.title || ""}</h2>
      <p class="mem-quote">${mem.quote || ""}</p>
    </div>
    <div class="mem-grid">${cards}</div>
  `;

  spawnMemHearts();
}

function loveMessage(p) {
  const m = window.config.loveMessages;
  if (p >= 5000) return m.extreme;
  if (p >= 1000) return m.high;
  return m.normal;
}

function renderStep() {
  const c = window.config;
  const panel = $("panel");

  if (state.step === "first") {
    panel.innerHTML = `
      <p class="q">${c.questions.first.text}</p>
      <div class="row">
        <button class="btn" id="yes1">${c.questions.first.yesBtn}</button>
        <button class="btn alt" id="no1">${c.questions.first.noBtn}</button>
      </div>
      <p class="note" id="secret"></p>
    `;

    $("yes1").onclick = (e) => {
      burstFX({ x: e.clientX, y: e.clientY, count: 55, emojis: ["💖","❤️","✨","💕"] });
      $("secret").textContent = c.questions.first.secretAnswer;
      setTimeout(() => { state.step = "second"; renderStep(); }, 650);
    };

    $("no1").onclick = () => {
      state.noMoves += 1;
      const btn = $("no1");
      btn.textContent = state.noMoves >= 2 ? "ए हैन यार 😄" : c.questions.first.noBtn;
      btn.style.transform = `translate(${(Math.random()*120-60).toFixed(0)}px, ${(Math.random()*60-30).toFixed(0)}px)`;
    };

    renderMemories("first");
  }

  if (state.step === "second") {
    panel.innerHTML = `
      <p class="q">${c.questions.second.text}</p>
      <div class="love-meter">
        <span class="pill"><span>${c.questions.second.startText}</span> <span class="big" id="pct">${state.love}%</span></span>
        <button class="btn" id="more">+ बढाऊ</button>
        <button class="btn alt" id="next2">${c.questions.second.nextBtn}</button>
      </div>
      <p class="note" id="loveMsg">${loveMessage(state.love)}</p>
    `;

    $("more").onclick = () => {
      state.love = Math.min(9999, state.love + Math.floor(50 + Math.random()*300));
      $("pct").textContent = state.love + "%";
      $("loveMsg").textContent = loveMessage(state.love);
    };

    $("next2").onclick = () => { state.step = "third"; renderStep(); };

    renderMemories("second");
  }

  if (state.step === "third") {
    panel.innerHTML = `
      <p class="q">${c.questions.third.text}</p>
      <div class="row">
        <button class="btn" id="yes3">${c.questions.third.yesBtn}</button>
        <button class="btn alt" id="no3">${c.questions.third.noBtn}</button>
      </div>
      <p class="note" id="noNote"></p>
    `;

    $("yes3").onclick = (e) => {
      burstFX({ x: e.clientX, y: e.clientY, count: 95, emojis: ["❤️","💝","💕","✨","🎉"] });
      state.step = "celebrate";
      renderStep();
    };

    $("no3").onclick = () => {
      const n = $("noNote");
      n.textContent = "एक पटक फेरि सोच न... 🥺";
      const btn = $("no3");
      btn.style.transform = `translate(${(Math.random()*140-70).toFixed(0)}px, ${(Math.random()*70-35).toFixed(0)}px)`;
    };

    renderMemories("third");
  }

  if (state.step === "celebrate") {
    panel.innerHTML = `
      <p class="q">${c.celebration.title}</p>
      <p class="note">${c.celebration.message}</p>
      <p class="note" style="font-size:22px">${c.celebration.emojis}</p>
      <div class="row">
        <button class="btn" id="again">फेरि हेर्नु 💝</button>
      </div>
    `;
    $("again").onclick = () => { state.step = "first"; state.noMoves = 0; state.love = 100; renderStep(); };
    $("memories").innerHTML = "";

    const cx = Math.round(window.innerWidth / 2);
    const cy = Math.round(window.innerHeight / 2);
    burstFX({ x: cx, y: cy, count: 120, emojis: ["❤️","💖","💝","💕","✨","🎉"] });
  }
}

function setupMusic() {
  const m = window.config.music;
  const audio = $("bgm");
  const btn = $("musicBtn");
  if (!m?.enabled) return;

  audio.src = m.musicUrl;
  audio.volume = m.volume ?? 0.5;

  btn.hidden = false;
  btn.textContent = m.startText;

  let playing = false;

  async function play() {
    try {
      await audio.play();
      playing = true;
      btn.textContent = m.stopText;
    } catch {}
  }

  btn.onclick = () => {
    if (!playing) play();
    else {
      audio.pause();
      playing = false;
      btn.textContent = m.startText;
    }
  };

  if (m.autoplay) play();
}

applyTheme();
spawnFloaters();
setupMusic();
renderStep();
