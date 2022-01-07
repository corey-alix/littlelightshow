import { isDebug } from "../globals";

function log(...message: Array<any>) {
  if (!isDebug) return;
  console.log(...message);
}

export function on(
  domNode: Element,
  eventName: string,
  cb: () => void
) {
  domNode.addEventListener(
    eventName,
    cb
  );
}

export function trigger(
  domNode: Element,
  eventName: string
) {
  log("trigger", eventName);
  domNode.dispatchEvent(
    new Event(eventName)
  );
}
