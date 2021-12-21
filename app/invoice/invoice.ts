import "../fun/sort.js"; // force Array.sortBy extension
import {
  on,
  trigger,
} from "../fun/on.js";
import { inventoryManager } from "../inventory/InventoryManager.js";
import { routes } from "../router.js";
import {
  save as saveInvoice,
  deleteInvoice,
  invoices as getAllInvoices,
  Invoice,
  InvoiceItem,
} from "../services/invoices.js";

export { identify } from "../identify.js";
import { create as createFormTemplate } from "./templates/invoice-form.js";
import { create as createPrintTemplate } from "./templates/invoice-print.js";
import { create as createGridTemplate } from "./templates/invoices-grid.js";
import { get, set } from "../fun/get";
import { asNumber } from "../fun/asNumber.js";

export function init() {
  const queryParams =
    new URLSearchParams(
      window.location.search
    );
  if (queryParams.has("id")) {
    renderInvoice(
      queryParams.get("id")!
    );
  } else {
    renderInvoice();
  }
}

export async function renderInvoices(
  target: HTMLElement
) {
  const invoices =
    await getAllInvoices();
  const formDom =
    createGridTemplate(invoices);
  target.appendChild(formDom);
  on(formDom, "create-invoice", () => {
    location.href =
      routes.createInvoice();
  });
}

async function renderInvoice(
  invoiceId?: string
) {
  let invoice: Invoice | null;
  if (invoiceId) {
    const invoices =
      await getAllInvoices();
    invoice =
      invoices.find(
        (invoice) =>
          invoice.id === invoiceId
      ) || null;
    if (!invoice)
      throw "invoice not found";
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
      mops: [],
    };
  }
  const formDom =
    createFormTemplate(invoice);
  document.body.appendChild(formDom);

  hookupEvents(formDom);

  trigger(formDom, "change");
}

// events are normally hooked in the template
// but these events require service dependencies
function hookupEvents(
  formDom: HTMLFormElement
) {
  on(formDom, "print", async () => {
    if (
      await tryToSaveInvoice(formDom)
    ) {
      const requestModel =
        asModel(formDom);
      print(requestModel);
    }
  });

  on(formDom, "delete", async () => {
    if (
      await tryToDeleteInvoice(formDom)
    )
      trigger(
        formDom,
        "list-all-invoices"
      );
  });

  on(formDom, "submit", async () => {
    if (await tryToSaveInvoice(formDom))
      trigger(
        formDom,
        "list-all-invoices"
      );
  });
}

async function tryToDeleteInvoice(
  formDom: HTMLFormElement
) {
  const id = get(formDom, "id");
  if (!id)
    throw "unable to delete this invoice";
  await deleteInvoice(id);
  return true;
}

async function tryToSaveInvoice(
  formDom: HTMLFormElement
) {
  if (!formDom.checkValidity()) {
    formDom.reportValidity();
    return false;
  }
  formDom
    .querySelectorAll(".line-item")
    .forEach((lineItemForm) => {
      const [itemInput, priceInput] = [
        "#item",
        "#price",
      ].map(
        (id) =>
          lineItemForm.querySelector(
            id
          ) as HTMLInputElement
      );
      inventoryManager.persistInventoryItem(
        {
          code: itemInput.value,
          price:
            priceInput.valueAsNumber,
        }
      );
    });
  inventoryManager.persistInventoryItems();
  const requestModel = asModel(formDom);
  console.log({ requestModel });
  await saveInvoice(requestModel);
  set(formDom, { id: requestModel.id });
  return true;
}

// should I move services into the template?
// I did with GL but seems good to let the template handle events only
// this is more business logic and workflow but since it is using the form
// as the data source perhaps it belongs closer to that view...move it?
// 260 lines here + 470 line sin the form template.
function asModel(
  formDom: HTMLFormElement
) {
  const data = new FormData(formDom);
  const requestModel: Invoice = {
    id: data.get("id") as string,
    clientname: data.get(
      "clientname"
    ) as string,
    date: new Date(
      data.get("date") as string
    ).valueOf(),
    billto: data.get(
      "billto"
    ) as string,
    telephone: data.get(
      "telephone"
    ) as string,
    email: data.get("email") as string,
    comments: data.get(
      "comments"
    ) as string,
    items: [] as Array<{
      item: string;
      price: number;
      quantity: number;
      total: number;
    }>,
    labor: Number.parseFloat(
      (data.get("labor") as string) ||
        "0"
    ),
    additional: Number.parseFloat(
      (data.get(
        "additional"
      ) as string) || "0"
    ),
    mops: [] as Array<{
      mop: string;
      paid: number;
    }>,
  };

  const mops = data.getAll(
    "method_of_payment"
  );
  const payments = data.getAll(
    "amount_paid"
  );

  requestModel.mops = mops.map(
    (mop, i) => ({
      mop: mop as string,
      paid: parseFloat(
        payments[i] as string
      ),
    })
  );

  console.log(
    "mops",
    requestModel.mops
  );

  let currentItem: InvoiceItem | null =
    null;
  for (let [
    key,
    value,
  ] of data.entries()) {
    switch (key) {
      case "item":
        currentItem = <InvoiceItem>{};
        requestModel.items.push(
          currentItem
        );
        currentItem.item =
          value as string;
        break;
      case "quantity":
        if (!currentItem)
          throw "item expected";
        currentItem.quantity =
          parseFloat(value as string);
        break;
      case "price":
        if (!currentItem)
          throw "item expected";
        currentItem.price = parseFloat(
          value as string
        );
        break;
      case "total":
        if (!currentItem)
          throw "item expected";
        currentItem.total = parseFloat(
          value as string
        );
        break;
    }
  }
  return requestModel;
}

export function print(
  invoice: Invoice
) {
  document.body.classList.add("print");
  const toPrint =
    createPrintTemplate(invoice);
  document.body.innerHTML = "";
  document.body.appendChild(toPrint);
  window.document.title =
    invoice.clientname;
  window.print();
}
