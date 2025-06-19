import type { DispatchableEvent } from "./dispatchable-event.ts";
import type { IListener } from "./listener.ts";

interface EventConstructor {
  // deno-lint-ignore no-explicit-any
  new(...args: any): DispatchableEvent;
}

export default class EventDispatcher {
  public readonly listeners: Map<string, IListener[]> = new Map();

  public addEventListener(
    event: EventConstructor,
    listener: IListener,
  ) {
    if (!(event.name in this.listeners)) {
      this.listeners.set(event.name, []);
    }

    this.listeners.get(event.name)?.push(listener);
  }

  public removeEventListener(
    event: EventConstructor,
    listener: IListener,
  ) {
    if ((event.name in this.listeners)) {
      this.listeners.set(
        event.name,
        this.listeners.get(event.name)?.filter(el => el !== listener) ?? [],
      );
    }
  }

  public dispatchEvent(event: DispatchableEvent) {
    this.listeners.get(event.className)?.forEach(el => el.handle(event));
  }
}
