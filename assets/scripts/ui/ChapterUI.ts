import { _decorator, Component, Node } from 'cc';
import { PanelState } from '../config/Constants';

const { ccclass, property } = _decorator;

@ccclass('ChapterUI')
export class ChapterUI extends Component {
  @property(Node)
  public readingPanel: Node | null = null;

  @property(Node)
  public taskPanel: Node | null = null;

  @property(Node)
  public rewardPanel: Node | null = null;

  public switchPanel(state: PanelState): void {
    if (!this.readingPanel || !this.taskPanel || !this.rewardPanel) return;

    this.readingPanel.active = state === PanelState.READING;
    this.taskPanel.active = state === PanelState.TASK;
    this.rewardPanel.active = state === PanelState.REWARD;
  }
}
