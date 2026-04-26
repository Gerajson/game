import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Label } from 'cc';
import { SaveManager } from '../managers/SaveManager';

const { ccclass, property } = _decorator;

@ccclass('JumpTask')
export class JumpTask extends Component {
  @property(Label)
  public counterLabel: Label | null = null;

  private threshold = 12;
  private lastTrigger = 0;

  protected onEnable(): void {
    window.addEventListener('devicemotion', this.onMotion);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.refreshLabel();
  }

  protected onDisable(): void {
    window.removeEventListener('devicemotion', this.onMotion);
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  private onMotion = (event: DeviceMotionEvent): void => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
    if (force > this.threshold && Date.now() - this.lastTrigger > 250) {
      this.registerJump();
      this.lastTrigger = Date.now();
    }
  };

  private onKeyDown(event: EventKeyboard): void {
    if (event.keyCode === KeyCode.SPACE) {
      this.registerJump();
    }
  }

  private registerJump(): void {
    const progress = SaveManager.instance.getProgress();
    progress.jumpCount += 1;
    SaveManager.instance.save(progress);
    this.refreshLabel();
  }

  private refreshLabel(): void {
    const count = SaveManager.instance.getProgress().jumpCount;
    if (this.counterLabel) {
      this.counterLabel.string = `Прыжки: ${count}`;
    }
  }
}
