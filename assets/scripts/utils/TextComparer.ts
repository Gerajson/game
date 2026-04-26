export interface CompareResult {
  matchedWords: number;
  totalWords: number;
  scorePercent: number;
  missingWords: string[];
}

export class TextComparer {
  public static normalize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^а-яёa-z0-9\s]/giu, ' ')
      .split(/\s+/u)
      .filter(Boolean);
  }

  public static compare(expected: string, actual: string): CompareResult {
    const expectedWords = TextComparer.normalize(expected);
    const actualWords = new Set(TextComparer.normalize(actual));

    let matchedWords = 0;
    const missingWords: string[] = [];

    expectedWords.forEach((word) => {
      if (actualWords.has(word)) {
        matchedWords += 1;
      } else {
        missingWords.push(word);
      }
    });

    const totalWords = expectedWords.length || 1;
    const scorePercent = Math.round((matchedWords / totalWords) * 100);

    return {
      matchedWords,
      totalWords,
      scorePercent,
      missingWords,
    };
  }
}
