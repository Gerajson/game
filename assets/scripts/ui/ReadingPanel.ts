import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../managers/GameManager';
import { SpeechManager } from '../managers/SpeechManager';
import { TextComparer } from '../utils/TextComparer';
import { SaveManager } from '../managers/SaveManager';
import { AgeLevelFilter } from '../utils/AgeLevelFilter';

const { ccclass, property } = _decorator;

@ccclass('ReadingPanel')
export class ReadingPanel extends Component {
  @property(Label)
  public readingTextLabel: Label | null = null;

  @property(Label)
  public resultLabel: Label | null = null;

  private chapterText = '';

  protected onEnable(): void {
    const progress = GameManager.instance.getProgress();
    const content = AgeLevelFilter.getChapterContent(progress.ageLevel, progress.currentChapter);
    this.chapterText = content.readingText;
    if (this.readingTextLabel) this.readingTextLabel.string = this.chapterText;
    if (this.resultLabel) this.resultLabel.string = 'Нажми «Слушать», чтобы начать чтение.';
  }

  public onStartReadingClick(): void {
    SpeechManager.instance.listenOnce(
      (transcript) => {
        const res = TextComparer.compare(this.chapterText, transcript);
        const progress = SaveManager.instance.getProgress();
        progress.readingStats.push({
          chapter: progress.currentChapter,
          matchedWords: res.matchedWords,
          targetWords: res.totalWords,
          scorePercent: res.scorePercent,
          transcript,
          timestamp: Date.now(),
        });
        SaveManager.instance.save(progress);
        if (this.resultLabel) {
          this.resultLabel.string = `Совпадение: ${res.scorePercent}%`;
        }
      },
      (err) => {
        if (this.resultLabel) this.resultLabel.string = err;
      },
    );
  }
}
