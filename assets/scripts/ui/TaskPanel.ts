import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../managers/GameManager';
import { AgeLevelFilter } from '../utils/AgeLevelFilter';

const { ccclass, property } = _decorator;

@ccclass('TaskPanel')
export class TaskPanel extends Component {
  @property(Label)
  public instructionLabel: Label | null = null;

  protected onEnable(): void {
    const progress = GameManager.instance.getProgress();
    const content = AgeLevelFilter.getChapterContent(progress.ageLevel, progress.currentChapter);
    if (this.instructionLabel) {
      this.instructionLabel.string = content.taskInstruction;
    }
  }
}
