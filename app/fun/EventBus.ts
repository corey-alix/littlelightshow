// no need for global events at the moment...using HTMLFormElement events
// would use this to get two elements to communicate that don't share a form
export class EventBus {
  private handlers = {} as Record<
    string,
    Array<(event: any) => void>
  >;
  on(
    eventName: string,
    cb: (event: any) => void
  ) {
    if (!this.handlers[eventName])
      this.handlers[eventName] = [];
    this.handlers[eventName].push(cb);
    return {
      off: () => {
        const i =
          this.handlers[
            eventName
          ].indexOf(cb);
        if (i >= 0)
          this.handlers[
            eventName
          ].splice(i, 1);
      },
    };
  }

  trigger(
    eventName: string,
    event?: any
  ) {
    if (!this.handlers[eventName])
      return;
    this.handlers[eventName].forEach(
      (cb) => cb(event)
    );
  }

  destroy() {
    this.handlers = {};
  }
}
