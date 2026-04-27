import { EventTarget } from 'cc';

export type EventPayload = Record<string, string | number | boolean | null | undefined | object>;

export class EventBus {
  private static _instance: EventBus | null = null;
  private readonly target: EventTarget;

  private constructor() {
    this.target = new EventTarget();
  }

  public static get instance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }

  public on(event: string, callback: (...args: unknown[]) => void, thisArg?: object): void {
    this.target.on(event, callback, thisArg);
  }

  public off(event: string, callback: (...args: unknown[]) => void, thisArg?: object): void {
    this.target.off(event, callback, thisArg);
  }

  public emit(event: string, payload?: EventPayload): void {
    this.target.emit(event, payload);
  }
}

export const GlobalEventBus = EventBus.instance;
