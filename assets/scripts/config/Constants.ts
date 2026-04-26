export enum AgeLevel {
  AGE_6_7 = '6-7',
  AGE_8_9 = '8-9',
  AGE_10_11 = '10-11',
}

export enum ChapterId {
  CHAPTER_1 = 1,
  CHAPTER_2 = 2,
  CHAPTER_3 = 3,
}

export enum PanelState {
  READING = 'reading',
  TASK = 'task',
  REWARD = 'reward',
}

export enum TaskType {
  PHOTO = 'photo',
  JUMP = 'jump',
  CRAFT = 'craft',
}

export const SAVE_KEY = 'zavrik_gameProgress';
export const PARENT_PIN = '0000';
export const DEMO_QUERY_KEY = 'demo';

export const DESIGN_RESOLUTION = {
  width: 1280,
  height: 720,
};

export interface ReadingStats {
  chapter: ChapterId;
  targetWords: number;
  matchedWords: number;
  scorePercent: number;
  transcript: string;
  timestamp: number;
}

export interface GameProgress {
  ageLevel: AgeLevel;
  currentChapter: ChapterId;
  completedChapters: ChapterId[];
  readingStats: ReadingStats[];
  jumpCount: number;
  taskPhotos: string[];
  craftPhotos: string[];
  totalPlayTime: number;
  startedAt: number;
  updatedAt: number;
}

export const DEFAULT_PROGRESS: GameProgress = {
  ageLevel: AgeLevel.AGE_6_7,
  currentChapter: ChapterId.CHAPTER_1,
  completedChapters: [],
  readingStats: [],
  jumpCount: 0,
  taskPhotos: [],
  craftPhotos: [],
  totalPlayTime: 0,
  startedAt: Date.now(),
  updatedAt: Date.now(),
};
