import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../managers/GameManager';
import { AgeLevelFilter } from '../utils/AgeLevelFilter';

const { ccclass, property } = _decorator;

@ccclass('RewardPanel')
export class RewardPanel extends Component {
  @property(Label)
  public rewardLabel: Label | null = null;

  protected onEnable(): void {
    const progress = GameManager.instance.getProgress();
    const content = AgeLevelFilter.getChapterContent(progress.ageLevel, progress.currentChapter);
    if (this.rewardLabel) {
      this.rewardLabel.string = content.rewardText;
    }
  }
}
