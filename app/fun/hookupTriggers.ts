import {
  getGlobalState,
  setGlobalState,
} from "./globalState";
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
        isInputElement(eventItem);

      const inputType =
        getInputType(eventItem);

      const isButton = isButtonElement(
        eventItem,
        isInput
      );

      const isCheckbox =
        isCheckboxInput(eventItem);

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

  domNode
    .querySelectorAll("[data-bind]")
    .forEach((eventItem) => {
      const bindTo = (
        eventItem as HTMLElement
      ).dataset["bind"];

      if (!bindTo)
        throw "item must define a data-bind";

      const valueInfo =
        getGlobalState<any>(bindTo);

      if (isCheckboxInput(eventItem)) {
        (
          eventItem as HTMLInputElement
        ).checked = true === valueInfo;
        on(eventItem, "change", () => {
          setGlobalState(
            bindTo,
            (
              eventItem as HTMLInputElement
            ).checked
          );
        });
      } else if (
        isNumericInputElement(eventItem)
      ) {
        const item =
          eventItem as HTMLInputElement;
        item.valueAsNumber =
          valueInfo || 0;
        on(eventItem, "change", () => {
          setGlobalState(
            bindTo,
            item.valueAsNumber
          );
        });
      } else if (
        isInputElement(eventItem)
      ) {
        const item =
          eventItem as HTMLInputElement;
        item.value = valueInfo || "";
        on(eventItem, "change", () => {
          setGlobalState(
            bindTo,
            item.value
          );
        });
      } else if (
        isTextAreaElement(eventItem)
      ) {
        const item =
          eventItem as HTMLTextAreaElement;
        item.value = valueInfo || "";
        on(eventItem, "change", () => {
          setGlobalState(
            bindTo,
            item.value
          );
        });
      } else {
        throw `unimplemented data-bind on element: ${eventItem.outerHTML}`;
      }
    });
}

function isCheckboxInput(
  eventItem: Element
) {
  return (
    isInputElement(eventItem) &&
    getInputType(eventItem) ===
      "checkbox"
  );
}

function isButtonElement(
  eventItem: Element,
  isInput: boolean
) {
  return (
    eventItem.tagName === "BUTTON" ||
    (isInput &&
      getInputType(eventItem) ===
        "button")
  );
}

function getInputType(
  eventItem: Element
) {
  return (
    isInputElement(eventItem) &&
    (eventItem as HTMLInputElement).type
  );
}

function isTextAreaElement(
  eventItem: Element
) {
  return (
    eventItem.tagName === "TEXTAREA"
  );
}

function isInputElement(
  eventItem: Element
) {
  return eventItem.tagName === "INPUT";
}

function isNumericInputElement(
  item: Element
) {
  return (
    isInputElement(item) &&
    getInputType(item) === "number"
  );
}
