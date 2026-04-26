# Заврик и заколдованная книга (Cocos Creator 3.8)

Фиджитал-квест для детей 6–11 лет.

## Структура

- `assets/scripts/managers` — синглтоны `GameManager`, `SaveManager`, `SpeechManager`, `AudioManager`, `EventBus`.
- `assets/scripts/utils` — `TextComparer`, `AgeLevelFilter`.
- `assets/scripts/ui` — `ChapterUI`, `ReadingPanel`, `TaskPanel`, `RewardPanel`.
- `assets/scripts/tasks` — `PhotoTask`, `JumpTask`, `CraftTask`.
- `assets/scripts/config` — `ColorConfig`, `Constants`.
- `assets/scripts/animation` — кодовые конфиги анимаций до 4 кадров.
- `assets/scenes` — шаблоны сцен `menu`, `intro`, `chapter`, `final`.
- `assets/prefabs/PREFABS.md` — схема префабов.
- `web/parent.html` — автономная родительская панель.

## Запуск локально

1. Откройте проект папкой `/workspace/game` в Cocos Creator 3.8.
2. Добавьте ассеты в `assets/resources/`:
   - UI: `ui/panel_bg`, `ui/button_default` и состояния кнопок.
   - Персонажи: `characters/zavrik/*`, `characters/bukvoed/*`.
   - Аудио: `audio/bgm/*`, `audio/sfx/*`.
3. Создайте узлы-синглтоны в стартовой сцене:
   - `GameManager`, `SaveManager`, `SpeechManager`, `AudioManager`.
4. Привяжите компоненты к панелям и кнопкам.
5. Build → Web Mobile (WebGL).

## Демо-режим

Запуск с URL-параметром `?demo` активирует автопрохождение глав:

```text
https://localhost:7456/?demo
```

## LocalStorage

Ключ сохранения: `zavrik_gameProgress`

```json
{
  "ageLevel": "6-7",
  "currentChapter": 1,
  "completedChapters": [1],
  "readingStats": [],
  "jumpCount": 0,
  "taskPhotos": [],
  "craftPhotos": [],
  "totalPlayTime": 0,
  "startedAt": 0,
  "updatedAt": 0
}
```

## Родительский уголок

Откройте `web/parent.html`.

- PIN: `0000`
- Показывает статистику, фотоохоту и лепку
- Кнопка печати отчёта встроена (`window.print()`)
