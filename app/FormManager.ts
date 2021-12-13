import { EventBus } from "./EventBus.js";
import { forceDatalist } from "./invoice.js";

export class FormManager {
  isValid() {
    this.formDom.reportValidity();
    return this.formDom.checkValidity();
  }
  private channel = new EventBus();

  trigger(eventName: string, event?: { item: HTMLElement }) {
    this.channel.trigger(eventName, event);
  }

  on(eventName: string, cb: (event: any) => void) {
    this.channel.on(eventName, cb);
  }

  constructor(public formDom: HTMLFormElement) {}
}

export class FormFactory {
  domAsForm(dom: HTMLFormElement) {
    if (!dom) throw "cannot create a form without a dom element";
    const form = new FormManager(dom);
    // find all inputs with a 'data-event'
    dom.querySelectorAll("[data-event]").forEach((eventItem) => {
      eventItem.addEventListener("click", () => {
        const eventName = (eventItem as HTMLInputElement).dataset["event"];
        if (!eventName) throw "item must define a data-event";
        form.trigger(eventName, { item: eventItem as HTMLInputElement });
      });
    });

    return form;
  }

  asForm(
    fieldInfos: Record<
      string,
      {
        label?: string;
        readonly?: boolean;
        type?: string;
        required?: boolean;
        value?: string | number | boolean;
        lookup?: string;
      }
    >
  ) {
    const fieldNames = Object.keys(fieldInfos);
    const form = document.createElement("div");
    fieldNames.forEach((fieldName) => {
      const fieldInfo = fieldInfos[fieldName];
      const label = document.createElement("label");
      label.innerText = fieldInfo.label || fieldName;
      const input = document.createElement("input");
      if (fieldInfo.readonly) input.readOnly = true;
      if (fieldInfo.required) input.required = true;
      label.appendChild(input);
      input.name = input.id = fieldName;
      input.classList.add("field", fieldName, fieldInfo.type || "text");
      switch (fieldInfo.type) {
        case "currency":
          input.type = "number";
          label.classList.add("align-right");
          input.setAttribute("step", "0.01");
          break;
        case "quantity":
          input.type = "number";
          label.classList.add("align-right");
          break;
        default:
          label.classList.add("align-left");
      }
      if (fieldInfo.value) {
        const fieldValue = fieldInfo.value;
        if (typeof fieldValue == "boolean") input.checked = fieldValue;
        else if (typeof fieldValue == "number")
          input.valueAsNumber = fieldValue;
        else input.value = fieldValue;
      }

      if (fieldInfo.lookup) {
        input.setAttribute("list", fieldInfo.lookup);
        forceDatalist(fieldInfo, form);
      }
      form.appendChild(label);
    });
    return form;
  }
}
