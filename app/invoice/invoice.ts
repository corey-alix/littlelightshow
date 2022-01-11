import "../fun/sort.js"; // force Array.sortBy extension
import {
  on,
  trigger,
} from "../fun/on.js";
import { routes } from "../router.js";
import {
  upsertItem as saveInvoice,
  removeItem,
  getItem as getInvoice,
  getItems as getAllInvoices,
  Invoice,
  InvoiceItem,
  invoiceModel,
} from "../services/invoices.js";

import { create as createFormTemplate } from "./templates/invoice-form.js";
import { create as createPrintTemplate } from "./templates/invoice-print.js";
import { create as createGridTemplate } from "./templates/invoices-grid.js";
import { get, set } from "../fun/get";
import {
  reportError,
  toast,
} from "../ux/toasterWriter";
import { globals } from "../globals.js";
const { TAXRATE } = globals;

import { asCurrency } from "../fun/asCurrency.js";
import { gotoUrl } from "../fun/gotoUrl.js";
import { init as systemInit } from "../index.js";
import { getQueryParameter } from "../fun/getQueryParameter.js";
import { stripAccessControlItems } from "../fun/hookupTriggers.js";

export async function init(
  target = document.body
) {
  try {
    await systemInit();
    const id = getQueryParameter("id");
    if (!!id) {
      await renderInvoice(target, id);
    } else {
      await renderInvoice(target);
    }
  } catch (ex) {
    reportError(ex);
  }
}

export async function renderInvoices(
  target: HTMLElement
) {
  try {
    await systemInit();
    const invoices =
      await getAllInvoices();
    const formDom =
      createGridTemplate(invoices);
    target.appendChild(formDom);
    on(
      formDom,
      "create-invoice",
      () => {
        try {
          gotoUrl(
            routes.createInvoice()
          );
        } catch (ex) {
          reportError(ex);
        }
      }
    );
  } catch (ex) {
    reportError(ex);
  }
}

async function renderInvoice(
  target: HTMLElement,
  invoiceId?: string
) {
  let invoice: Invoice | null;
  if (invoiceId) {
    invoice = await getInvoice(
      invoiceId
    );
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
      taxrate: TAXRATE,
    };
  }
  const formDom =
    await createFormTemplate(invoice);
  stripAccessControlItems(formDom);

  target.appendChild(formDom);

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
      print(
        formDom.parentElement ||
          formDom,
        requestModel
      );
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
    if (
      await tryToSaveInvoice(formDom)
    ) {
      toast("Invoice saved");
    }
  });
}

async function tryToDeleteInvoice(
  formDom: HTMLFormElement
) {
  const id = get(formDom, "id");
  if (!id)
    throw "unable to delete this invoice";
  await removeItem(id);
  return true;
}

async function tryToSaveInvoice(
  formDom: HTMLFormElement
) {
  if (!formDom.checkValidity()) {
    formDom.reportValidity();
    return false;
  }
  const requestModel = asModel(formDom);
  if (requestModel.id) {
    // confirm invoice changed
    const priorModel =
      await invoiceModel.getItem(
        requestModel.id
      );
    if (
      deepEqual(
        requestModel,
        priorModel
      )
    ) {
      toast("No changes found");
      return false;
    }
  }
  await saveInvoice(requestModel);
  set(formDom, { id: requestModel.id });
  return true;
}

// should I move services into the template?
// I did with GL but seems good to let the template handle events only
// this is more business logic and workflow but since it is using the form
// as the data source perhaps it belongs closer to that view...move it?
// 260 lines here + 470 lines in the form template.
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
    items: [] as Array<InvoiceItem>,
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
    taxrate: TAXRATE,
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

  let currentItem: InvoiceItem | null =
    null;
  for (let [key, value] of (
    data as any
  ).entries()) {
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
        currentItem.tax = parseFloat(
          asCurrency(
            requestModel.taxrate *
              currentItem.total
          )
        );
        break;
    }
  }
  return requestModel;
}

export function print(
  target: HTMLElement,
  invoice: Invoice
) {
  try {
    target.classList.add("print");
    const toPrint =
      createPrintTemplate(invoice);
    target.innerHTML = "";
    target.appendChild(toPrint);
    window.document.title =
      invoice.clientname;
    window.print();
  } catch (ex) {
    reportError(ex);
  }
}
function deepEqual(
  requestModel: Invoice,
  priorModel: Invoice
) {
  return (
    JSON.stringify(requestModel) ===
    JSON.stringify(priorModel)
  );
}
