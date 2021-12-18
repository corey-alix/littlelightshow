import { FormFactory, FormManager } from "../FormManager.js";
import { moveChildren } from "../fun/dom.js";
import { inventoryManager } from "../InventoryManager.js";
import { routes } from "../router.js";
import {
  save as saveInvoice,
  deleteInvoice,
  invoices as getAllInvoices,
  Invoice,
  InvoiceItem,
} from "../services/invoices.js";

export { identify } from "../identify.js";
import {
  create as createInvoiceFormTemplate,
  renderInvoiceItem,
  setupComputeOnLineItem,
} from "./templates/invoice-form.js";
import { create as createInvoicePrintTemplate } from "./templates/invoice-print.js";
import { create as createInvoicesGridTemplate } from "./templates/invoices-grid.js";

const formManager = new FormFactory();
const itemsToRemove = [] as Array<HTMLElement>;

function addAnotherItem(form: FormManager) {
  const itemPanel = renderInvoiceItem({
    quantity: 1,
    item: "",
    price: 0,
    total: 0,
  });
  setupComputeOnLineItem(form.formDom, itemPanel);
  const toFocus = getFirstInput(itemPanel);
  const target: HTMLElement =
    form.formDom.querySelector(".line-items") || form.formDom;
  itemsToRemove.splice(0, itemsToRemove.length);
  for (let i = 0; i < itemPanel.children.length; i++) {
    itemsToRemove.push(itemPanel.children[i] as HTMLElement);
  }
  moveChildren(itemPanel, target);
  toFocus?.focus();
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
  const formDom = createInvoicesGridTemplate(invoices);
  const form = formManager.domAsForm(formDom);
  target.appendChild(formDom);
  form.on("create-invoice", () => {
    location.href = routes.createInvoice();
  });
}

export async function renderInvoice(invoiceId?: string) {
  let invoice: Invoice | null;
  if (invoiceId) {
    const invoices = await getAllInvoices();
    invoice = invoices.find((invoice) => invoice.id === invoiceId) || null;
    if (!invoice) throw "invoice not found";
  } else {
    // invoice is empty
    invoice = {
      id: "",
      date: Date.now(),
      clientname: "",
      billto: "",
      comments: "",
      email: "",
      telephone: "",
      items: [],
      labor: 0,
      additional: 0,
    };
  }
  const template = createInvoiceFormTemplate(invoice);
  template.classList.add("hidden");
  document.body.appendChild(template);

  const formDom = document.querySelector("#invoice-form") as HTMLFormElement;
  if (!formDom) throw "a form must be defined with id of 'invoice-form'";

  const form = formManager.domAsForm(formDom);
  const target = formDom.querySelector(".line-items") || formDom;

  form.on("list-all-invoices", () => {
    window.location.href = routes.allInvoices();
  });

  form.on("print", async () => {
    if (await tryToSaveInvoice(form)) {
      const requestModel = asModel(formDom);
      print(requestModel);
    }
  });

  form.on("delete", async () => {
    if (await tryToDeleteInvoice(form)) form.trigger("list-all-invoices");
  });

  form.on("submit", async () => {
    if (await tryToSaveInvoice(form)) form.trigger("list-all-invoices");
  });

  form.on("remove-last-item", () => {
    itemsToRemove.forEach((item) => item.remove());
    form.trigger("change");
  });

  form.on("add-another-item", () => {
    if (!form.isValid()) return;
    addAnotherItem(form);
    form.trigger("change");
  });

  form.on("clear", () => {
    location.href = routes.createInvoice();
  });

  template.classList.remove("hidden");
  form.trigger("change");
}

async function tryToDeleteInvoice(form: FormManager) {
  const id = form.get("id");
  if (!id) throw "unable to delete this invoice";
  await deleteInvoice(id);
  return true;
}

async function tryToSaveInvoice(form: FormManager) {
  const { formDom } = form;
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
  console.log({ requestModel });
  await saveInvoice(requestModel);
  form.set("id", requestModel.id);
  return true;
}

function asModel(formDom: HTMLFormElement) {
  const data = new FormData(formDom);
  const requestModel: Invoice = {
    id: data.get("id") as string,
    clientname: data.get("clientname") as string,
    date: new Date(data.get("date") as string).valueOf(),
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
    additional: Number.parseFloat((data.get("additional") as string) || "0"),
  };

  let currentItem: InvoiceItem | null = null;
  for (let [key, value] of data.entries()) {
    switch (key) {
      case "item":
        currentItem = <InvoiceItem>{};
        requestModel.items.push(currentItem);
        currentItem.item = value as string;
        break;
      case "quantity":
        if (!currentItem) throw "item expected";
        currentItem.quantity = parseFloat(value as string);
        break;
      case "price":
        if (!currentItem) throw "item expected";
        currentItem.price = parseFloat(value as string);
        break;
      case "total":
        if (!currentItem) throw "item expected";
        currentItem.total = parseFloat(value as string);
        break;
    }
  }
  return requestModel;
}

export function print(invoice: Invoice) {
  document.body.classList.add("print");
  const toPrint = createInvoicePrintTemplate(invoice);
  document.body.innerHTML = "";
  document.body.appendChild(toPrint);
  window.document.title = invoice.clientname;
  window.print();
}

function getFirstInput(itemPanel: HTMLDivElement) {
  return itemPanel.querySelector("input") as HTMLInputElement;
}
