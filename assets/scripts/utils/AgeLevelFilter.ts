import { AgeLevel, ChapterId } from '../config/Constants';

interface ChapterContent {
  readingText: string;
  taskInstruction: string;
  rewardText: string;
}

type AgeChapterMap = Record<AgeLevel, Record<ChapterId, ChapterContent>>;

const CONTENT: AgeChapterMap = {
  [AgeLevel.AGE_6_7]: {
    [ChapterId.CHAPTER_1]: {
      readingText: 'Заврик нашёл книгу в пещере. Он шепнул: «Свети, страница!» и буквы засияли.',
      taskInstruction: 'Фотоохота: найди дома 1 круглый и 1 зелёный предмет, сфотографируй.',
      rewardText: 'Ты открыл первую наклейку дружбы для Заврика!',
    },
    [ChapterId.CHAPTER_2]: {
      readingText: 'На поляне буквы прыгали как лягушки. Заврик должен был повторить ритм.',
      taskInstruction: 'Прыжки: сделай 10 прыжков. Можно прыгать или нажимать пробел.',
      rewardText: 'Ура! Ты получил энергетический кристалл.',
    },
    [ChapterId.CHAPTER_3]: {
      readingText: 'Заврик слепил из глины ключ-слово и дверь в библиотеку открылась.',
      taskInstruction: 'Лепка: слепи предмет из книги и сфотографируй результат.',
      rewardText: 'Финальный амулет собран! Буквоед отступил!',
    },
  },
  [AgeLevel.AGE_8_9]: {
    [ChapterId.CHAPTER_1]: {
      readingText: 'В заколдованной книге Заврик нашёл карту символов и тайные подсказки.',
      taskInstruction: 'Фотоохота: сделай 2 фото предметов, которые напоминают буквы.',
      rewardText: 'Отлично! Первая печать книги очищена.',
    },
    [ChapterId.CHAPTER_2]: {
      readingText: 'Каждый прыжок по плитке превращал туман в звуки древней азбуки.',
      taskInstruction: 'Прыжки: выполни 15 прыжков по сигналу ритма.',
      rewardText: 'Супер! Ты усилил перо Заврика.',
    },
    [ChapterId.CHAPTER_3]: {
      readingText: 'Чтобы завершить квест, нужно было создать символ руками и назвать его.',
      taskInstruction: 'Лепка: слепи магический символ и сфотографируй поделку.',
      rewardText: 'Книга расколдована! Ты мастер фиджитал-квеста.',
    },
  },
  [AgeLevel.AGE_10_11]: {
    [ChapterId.CHAPTER_1]: {
      readingText: 'Заврик активировал оглавление артефактов и нашёл источник проклятия Буквоеда.',
      taskInstruction: 'Фотоохота: сделай 3 фото фактур/объектов с символическим смыслом.',
      rewardText: 'Твоя наблюдательность открыла архив первой главы.',
    },
    [ChapterId.CHAPTER_2]: {
      readingText: 'Чтобы стабилизировать рунический контур, нужно было точно держать ритм прыжков.',
      taskInstruction: 'Прыжки: достигни 20 срабатываний акселерометра или пробела.',
      rewardText: 'Контур стабилизирован. Доступен переход к финальной главе.',
    },
    [ChapterId.CHAPTER_3]: {
      readingText: 'Финальная глава потребовала инженерного мышления и ручной реконструкции символа.',
      taskInstruction: 'Лепка: создай 3D-модель артефакта и зафиксируй фотоотчёт.',
      rewardText: 'Поздравляем! Ты полностью снял заклятие с книги.',
    },
  },
};

export class AgeLevelFilter {
  public static getChapterContent(age: AgeLevel, chapter: ChapterId): ChapterContent {
    return CONTENT[age][chapter];
  }
}
