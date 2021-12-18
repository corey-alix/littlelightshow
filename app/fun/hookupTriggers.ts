import { on, trigger } from "./on.js";

export function hookupTriggers(domNode: HTMLElement) {
  domNode.querySelectorAll("[data-event]").forEach((eventItem) => {
    on(eventItem, "click", () => {
      const eventName = (eventItem as HTMLInputElement).dataset["event"];
      if (!eventName) throw "item must define a data-event";
      trigger(domNode, eventName);
    });
  });
}
