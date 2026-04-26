import { _decorator, Component, director } from 'cc';

const { ccclass } = _decorator;

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }
}

@ccclass('SpeechManager')
export class SpeechManager extends Component {
  private static _instance: SpeechManager | null = null;
  private recognition: SpeechRecognition | null = null;
  private isRunning = false;

  public static get instance(): SpeechManager {
    if (!SpeechManager._instance) {
      const node = director.getScene()?.getChildByName('SpeechManager') ?? null;
      if (!node) {
        throw new Error('SpeechManager singleton is not initialized in current scene.');
      }
      const comp = node.getComponent(SpeechManager);
      if (!comp) {
        throw new Error('SpeechManager component missing on SpeechManager node.');
      }
      SpeechManager._instance = comp;
    }
    return SpeechManager._instance;
  }

  protected onLoad(): void {
    if (SpeechManager._instance && SpeechManager._instance !== this) {
      this.node.destroy();
      return;
    }
    SpeechManager._instance = this;
    director.addPersistRootNode(this.node);
    this.setupRecognition();
  }

  private setupRecognition(): void {
    const SpeechCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechCtor) {
      return;
    }
    this.recognition = new SpeechCtor();
    this.recognition.lang = 'ru-RU';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  public listenOnce(onResult: (transcript: string) => void, onError?: (message: string) => void): void {
    if (!this.recognition) {
      onError?.('Web Speech API не поддерживается');
      return;
    }
    if (this.isRunning) {
      this.recognition.stop();
    }

    this.recognition.onresult = (ev: SpeechRecognitionEvent): void => {
      const phrase = ev.results[0][0].transcript.trim().toLowerCase();
      onResult(phrase);
    };

    this.recognition.onerror = (ev: SpeechRecognitionErrorEvent): void => {
      onError?.(`${ev.error}: ${ev.message}`);
    };

    this.recognition.onend = (): void => {
      this.isRunning = false;
    };

    this.isRunning = true;
    this.recognition.start();
  }

  public stop(): void {
    if (this.recognition && this.isRunning) {
      this.recognition.stop();
    }
  }
}
