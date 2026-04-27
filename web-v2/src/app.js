const SAVE_KEY = 'zavrik_gameProgress';
const DEMO_KEY = 'demo';

const AgeLevel = {
  A67: '6-7',
  A89: '8-9',
  A1011: '10-11',
};

const CHAPTERS = [1, 2, 3];

const CONTENT = {
  [AgeLevel.A67]: {
    1: {
      readingText: 'Заврик нашёл книгу в пещере. Он шепнул: Свети, страница, и буквы засияли.',
      taskInstruction: 'Фотоохота: сфотографируй 1 круглый и 1 зелёный предмет.',
      rewardText: 'Ты получил первую наклейку дружбы!',
    },
    2: {
      readingText: 'На поляне буквы прыгали как лягушки. Заврик повторил волшебный ритм.',
      taskInstruction: 'Прыжки: сделай 10 прыжков, или нажимай пробел.',
      rewardText: 'Получен энергетический кристалл!',
    },
    3: {
      readingText: 'Заврик слепил ключ-слово и открыл дверь в библиотеку.',
      taskInstruction: 'Лепка: слепи предмет и сфотографируй его.',
      rewardText: 'Финальный амулет собран!',
    },
  },
  [AgeLevel.A89]: {
    1: {
      readingText: 'В книге Заврик нашёл карту символов и древние подсказки.',
      taskInstruction: 'Фотоохота: сделай 2 фото предметов, похожих на буквы.',
      rewardText: 'Первая печать книги очищена!',
    },
    2: {
      readingText: 'Прыжки по плиткам превращали туман в звуки азбуки.',
      taskInstruction: 'Прыжки: выполни 15 прыжков по ритму.',
      rewardText: 'Перо Заврика усилено!',
    },
    3: {
      readingText: 'Нужно создать символ руками и назвать его вслух.',
      taskInstruction: 'Лепка: слепи символ и сфотографируй.',
      rewardText: 'Книга расколдована!',
    },
  },
  [AgeLevel.A1011]: {
    1: {
      readingText: 'Заврик активировал оглавление артефактов и вычислил источник проклятия.',
      taskInstruction: 'Фотоохота: сделай 3 смысловых фото текстур и объектов.',
      rewardText: 'Открыт архив первой главы!',
    },
    2: {
      readingText: 'Рунический контур стабилизируется только точным ритмом прыжков.',
      taskInstruction: 'Прыжки: достигни 20 срабатываний акселерометра/пробела.',
      rewardText: 'Контур стабилизирован!',
    },
    3: {
      readingText: 'Финал требует ручной реконструкции артефакта из глины.',
      taskInstruction: 'Лепка: создай артефакт и сделай фотоотчёт.',
      rewardText: 'Полная победа над Буквоедом!',
    },
  },
};

function defaultProgress() {
  return {
    ageLevel: AgeLevel.A67,
    currentChapter: 1,
    completedChapters: [],
    readingStats: [],
    jumpCount: 0,
    taskPhotos: [],
    craftPhotos: [],
    totalPlayTime: 0,
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const Save = {
  get() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultProgress();
    try {
      return { ...defaultProgress(), ...JSON.parse(raw) };
    } catch {
      return defaultProgress();
    }
  },
  set(value) {
    value.updatedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(value));
  },
  reset(ageLevel) {
    const p = defaultProgress();
    p.ageLevel = ageLevel;
    Save.set(p);
  },
};

function compareWords(expected, actual) {
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/[^а-яёa-z0-9\s]/giu, ' ')
      .split(/\s+/)
      .filter(Boolean);
  const exp = norm(expected);
  const got = new Set(norm(actual));
  const matched = exp.filter((w) => got.has(w)).length;
  return {
    matched,
    total: exp.length || 1,
    percent: Math.round((matched / (exp.length || 1)) * 100),
  };
}

function createPhotoInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  return input;
}

