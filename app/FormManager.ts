import { EventBus } from "./EventBus.js";
import { inventoryManager } from "./InventoryManager.js";

export function forceDatalist() {
  let dataList = document.querySelector(
    `#inventory_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList = document.createElement("datalist");
  dataList.id = "inventory_list";
  Object.entries(inventoryManager.inventory).forEach(([key, value]) => {
    const option = document.createElement("option");
    option.value = key;
    dataList.appendChild(option);
  });
  document.body.appendChild(dataList);
  return dataList;
}

export class FormManager {
  get(name: string) {
    const input = this.formDom.querySelector(
      `[name="${name}"]`
    ) as HTMLInputElement;
    if (!input) throw `field not found: ${name}`;
    return input.value;
  }

  set(name: string, value: string | number) {
    const input = this.formDom.querySelector(
      `[name="${name}"]`
    ) as HTMLInputElement;
    if (!input) throw `field not found: ${name}`;
    if (typeof value === "number") input.valueAsNumber = value;
    else input.value = value || "";
  }

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

  createButton(options: { title: string; event: string }) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("button");
    button.innerText = options.title;
    button.dataset.event = options.event;
    button.addEventListener("click", () => {
      this.trigger(options.event, { item: button });
    });
    return button;
  }

  constructor(public formDom: HTMLFormElement) {}
}

export class FormFactory {
  domAsForm(dom: HTMLFormElement) {
    if (!dom) throw "cannot create a form without a dom element";
    const form = new FormManager(dom);
    dom.addEventListener("change", () => {
      form.trigger("change");
    });
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
      label.classList.add("form-label");
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
        else if (typeof fieldValue == "number") {
          switch (fieldInfo.type) {
            case "currency":
              input.value = fieldValue.toFixed(2);
              break;
            default:
              input.valueAsNumber = fieldValue;
              break;
          }
        } else input.value = fieldValue;
      }

      if (fieldInfo.lookup) {
        input.setAttribute("list", forceDatalist().id);
      }
      form.appendChild(label);
    });
    return form;
  }
}
