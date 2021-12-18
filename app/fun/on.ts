export function on(domNode: Element, eventName: string, cb: () => void) {
  domNode.addEventListener(eventName, cb);
}

export function trigger(domNode: Element, eventName: string) {
  domNode.dispatchEvent(new Event(eventName));
}