async function compressImage(file) {
  const img = new Image();
  const loadPromise = new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  img.src = URL.createObjectURL(file);
  await loadPromise;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D not available');
  ctx.drawImage(img, 0, 0, 512, 512);
  return canvas.toDataURL('image/jpeg', 0.7);
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function renderMenu() {
  const p = Save.get();
  app.innerHTML = `
    <main class="screen">
      <h1>Заврик и заколдованная книга</h1>
      <section class="card">
        <label>Возраст:
          <select id="ageSelect">
            <option value="6-7" ${p.ageLevel === '6-7' ? 'selected' : ''}>6-7</option>
            <option value="8-9" ${p.ageLevel === '8-9' ? 'selected' : ''}>8-9</option>
            <option value="10-11" ${p.ageLevel === '10-11' ? 'selected' : ''}>10-11</option>
          </select>
        </label>
        <div class="buttons">
          <button id="newGame">Новая игра</button>
          <button id="continue">Продолжить</button>
          <button id="parent">Родительский уголок</button>
        </div>
      </section>
    </main>`;

  document.getElementById('newGame').onclick = () => {
    const age = document.getElementById('ageSelect').value;
    Save.reset(age);
    renderIntro();
  };
  document.getElementById('continue').onclick = () => {
    const prog = Save.get();
    if (prog.currentChapter > 3) return renderFinal();
    renderChapter(prog.currentChapter);
  };
  document.getElementById('parent').onclick = () => {
    window.location.href = '../web/parent.html';
  };
}

function renderIntro() {
  app.innerHTML = `
  <main class="screen">
    <section class="card">
      <h2>Интро</h2>
      <p>Заврик нашёл заколдованную книгу. Готов к квесту?</p>
      <button id="skip">Пропустить</button>
    </section>
  </main>`;
  document.getElementById('skip').onclick = () => renderChapter(1);
}

function renderChapter(chapter) {
  const progress = Save.get();
  const content = CONTENT[progress.ageLevel][chapter];

  app.innerHTML = `
    <main class="screen">
      <header class="hud"><strong>Глава ${chapter}/3</strong><button id="pause">Пауза</button></header>
      <section class="card" id="readingPanel">
        <h3>Чтение</h3>
        <p id="readingText">${content.readingText}</p>
        <button id="speakBtn">Слушать чтение</button>
        <p id="readingResult"></p>
        <button id="toTask">К заданию</button>
      </section>

      <section class="card hidden" id="taskPanel">
        <h3>Задание</h3>
        <p>${content.taskInstruction}</p>
        <div id="taskRoot"></div>
        <button id="toReward">К награде</button>
      </section>

      <section class="card hidden" id="rewardPanel">
        <h3>Награда</h3>
        <p>${content.rewardText}</p>
        <button id="next">Дальше</button>
      </section>
    </main>`;

  document.getElementById('pause').onclick = () => alert('Пауза: нажми OK, чтобы продолжить');
  document.getElementById('toTask').onclick = () => switchPanels('task');
  document.getElementById('toReward').onclick = () => switchPanels('reward');
  document.getElementById('next').onclick = () => finishChapter(chapter);

  setupSpeech(chapter, content.readingText);
  setupTask(chapter);
}

function switchPanels(panel) {
  const map = {
    reading: document.getElementById('readingPanel'),
    task: document.getElementById('taskPanel'),
    reward: document.getElementById('rewardPanel'),
  };
  Object.entries(map).forEach(([k, el]) => {
    el.classList.toggle('hidden', k !== panel);
  });
}

function setupSpeech(chapter, expectedText) {
  const btn = document.getElementById('speakBtn');
  const result = document.getElementById('readingResult');
  btn.onclick = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      result.textContent = 'Web Speech API не поддерживается в этом браузере';
      return;
    }
    const rec = new Ctor();
    rec.lang = 'ru-RU';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (ev) => {
      const phrase = ev.results[0][0].transcript;
      const cmp = compareWords(expectedText, phrase);
      result.textContent = `Совпадение: ${cmp.percent}%`;
      const p = Save.get();
      p.readingStats.push({
        chapter,
        targetWords: cmp.total,
        matchedWords: cmp.matched,
        scorePercent: cmp.percent,
        transcript: phrase,
        timestamp: Date.now(),
      });
      Save.set(p);
    };
    rec.onerror = (e) => {
      result.textContent = `Ошибка распознавания: ${e.error || 'unknown'}`;
    };
    rec.start();
  };
}

