export abstract class DispatchableEvent {
  get className() {
    return this.constructor.name;
  }
}
