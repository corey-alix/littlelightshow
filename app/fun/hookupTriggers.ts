export function hookupTriggers(domNode: HTMLElement) {
  domNode.querySelectorAll("[data-event]").forEach((eventItem) => {
    eventItem.addEventListener("click", () => {
      const eventName = (eventItem as HTMLInputElement).dataset["event"];
      if (!eventName) throw "item must define a data-event";
      domNode.dispatchEvent(new Event(eventName));
    });
  });
}
