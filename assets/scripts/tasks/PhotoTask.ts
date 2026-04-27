import { _decorator, Component, Label } from 'cc';
import { SaveManager } from '../managers/SaveManager';

const { ccclass, property } = _decorator;

@ccclass('PhotoTask')
export class PhotoTask extends Component {
  @property(Label)
  public statusLabel: Label | null = null;

  public async openCameraAndSave(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    const file = await new Promise<File | null>((resolve) => {
      input.onchange = (): void => resolve(input.files?.[0] ?? null);
      input.click();
    });

    if (!file) {
      this.setStatus('Фото не выбрано');
      return;
    }

    const compressed = await this.compressToJpeg(file);
    const progress = SaveManager.instance.getProgress();
    progress.taskPhotos.push(compressed);
    SaveManager.instance.save(progress);
    this.setStatus(`Сохранено фото: ${progress.taskPhotos.length}`);
  }

  private compressToJpeg(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, 512, 512);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (): void => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  }

  private setStatus(text: string): void {
    if (this.statusLabel) this.statusLabel.string = text;
  }
}
