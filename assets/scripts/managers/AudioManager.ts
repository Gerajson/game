import { _decorator, AudioClip, AudioSource, Component, Node, director, resources } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
  private static _instance: AudioManager | null = null;

  @property(AudioSource)
  public bgmSource: AudioSource | null = null;

  @property(AudioSource)
  public sfxSource: AudioSource | null = null;

  private readonly clipCache: Map<string, AudioClip> = new Map<string, AudioClip>();

  public static get instance(): AudioManager {
    if (!AudioManager._instance) {
      const node = director.getScene()?.getChildByName('AudioManager') ?? null;
      if (!node) {
        throw new Error('AudioManager singleton is not initialized in current scene.');
      }
      const comp = node.getComponent(AudioManager);
      if (!comp) {
        throw new Error('AudioManager component missing on AudioManager node.');
      }
      AudioManager._instance = comp;
    }
    return AudioManager._instance;
  }

  protected onLoad(): void {
    if (AudioManager._instance && AudioManager._instance !== this) {
      this.node.destroy();
      return;
    }
    AudioManager._instance = this;
    director.addPersistRootNode(this.node);
  }

  public setMasterVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.bgmSource) this.bgmSource.volume = clamped;
    if (this.sfxSource) this.sfxSource.volume = clamped;
    localStorage.setItem('zavrik_masterVolume', String(clamped));
  }

  public playBgm(path: string, loop = true): void {
    this.loadClip(path, (clip) => {
      if (!this.bgmSource) return;
      this.bgmSource.clip = clip;
      this.bgmSource.loop = loop;
      this.bgmSource.play();
    });
  }

  public playSfx(path: string): void {
    this.loadClip(path, (clip) => {
      if (!this.sfxSource) return;
      this.sfxSource.playOneShot(clip, this.sfxSource.volume);
    });
  }

  private loadClip(path: string, onReady: (clip: AudioClip) => void): void {
    const cached = this.clipCache.get(path);
    if (cached) {
      onReady(cached);
      return;
    }

    resources.load(path, AudioClip, (err: Error | null, clip: AudioClip | null) => {
      if (err || !clip) {
        return;
      }
      this.clipCache.set(path, clip);
      onReady(clip);
    });
  }
}
