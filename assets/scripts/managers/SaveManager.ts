import { _decorator, Component, director } from 'cc';
import { DEFAULT_PROGRESS, GameProgress, SAVE_KEY, ChapterId, AgeLevel } from '../config/Constants';

const { ccclass } = _decorator;

@ccclass('SaveManager')
export class SaveManager extends Component {
  private static _instance: SaveManager | null = null;

  public static get instance(): SaveManager {
    if (!SaveManager._instance) {
      const node = director.getScene()?.getChildByName('SaveManager') ?? null;
      if (!node) {
        throw new Error('SaveManager singleton is not initialized in current scene.');
      }
      const comp = node.getComponent(SaveManager);
      if (!comp) {
        throw new Error('SaveManager component missing on SaveManager node.');
      }
      SaveManager._instance = comp;
    }
    return SaveManager._instance;
  }

  protected onLoad(): void {
    if (SaveManager._instance && SaveManager._instance !== this) {
      this.node.destroy();
      return;
    }
    SaveManager._instance = this;
    director.addPersistRootNode(this.node);
  }

  public getProgress(): GameProgress {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROGRESS };
    }

    try {
      const parsed = JSON.parse(raw) as GameProgress;
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        updatedAt: parsed.updatedAt ?? Date.now(),
      };
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }

  public setAgeLevel(level: AgeLevel): void {
    const progress = this.getProgress();
    progress.ageLevel = level;
    this.save(progress);
  }

  public completeChapter(chapter: ChapterId): void {
    const progress = this.getProgress();
    if (!progress.completedChapters.includes(chapter)) {
      progress.completedChapters.push(chapter);
    }
    progress.currentChapter = Math.min(chapter + 1, ChapterId.CHAPTER_3) as ChapterId;
    this.save(progress);
  }

  public save(progress: GameProgress): void {
    progress.updatedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }

  public reset(): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...DEFAULT_PROGRESS, startedAt: Date.now() }));
  }
}
