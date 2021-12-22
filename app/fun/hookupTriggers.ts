import { on, trigger } from "./on.js";

export function hookupTriggers(
  domNode: HTMLElement
) {
  domNode
    .querySelectorAll("[data-event]")
    .forEach((eventItem) => {
      const eventName = (
        eventItem as HTMLElement
      ).dataset["event"];

      if (!eventName)
        throw "item must define a data-event";

      const isInput =
        eventItem.tagName === "INPUT";

      const inputType =
        isInput &&
        (eventItem as HTMLInputElement)
          .type;

      const isButton =
        eventItem.tagName ===
          "BUTTON" ||
        (isInput &&
          inputType === "button");

      const isCheckbox =
        isInput &&
        inputType === "checkbox";

      if (isButton)
        on(eventItem, "click", () => {
          trigger(domNode, eventName);
        });
      else if (isCheckbox)
        on(eventItem, "click", () => {
          const checked = (
            eventItem as HTMLInputElement
          ).checked;
          trigger(
            domNode,
            eventName +
              (checked ? ":yes" : ":no")
          );
        });
      else if (isInput)
        on(eventItem, "change", () => {
          trigger(domNode, eventName);
        });
      else
        throw `data-event not supported for this item: ${eventItem.outerHTML}`;
    });
}
