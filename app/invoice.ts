declare var netlifyIdentity: any;

import { FormFactory, FormManager } from "./FormManager.js";
import { CONTEXT } from "./globals.js";
import { InventoryManager } from "./InventoryManager.js";
import {
  save as saveInvoice,
  invoices as getAllInvoices,
  Invoice,
} from "./services/invoices.js";

const inventoryManager = new InventoryManager();
const formManager = new FormFactory();

export function forceDatalist(
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
  Object.entries(inventoryManager.inventory).forEach(([key, value]) => {
    const option = document.createElement("option");
    option.value = key;
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
  const form = formManager.asForm({
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
      const itemPrice = inventoryManager.getInventoryItemByCode(
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

  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";

  document.querySelectorAll(".visible-when-auth").forEach((n) => {
    (n as HTMLElement).style.display = !!userName ? "block" : "none";
  });
  document.querySelectorAll(".visible-when-noauth").forEach((n) => {
    (n as HTMLElement).style.display = !userName ? "block" : "none";
  });

  const form = formManager.domAsForm(formDom);

  form.on("list-all-invoices", () => {
    window.location.href = "invoices.html";
  });

  form.on("remove-item", (event) => {
    if (event?.item) {
      debugger;
      let lineItems = event.item as HTMLElement;
      while (lineItems && !lineItems.classList.contains("line-items")) {
        lineItems = lineItems.parentElement as HTMLElement;
      }
      if (!lineItems) throw "unable to find line-items";
      lineItems.remove();
    }
  });

  form.on("add-another-item", () => {
    if (!form.isValid()) return;
    addAnotherItem(form);
  });

  form.on("submit", async () => {
    if (!formDom.checkValidity()) {
      formDom.reportValidity();
      return false;
    }
    formDom.querySelectorAll(".line-item").forEach((lineItemForm) => {
      const [itemInput, priceInput] = ["#item", "#price"].map(
        (id) => lineItemForm.querySelector(id) as HTMLInputElement
      );
      inventoryManager.persistInventoryItem({
        code: itemInput.value,
        price: priceInput.valueAsNumber,
      });
    });
    inventoryManager.persistInventoryItems();
    const data = new FormData(formDom);
    const requestModel: Invoice = {
      id: "",
      clientname: data.get("clientname") as string,
      telephone: data.get("telephone") as string,
      email: data.get("email") as string,
      items: [] as Array<{
        item: string;
        price: number;
        quantity: number;
        total: number;
      }>,
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
    await saveInvoice(requestModel);
    form.trigger("list-all-invoices");
  });
}

function createButton(
  form: FormManager,
  options: { title: string; event: string }
) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.innerText = options.title;
  button.dataset.event = options.event;
  button.addEventListener("click", () => {});
  return button;
}

function addAnotherItem(form: FormManager) {
  const itemPanel = createItemPanel();
  const target = form.formDom.querySelector(".line-items") || form.formDom;
  target.appendChild(itemPanel);
  const removeButton = createButton(form, {
    title: "Remove Item",
    event: "remove-item",
  });
  removeButton.addEventListener("click", () => itemPanel.remove());
  itemPanel.appendChild(removeButton);
}

export function init() {
  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";

  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has("id")) {
    renderInvoice(formDom, queryParams.get("id")!);
    return;
  }

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

export async function renderInvoices(target: HTMLElement) {
  const invoices = await getAllInvoices();
  let grandTotal = 0;
  const rows = invoices
    .map((invoice) => {
      const total = invoice.items.reduce((a, b) => a + b.total, 0) || 0;
      grandTotal += total;
      return `<label class="form-label"><a href="invoice.html?id=${
        invoice.id
      }">${
        invoice.clientname
      }</a></label><label class="currency form-label"> ${total.toFixed(
        2
      )}</label>`;
    })
    .join("<br/>");
  target.innerHTML = `${rows}<hr/><label class="form-label">Total</label><label class="form-label currency">${grandTotal.toFixed(
    2
  )}</label>`;
}

export async function renderInvoice(target: HTMLElement, invoiceId: string) {
  const invoices = await getAllInvoices();
  const invoice = invoices.find((invoice) => invoice.id === invoiceId);
  if (!invoice) throw "invoice not found";
  let clientInfo = `
  <label>Client Name<input value="${invoice.clientname}"/></label><br/>
  <label>Telephone<input value="${invoice.telephone}"/></label><br/>  
  `;

  let items = invoice.items
    .map(
      (item) => `
  <label>Item<input value="${item.item}"/></label><br/>
  <label>Quantity<input value="${item.quantity}"/></label><br/>
  <label>Price<input value="${item.price}"/></label><br/>
  <label>Total<input value="${item.total}"/></label><br/>
  `
    )
    .join("");

  target.innerHTML = clientInfo + items;
}
