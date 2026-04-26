import { _decorator, Component, Label } from 'cc';
import { SaveManager } from '../managers/SaveManager';

const { ccclass, property } = _decorator;

@ccclass('CraftTask')
export class CraftTask extends Component {
  @property(Label)
  public statusLabel: Label | null = null;

  public async saveCraftPhoto(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    const file = await new Promise<File | null>((resolve) => {
      input.onchange = (): void => resolve(input.files?.[0] ?? null);
      input.click();
    });

    if (!file) {
      this.setStatus('Фото поделки не выбрано');
      return;
    }

    const jpeg = await this.compress(file);
    const progress = SaveManager.instance.getProgress();
    progress.craftPhotos.push(jpeg);
    SaveManager.instance.save(progress);

    this.setStatus(`Фото поделки сохранено (${progress.craftPhotos.length})`);
  }

  private compress(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось получить контекст canvas'));
          return;
        }
        ctx.drawImage(img, 0, 0, 512, 512);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (): void => reject(new Error('Ошибка чтения изображения'));
      img.src = URL.createObjectURL(file);
    });
  }

  private setStatus(value: string): void {
    if (this.statusLabel) {
      this.statusLabel.string = value;
    }
  }
}
