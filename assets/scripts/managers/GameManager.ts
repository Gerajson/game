import {
  _decorator,
  Component,
  director,
  game,
  Scene,
} from 'cc';
import { GlobalEventBus } from './EventBus';
import { AgeLevel, ChapterId, DEMO_QUERY_KEY, GameProgress } from '../config/Constants';
import { SaveManager } from './SaveManager';

const { ccclass } = _decorator;

export const GameEvents = {
  ProgressUpdated: 'progress-updated',
  ChapterStarted: 'chapter-started',
  ChapterCompleted: 'chapter-completed',
  PauseToggled: 'pause-toggled',
  Error: 'global-error',
} as const;

@ccclass('GameManager')
export class GameManager extends Component {
  private static _instance: GameManager | null = null;
  private sessionStartedAt = Date.now();
  private demoMode = false;

  public static get instance(): GameManager {
    if (!GameManager._instance) {
      const node = director.getScene()?.getChildByName('GameManager') ?? null;
      if (!node) throw new Error('GameManager singleton not found in active scene.');
      const manager = node.getComponent(GameManager);
      if (!manager) throw new Error('GameManager component missing on node.');
      GameManager._instance = manager;
    }
    return GameManager._instance;
  }

  protected onLoad(): void {
    if (GameManager._instance && GameManager._instance !== this) {
      this.node.destroy();
      return;
    }
    GameManager._instance = this;
    director.addPersistRootNode(this.node);
    this.demoMode = new URLSearchParams(window.location.search).has(DEMO_QUERY_KEY);
    game.on(game.EVENT_HIDE, this.pauseGame, this);
    game.on(game.EVENT_SHOW, this.resumeGame, this);
  }

  protected onDestroy(): void {
    game.off(game.EVENT_HIDE, this.pauseGame, this);
    game.off(game.EVENT_SHOW, this.resumeGame, this);
  }

  public newGame(ageLevel: AgeLevel): void {
    SaveManager.instance.reset();
    const progress = SaveManager.instance.getProgress();
    progress.ageLevel = ageLevel;
    progress.currentChapter = ChapterId.CHAPTER_1;
    SaveManager.instance.save(progress);
    this.sessionStartedAt = Date.now();
    this.loadScene('intro');
  }

  public continueGame(): void {
    const progress = SaveManager.instance.getProgress();
    if (progress.currentChapter > ChapterId.CHAPTER_3) {
      this.loadScene('final');
      return;
    }
    this.loadScene('chapter');
  }

  public startChapter(chapter: ChapterId): void {
    const progress = SaveManager.instance.getProgress();
    progress.currentChapter = chapter;
    SaveManager.instance.save(progress);
    GlobalEventBus.emit(GameEvents.ChapterStarted, { chapter });
  }

  public completeChapter(chapter: ChapterId): void {
    SaveManager.instance.completeChapter(chapter);
    GlobalEventBus.emit(GameEvents.ChapterCompleted, { chapter });

    if (this.demoMode && chapter < ChapterId.CHAPTER_3) {
      this.startChapter((chapter + 1) as ChapterId);
      return;
    }

    if (chapter === ChapterId.CHAPTER_3) {
      this.loadScene('final');
    }
  }

  public applySessionTime(): void {
    const progress = SaveManager.instance.getProgress();
    progress.totalPlayTime += Math.floor((Date.now() - this.sessionStartedAt) / 1000);
    SaveManager.instance.save(progress);
    this.sessionStartedAt = Date.now();
    GlobalEventBus.emit(GameEvents.ProgressUpdated, { totalPlayTime: progress.totalPlayTime });
  }

  public pauseGame(): void {
    director.pause();
    GlobalEventBus.emit(GameEvents.PauseToggled, { paused: true });
  }

  public resumeGame(): void {
    director.resume();
    GlobalEventBus.emit(GameEvents.PauseToggled, { paused: false });
  }

  public reportError(message: string): void {
    GlobalEventBus.emit(GameEvents.Error, { message });
  }

  public getProgress(): GameProgress {
    return SaveManager.instance.getProgress();
  }

  private loadScene(name: string): void {
    director.loadScene(name, (err: Error | null, scene?: Scene) => {
      if (err || !scene) {
        this.reportError(`Не удалось загрузить сцену ${name}`);
      }
    });
  }
}
