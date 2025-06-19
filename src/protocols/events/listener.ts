import type { DispatchableEvent } from "./dispatchable-event.ts";

export interface IListener {
  handle: (event: DispatchableEvent) => void | Promise<void>;
}
