declare var netlifyIdentity: any;

import { CONTEXT } from "./globals.js";
import { save } from "./services/invoices.js";

function saveInvoice(model: any) {
  save(model);
}

const inventory = JSON.parse(
  localStorage.getItem("inventory") || "{}"
) as Record<string, any>;

function getInventoryItemByCode(code: string) {
  if (inventory[code]) {
    return inventory[code].price;
  }
  switch (code) {
    case "test1":
      return 11;
    case "test2":
      return 12;
    case "test3":
      return 13;
  }
  return Math.floor(100 * Math.random());
}

class EventBus {
  private handlers = {} as Record<string, Array<() => void>>;
  on(eventName: string, cb: () => void) {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    this.handlers[eventName].push(cb);
    return {
      off: () => {
        const i = this.handlers[eventName].indexOf(cb);
        if (i >= 0) this.handlers[eventName].splice(i, 1);
      },
    };
  }

  trigger(eventName: string) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName].forEach((cb) => cb());
  }

  destroy() {
    this.handlers = {};
  }
}

function domAsForm(dom: HTMLFormElement) {
  if (!dom) throw "cannot create a form without a dom element";
  const channel = new EventBus();
  // find all inputs with a 'data-event'
  dom.querySelectorAll("[data-event]").forEach((eventItem) => {
    eventItem.addEventListener("click", () => {
      const eventName = (eventItem as HTMLInputElement).dataset["event"];
      if (!eventName) throw "item must define a data-event";
      channel.trigger(eventName);
    });
  });

  return channel;
}

function asForm(
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
      else if (typeof fieldValue == "number") input.valueAsNumber = fieldValue;
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

function forceDatalist(
  fieldInfo: {
    label?: string | undefined;
    readonly?: boolean | undefined;
    type?: string | undefined;
    required?: boolean | undefined;
    value?: string | number | boolean | undefined;
    lookup?: string | undefined;
  },
  form: HTMLElement
) {
  if (document.querySelector(`#${fieldInfo.lookup}`)) return;
  const dataList = document.createElement("datalist");
  dataList.id = fieldInfo.lookup!;
  ["test1", "test2", "test3"].forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    dataList.appendChild(option);
  });
  form.appendChild(dataList);
}

function bind(
  form: HTMLElement,
  inputQuerySelectors: string[],
  outputQuerySelectors: string[],
  cb: (args: Array<HTMLElement>) => void
) {
  const inputs = inputQuerySelectors.map(
    (qs) => form.querySelector(qs) as HTMLInputElement
  );
  const outputs = outputQuerySelectors.map(
    (qs) => form.querySelector(qs) as HTMLInputElement
  );
  const callback = () => cb([...inputs, ...outputs]);
  inputs.forEach((input) => input.addEventListener("change", callback));
}

function createItemPanel() {
  const form = asForm({
    item: { label: "Item", required: true, lookup: "inventory-items" },
    quantity: { label: "Quantity", type: "quantity", required: true, value: 1 },
    price: { label: "Price", type: "currency", required: true },
    total: { label: "Total", type: "currency", readonly: true },
  });

  form.classList.add("line-item");

  bind(
    form,
    ["#price", "#quantity"],
    ["#total"],
    ([price, quantity, total]) => {
      const ttl =
        (price as HTMLInputElement).valueAsNumber *
        (quantity as HTMLInputElement).valueAsNumber;
      (total as HTMLInputElement).value = ttl.toFixed(2);
    }
  );

  bind(
    form,
    ["#item"],
    ["#price", "#quantity", "#total"],
    ([item, price, quantity, total]) => {
      const currentPrice = (price as HTMLInputElement).valueAsNumber;
      const itemPrice = getInventoryItemByCode(
        (item as HTMLInputElement).value
      );
      if (itemPrice && currentPrice != itemPrice)
        (price as HTMLInputElement).value = itemPrice.toFixed(2);
      const ttl =
        (price as HTMLInputElement).valueAsNumber *
        (quantity as HTMLInputElement).valueAsNumber;
      (total as HTMLInputElement).value = ttl.toFixed(2);
    }
  );
  return form;
}

function showInvoiceForm(auth?) {
  const { userName } = auth || { userName: "" };
  document.querySelectorAll(".visible-when-auth").forEach((n) => {
    (n as HTMLElement).style.display = !!userName ? "block" : "none";
  });
  document.querySelectorAll(".visible-when-noauth").forEach((n) => {
    (n as HTMLElement).style.display = !userName ? "block" : "none";
  });

  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";
  const form = domAsForm(formDom);
  form.on("add-another-item", () => {
    addAnotherItem(formDom);
  });
  addAnotherItem(formDom);
  form.on("submit", () => {
    if (!formDom.checkValidity()) {
      formDom.reportValidity();
      return false;
    }
    formDom.querySelectorAll(".line-item").forEach((lineItemForm) => {
      const [itemInput, priceInput] = ["#item", "#price"].map(
        (id) => lineItemForm.querySelector(id) as HTMLInputElement
      );
      persistInventoryItem({
        code: itemInput.value,
        price: priceInput.valueAsNumber,
      });
    });
    const data = new FormData(formDom);
    const requestModel = {
      clientname: data.get("clientname"),
      telephone: data.get("telephone"),
      email: data.get("email"),
      items: [] as Array<{ item: string }>,
    };

    let currentItem = null as any;
    for (let [key, value] of data.entries()) {
      if (key === "item") {
        currentItem = {};
        requestModel.items.push(currentItem);
      }
      if (currentItem) currentItem[key] = value;
    }

    console.log({ requestModel });
    saveInvoice(requestModel);
  });
}

function addAnotherItem(formDom: HTMLFormElement) {
  const itemPanel = createItemPanel();
  const target = formDom.querySelector(".line-items") || formDom;
  target.appendChild(itemPanel);
  // while (itemPanel.firstChild) {
  //   target.appendChild(itemPanel.firstChild);
  // }
}

export function init() {
  switch (CONTEXT) {
    case "dev":
      showInvoiceForm({ userName: "dev" });
      break;
    case "NETLIFY":
      netlifyIdentity.on("init", (user) => console.log("init", user));
      netlifyIdentity.on("login", (user) => console.log("login", user));
      netlifyIdentity.on("logout", () => console.log("Logged out"));
      netlifyIdentity.on("error", (err) => console.error("Error", err));
      netlifyIdentity.on("open", () => console.log("Widget opened"));
      netlifyIdentity.on("close", () => console.log("Widget closed"));

      showInvoiceForm();

      netlifyIdentity.on("login", (user) => {
        if (user.app_metadata.provider === "google") {
          const userName = user.email;
          showInvoiceForm({ userName });
        }
      });
      break;
  }
}
function persistInventoryItem(inventoryItem: { code: string; price: number }) {
  const inventory = JSON.parse(
    localStorage.getItem("inventory") || "{}"
  ) as Record<string, any>;
  inventory[inventoryItem.code] = inventoryItem;
  localStorage.setItem("inventory", JSON.stringify(inventory));
}
