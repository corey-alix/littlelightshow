import { FormFactory, FormManager } from "./FormManager.js";
import { inventoryManager } from "./InventoryManager.js";
import {
  save as saveInvoice,
  invoices as getAllInvoices,
  Invoice,
  InvoiceItem,
} from "./services/invoices.js";

export { identify } from "./identify.js";
import { template as invoiceFormTemplate } from "./templates/invoice-form.js";

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

function createItemPanel(item?: InvoiceItem) {
  if (!item)
    item = {
      item: "",
      price: 0,
      quantity: 1,
      total: 0,
    };
  const form = formManager.asForm({
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

function addAnotherItem(form: FormManager) {
  const itemPanel = createItemPanel();
  const target = form.formDom.querySelector(".line-items") || form.formDom;
  target.appendChild(itemPanel);
  const removeButton = form.createButton({
    title: "Remove Item",
    event: "remove-item",
  });
  removeButton.addEventListener("click", () => itemPanel.remove());
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

export async function renderInvoice(invoiceId?: string) {
  document.querySelector("#invoice-form")?.remove();
  document.body.appendChild(invoiceFormTemplate);

  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";

  const form = formManager.domAsForm(formDom);
  const target = formDom.querySelector(".line-items") || formDom;

  if (invoiceId) {
    const invoices = await getAllInvoices();
    const invoice = invoices.find((invoice) => invoice.id === invoiceId);
    if (!invoice) throw "invoice not found";

    form.set("clientname", invoice.clientname);
    form.set("billto", invoice.billto);
    form.set("telephone", invoice.telephone || "");
    form.set("email", invoice.email || "");

    const items = invoice.items.map(createItemPanel);
    items.forEach((item) => target.appendChild(item));
  }

  form.on("list-all-invoices", () => {
    window.location.href = "invoices.html";
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
      id: invoiceId || "",
      clientname: data.get("clientname") as string,
      billto: data.get("billto") as string,
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

  form.on("add-another-item", () => {
    if (!form.isValid()) return;
    addAnotherItem(form);
  });

  form.on("clear", () => {
    renderInvoice();
  });
}
