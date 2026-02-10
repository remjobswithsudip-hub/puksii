const $ = (id) => document.getElementById(id);

const state = {
  step: "first",
  noMoves: 0,
  love: 100
};

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

    $("yes1").onclick = () => {
      $("secret").textContent = c.questions.first.secretAnswer;
      setTimeout(() => { state.step = "second"; renderStep(); }, 650);
    };

    $("no1").onclick = () => {
      state.noMoves += 1;
      const btn = $("no1");
      btn.textContent = state.noMoves >= 2 ? "अरे होइन 😄" : c.questions.first.noBtn;
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

    $("yes3").onclick = () => { state.step = "celebrate"; renderStep(); };

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
    } catch {
      // Autoplay may be blocked; user can click again.
    }
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
