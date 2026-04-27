# Browser V2 (без Cocos)

Эта версия нужна для проверки флоу в обычном браузере и запуска из VS Code.

## Быстрый запуск в VS Code

### Вариант A: Live Server
1. Установите расширение **Live Server**.
2. Откройте папку проекта в VS Code.
3. Правой кнопкой по `web-v2/index.html` -> `Open with Live Server`.
4. Откройте URL вида `http://127.0.0.1:5500/web-v2/index.html`.

### Вариант B: встроенный Python сервер
```bash
cd /workspace/game
python -m http.server 5500
```
И откройте: `http://localhost:5500/web-v2/index.html`.

## Что работает
- Полный цикл: Menu -> Intro -> Chapter 1/2/3 -> Final.
- Reading task (Web Speech API).
- Photo/Craft task с `<input type="file" capture="environment">` + сжатие 512x512 JPEG 0.7.
- Jump task через `DeviceMotionEvent` + fallback Space.
- Сохранение в `localStorage` (`zavrik_gameProgress`).
- Demo mode: `?demo`.
- Совместимость с `web/parent.html` (тот же ключ сохранения).

## Примеры URL
- Обычный запуск: `http://localhost:5500/web-v2/index.html`
- Демо: `http://localhost:5500/web-v2/index.html?demo`
- Родительская панель: `http://localhost:5500/web/parent.html`