function setupTask(chapter) {
  const root = document.getElementById('taskRoot');
  if (chapter === 1) {
    root.innerHTML = `<button id="photoBtn">Сделать фото</button><p id="photoStatus"></p>`;
    document.getElementById('photoBtn').onclick = async () => {
      const input = createPhotoInput();
      const file = await new Promise((resolve) => {
        input.onchange = () => resolve(input.files?.[0] || null);
        input.click();
      });
      if (!file) return;
      const jpeg = await compressImage(file);
      const p = Save.get();
      p.taskPhotos.push(jpeg);
      Save.set(p);
      document.getElementById('photoStatus').textContent = 'Фото сохранено';
    };
    return;
  }

  if (chapter === 2) {
    root.innerHTML = `<p>Прыжки: <strong id="jumpCount">0</strong></p><p>Прыгай или жми пробел.</p>`;
    const update = () => {
      document.getElementById('jumpCount').textContent = String(Save.get().jumpCount);
    };
    const addJump = () => {
      const p = Save.get();
      p.jumpCount += 1;
      Save.set(p);
      update();
    };
    let last = 0;
    const motionHandler = (ev) => {
      const a = ev.accelerationIncludingGravity;
      if (!a) return;
      const power = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
      if (power > 12 && Date.now() - last > 250) {
        last = Date.now();
        addJump();
      }
    };
    window.addEventListener('devicemotion', motionHandler, { passive: true });
    const keyHandler = (ev) => {
      if (ev.code === 'Space') addJump();
    };
    window.addEventListener('keydown', keyHandler);
    update();
    return;
  }

  if (chapter === 3) {
    root.innerHTML = `<button id="craftBtn">Фото поделки</button><p id="craftStatus"></p>`;
    document.getElementById('craftBtn').onclick = async () => {
      const input = createPhotoInput();
      const file = await new Promise((resolve) => {
        input.onchange = () => resolve(input.files?.[0] || null);
        input.click();
      });
      if (!file) return;
      const jpeg = await compressImage(file);
      const p = Save.get();
      p.craftPhotos.push(jpeg);
      Save.set(p);
      document.getElementById('craftStatus').textContent = 'Фото поделки сохранено';
    };
  }
}

function finishChapter(chapter) {
  const p = Save.get();
  if (!p.completedChapters.includes(chapter)) p.completedChapters.push(chapter);
  p.currentChapter = Math.min(chapter + 1, 4);
  Save.set(p);

  if (new URLSearchParams(window.location.search).has(DEMO_KEY) && chapter < 3) {
    return renderChapter(chapter + 1);
  }

  if (chapter >= 3) {
    renderFinal();
  } else {
    renderChapter(chapter + 1);
  }
}

function renderFinal() {
  const p = Save.get();
  app.innerHTML = `
    <main class="screen">
      <section class="card">
        <h2>Финал</h2>
        <p>Глав пройдено: ${p.completedChapters.length}/3</p>
        <p>Попыток чтения: ${p.readingStats.length}</p>
        <p>Прыжков: ${p.jumpCount}</p>
        <p>Фотоохота: ${p.taskPhotos.length}</p>
        <p>Лепка: ${p.craftPhotos.length}</p>
        <div class="buttons">
          <button id="secret">Секретный ролик Буквоеда</button>
          <button id="parent">Родительский уголок</button>
          <button id="menu">В меню</button>
        </div>
      </section>
    </main>`;

  document.getElementById('secret').onclick = () => alert('Буквоед: "Я ещё вернусь!"');
  document.getElementById('parent').onclick = () => (window.location.href = '../web/parent.html');
  document.getElementById('menu').onclick = () => renderMenu();
}

const app = document.getElementById('app');
if (new URLSearchParams(window.location.search).has(DEMO_KEY)) {
  Save.reset(AgeLevel.A67);
  renderIntro();
} else {
  renderMenu();
}
