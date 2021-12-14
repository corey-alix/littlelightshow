import { FormFactory, FormManager } from "./FormManager.js";
import { TAXRATE } from "./globals.js";
import { inventoryManager } from "./InventoryManager.js";
import {
  save as saveInvoice,
  invoices as getAllInvoices,
  Invoice,
  InvoiceItem,
} from "./services/invoices.js";

export { identify } from "./identify.js";
import { create as createInvoiceFormTemplate } from "./templates/invoice-form.js";
import { create as createInvoicePrintTemplate } from "./templates/invoice-print.js";
import { create as createInvoicesGridTemplate } from "./templates/invoices-grid.js";

const formManager = new FormFactory();

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

function createItemPanel(form: FormManager, item?: InvoiceItem) {
  if (!item)
    item = {
      item: "",
      price: 0,
      quantity: 1,
      total: 0,
    };
  const formDom = formManager.asForm({
    item: {
      label: "Item",
      required: true,
      lookup: "inventory-items",
      value: item.item,
    },
    quantity: {
      label: "Quantity",
      type: "quantity",
      required: true,
      value: item.quantity,
    },
    price: {
      label: "Price",
      type: "currency",
      required: true,
      value: item.price,
    },
    total: {
      label: "Total",
      type: "currency",
      readonly: true,
      value: item.total,
    },
  });
  formDom.classList.add("line-item");

  bind(
    formDom,
    ["#price", "#quantity"],
    ["#total"],
    ([price, quantity, total]) => {
      const ttl =
        (price as HTMLInputElement).valueAsNumber *
        (quantity as HTMLInputElement).valueAsNumber;
      (total as HTMLInputElement).value = ttl.toFixed(2);
      total.dispatchEvent(new Event("change"));
      form.trigger("change");
    }
  );

  bind(
    formDom,
    ["#item"],
    ["#price", "#quantity", "#total"],
    ([item, price, quantity, total]) => {
      const currentPrice = (price as HTMLInputElement).valueAsNumber;
      const itemPrice = inventoryManager.getInventoryItemByCode(
        (item as HTMLInputElement).value
      );
      if (itemPrice && currentPrice != itemPrice)
        (price as HTMLInputElement).value = itemPrice.toFixed(2);
      price.dispatchEvent(new Event("change"));
      form.trigger("change");
    }
  );

  return formDom;
}

function addAnotherItem(form: FormManager) {
  const itemPanel = createItemPanel(form);
  const target = form.formDom.querySelector(".line-items") || form.formDom;
  target.appendChild(itemPanel);
  const removeButton = form.createButton({
    title: "Remove Item",
    event: "remove-item",
  });
  removeButton.addEventListener("click", () => {
    itemPanel.remove();
    form.trigger("change");
  });
  itemPanel.appendChild(removeButton);
}

export function init() {
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has("id")) {
    renderInvoice(queryParams.get("id")!);
  } else {
    renderInvoice();
  }
}

export async function renderInvoices(target: HTMLElement) {
  const invoices = await getAllInvoices();
  target.appendChild(createInvoicesGridTemplate(invoices));
}

export async function renderInvoice(invoiceId?: string) {
  document.querySelector("#invoice-form")?.remove();
  const template = createInvoiceFormTemplate();
  template.classList.add("hidden");
  document.body.appendChild(template);

  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";

  const form = formManager.domAsForm(formDom);
  const target = formDom.querySelector(".line-items") || formDom;

  if (invoiceId) {
    const invoices = await getAllInvoices();
    const invoice = invoices.find((invoice) => invoice.id === invoiceId);
    if (!invoice) throw "invoice not found";

    form.set("labor", invoice.labor);
    form.set("clientname", invoice.clientname);
    form.set("billto", invoice.billto);
    form.set("telephone", invoice.telephone || "");
    form.set("email", invoice.email || "");
    form.set("comments", invoice.comments || "");

    const items = invoice.items.map((item) => createItemPanel(form, item));
    items.forEach((item) => target.appendChild(item));
  }

  form.on("list-all-invoices", () => {
    window.location.href = "invoices.html";
  });

  form.on("print", () => {
    const requestModel = asModel(formDom);
    requestModel.id = invoiceId || "";
    print(requestModel);
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
    const requestModel = asModel(formDom);
    requestModel.id = invoiceId || "";

    console.log({ requestModel });
    await saveInvoice(requestModel);
    form.trigger("list-all-invoices");
  });

  form.on("remove-item", () => form.trigger("change"));
  form.on("add-another-item", () => {
    if (!form.isValid()) return;
    addAnotherItem(form);
    form.trigger("change");
  });

  form.on("clear", () => {
    location.href = "invoice.html";
  });

  form.on("change", () => {
    const labor = Number.parseFloat(form.get("labor"));
    const totalDue = computeTotalDue(form);
    const tax = totalDue * TAXRATE;
    form.set("total_due", (labor + totalDue + tax).toFixed(2));
  });

  template.classList.remove("hidden");
  form.trigger("change");

  bind(form.formDom, ["#labor"], [], ([labor]) => {
    form.trigger("change");
  });
}

function computeTotalDue(form: FormManager) {
  const model = asModel(form.formDom);
  const totalDue = model.items.reduce((a, b) => (b.total || 0) - 0 + a, 0);
  return Number.parseFloat(totalDue.toFixed(2));
}

function asModel(formDom: HTMLFormElement) {
  const data = new FormData(formDom);
  const requestModel: Invoice = {
    id: "",
    clientname: data.get("clientname") as string,
    billto: data.get("billto") as string,
    telephone: data.get("telephone") as string,
    email: data.get("email") as string,
    comments: data.get("comments") as string,
    items: [] as Array<{
      item: string;
      price: number;
      quantity: number;
      total: number;
    }>,
    labor: Number.parseFloat((data.get("labor") as string) || "0"),
  };

  let currentItem = null as any;
  for (let [key, value] of data.entries()) {
    if (key === "item") {
      currentItem = {};
      requestModel.items.push(currentItem);
    }
    if (currentItem) currentItem[key] = value;
  }
  return requestModel;
}

export function print(invoice: Invoice) {
  document.body.classList.add("print");
  const toPrint = createInvoicePrintTemplate(invoice);
  document.body.innerHTML = "";
  document.body.appendChild(toPrint);
  window.print();
}
