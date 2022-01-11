import { dom } from "../../dom.js";
import { asDateString } from "../../fun/asDateString.js";
import {
  moveChildren,
  moveChildrenBefore,
} from "../../fun/dom.js";
import { hookupTriggers } from "../../fun/hookupTriggers.js";
import {
  extendNumericInputBehaviors,
  extendTextInputBehaviors,
} from "../../fun/behavior/form.js";
import {
  on,
  trigger,
} from "../../fun/on.js";
import { globals } from "../../globals.js";
import {
  forceDatalist as forceInventoryDataList,
  inventoryModel,
} from "../../services/inventory.js";
import { forceDatalist as forceMopDataList } from "../PaymentManager.js";

import { routes } from "../../router.js";
import {
  Invoice,
  InvoiceItem,
} from "../../services/invoices.js";
import { asCurrency } from "../../fun/asCurrency.js";
import { getValueAsNumber } from "../../fun/behavior/input.js";
import { asNumber } from "../../fun/asNumber.js";
import { sum } from "../../fun/sum.js";
import { gotoUrl } from "../../fun/gotoUrl.js";

const { primaryContact, TAXRATE } =
  globals;

const itemsToRemove =
  [] as Array<HTMLElement>;

export async function create(
  invoice: Invoice
) {
  await forceInventoryDataList();

  const form: HTMLFormElement = (
    <form
      class="grid-6"
      id="invoice-form"
    >
      <h1 class="col-1-last centered">
        {`Invoice Form for ${primaryContact.companyName}`}
      </h1>
      <input
        class="form-label hidden"
        readonly
        type="text"
        name="id"
        value={invoice.id}
      />
      <div class="section-title col-1-last">
        Client
      </div>
      <label class="form-label col-1-3">
        Client Name
      </label>
      <label class="form-label col-4-last">
        Date
      </label>
      <input
        class="col-1-3"
        type="text"
        placeholder="clientname"
        name="clientname"
        required
        value={invoice.clientname}
      />
      <input
        class="col-4-last"
        type="date"
        placeholder="Date"
        name="date"
        required
        value={asDateString(
          new Date(
            invoice.date || Date.now()
          )
        )}
      />
      <label class="form-label col-1-3">
        Telephone
      </label>
      <label class="form-label col-4-last">
        Email
      </label>
      <input
        type="tel"
        class="col-1-3"
        placeholder="telephone"
        name="telephone"
        value={invoice.telephone}
      />
      <input
        type="email"
        class="col-4-last"
        placeholder="email"
        name="email"
        value={invoice.email}
      />
      <label class="form-label col-1-last">
        Bill To
        <textarea
          class="address"
          placeholder="billto"
          name="billto"
        >
          {invoice.billto}
        </textarea>
      </label>
      <label class="form-label col-1-last">
        Comments
        <textarea
          class="comments"
          placeholder="comments"
          name="comments"
        >
          {invoice.comments}
        </textarea>
      </label>
      <div class="vspacer col-1-last"></div>
      <section class="line-items grid-6 col-1-last">
        <div class="section-title col-1-last">
          Items
        </div>
      </section>
      <div class="vspacer col-1-last"></div>
      <button
        class="button col-1-3"
        data-event="add-another-item"
        data-can="update:invoice"
        type="button"
      >
        Add item
      </button>
      <button
        class="button col-4-last"
        data-event="remove-last-item"
        data-can="update:invoice"
        type="button"
      >
        Remove Last Item
      </button>
      <div class="vspacer col-1-last"></div>
      <div class="section-title col-1-last">
        Summary
      </div>
      <label class="form-label col-1-2 currency">
        Labor
      </label>
      <label class="form-label col-3-2 currency">
        Other
      </label>
      <label class="form-label col-5-last currency">
        Total + Tax
      </label>
      <input
        type="number"
        class="currency col-1-2"
        placeholder="labor"
        name="labor"
        id="labor"
        value={invoice.labor.toFixed(2)}
      />
      <input
        type="number"
        class="currency col-3-2"
        placeholder="additional"
        name="additional"
        value={invoice.additional.toFixed(
          2
        )}
      />
      <input
        readonly
        type="number"
        class="currency col-5-last"
        id="total_due"
        name="total_due"
      />
      <div class="col-1 vspacer-1"></div>

      <div class="section-title col-1-last">
        Method of Payment
      </div>
      <div class="col-1-4">
        Payment Type
      </div>
      <div class="col-5-last currency">
        Amount
      </div>
      <div
        id="mop-line-item-end"
        class="hidden"
      ></div>
      <button
        class="button col-1-2 if-desktop"
        data-can="update:invoice"
        data-event="add-method-of-payment"
        type="button"
      >
        Add Payment
      </button>
      <div class="form-label col-5-last currency if-desktop">
        Balance Due
      </div>
      <input
        readonly
        class="currency col-5-last bold if-desktop"
        type="number"
        id="balance_due"
      />
      <div class="vspacer-1 col-1-last flex">
        <button
          class="bold button"
          data-event="submit"
          data-can="update:invoice"
          type="button"
        >
          Save
        </button>
        <button
          class="button if-print-to-pdf"
          data-event="print"
          data-can="read:invoice"
          type="button"
        >
          Print
        </button>
        <button
          class="button if-desktop"
          data-can="create:invoice"
          data-event="clear"
          type="button"
        >
          Clear
        </button>
        <button
          class="button if-desktop"
          data-event="delete"
          data-can="delete:invoice"
          type="button"
        >
          Delete
        </button>
      </div>
      <div class="vspacer-2"></div>
    </form>
  );

  const labor = form.querySelector(
    "[name=labor]"
  ) as HTMLInputElement;
  const additional = form.querySelector(
    "[name=additional]"
  ) as HTMLInputElement;

  on(labor, "change", () =>
    trigger(form, "change")
  );

  on(additional, "change", () =>
    trigger(form, "change")
  );

  // render line items
  {
    const lineItemsTarget =
      form.querySelector(
        ".line-items"
      ) as HTMLElement;

    const lineItems = invoice.items.map(
      renderInvoiceItem
    );

    lineItems.forEach((item) =>
      setupComputeOnLineItem(form, item)
    );

    lineItems.forEach((item) =>
      moveChildren(
        item,
        lineItemsTarget
      )
    );
  }

  // render payments
  {
    const payementsTarget =
      form.querySelector(
        "#mop-line-item-end"
      ) as HTMLElement;

    const paymentItems =
      invoice.mops?.map(
        renderMopLineItem
      );

    paymentItems?.forEach((item) => {});

    paymentItems?.forEach((item) =>
      moveChildrenBefore(
        item,
        payementsTarget
      )
    );
  }

  on(form, "change", () =>
    compute(form)
  );

  extendNumericInputBehaviors(form);
  extendTextInputBehaviors(form);
  hookupTriggers(form);
  hookupEvents(form);

  if (!invoice.mops?.length) {
    trigger(
      form,
      "add-method-of-payment"
    );
  }
  compute(form);
  return form;
}

function getFirstInput(
  itemPanel: HTMLDivElement
) {
  return itemPanel.querySelector(
    "input"
  ) as HTMLInputElement;
}

function addAnotherItem(
  formDom: HTMLFormElement
) {
  const itemPanel = renderInvoiceItem({
    quantity: 1,
    item: "",
    price: 0,
    total: 0,
    tax: 0,
  });
  setupComputeOnLineItem(
    formDom,
    itemPanel
  );
  const toFocus =
    getFirstInput(itemPanel);
  const target: HTMLElement =
    formDom.querySelector(
      ".line-items"
    ) || formDom;
  itemsToRemove.splice(
    0,
    itemsToRemove.length
  );
  for (
    let i = 0;
    i < itemPanel.children.length;
    i++
  ) {
    itemsToRemove.push(
      itemPanel.children[
        i
      ] as HTMLElement
    );
  }
  extendNumericInputBehaviors(
    itemPanel
  );
  moveChildren(itemPanel, target);
  toFocus?.focus();
}

function hookupEvents(
  formDom: HTMLFormElement
) {
  on(
    formDom,
    "list-all-invoices",
    () => {
      gotoUrl(routes.allInvoices());
    }
  );

  on(
    formDom,
    "remove-last-item",
    () => {
      itemsToRemove.forEach((item) =>
        item.remove()
      );
      trigger(formDom, "change");
    }
  );

  on(
    formDom,
    "add-another-item",
    () => {
      if (!formDom.reportValidity())
        return;
      addAnotherItem(formDom);
      trigger(formDom, "change");
    }
  );

  on(
    formDom,
    "add-method-of-payment",
    () => {
      const target: HTMLElement =
        formDom.querySelector(
          "#mop-line-item-end"
        ) || formDom;
      const mopLineItem =
        renderMopLineItem();

      extendNumericInputBehaviors(
        mopLineItem
      );

      const focus = getFirstInput(
        mopLineItem
      );

      moveChildrenBefore(
        mopLineItem,
        target
      );
      focus.focus();
    }
  );

  on(formDom, "clear", () => {
    gotoUrl(routes.createInvoice());
  });
}

function renderMopLineItem(item?: {
  mop: string;
  paid: number;
}) {
  return (
    <div>
      <input
        type="select"
        class="col-1-4"
        name="method_of_payment"
        value={item?.mop || ""}
        list={forceMopDataList().id}
      />
      <input
        type="number"
        class="col-5-last currency"
        name="amount_paid"
        placeholder="amount paid"
        value={asCurrency(
          item?.paid || 0
        )}
      />
    </div>
  );
}

function compute(
  form: HTMLFormElement
) {
  const labor = form.querySelector(
    "[name=labor]"
  ) as HTMLInputElement;
  const additional = form.querySelector(
    "[name=additional]"
  ) as HTMLInputElement;
  const total_due = form.querySelector(
    "[name=total_due]"
  ) as HTMLInputElement;
  const balance_due =
    form.querySelector(
      "#balance_due"
    ) as HTMLInputElement;
  const totals = Array.from(
    form.querySelectorAll(
      "input[name=total]"
    )
  ).map((input) =>
    parseFloat(
      (input as HTMLInputElement)
        .value || "0"
    )
  );
  const total = totals.reduce(
    (a, b) => a + b,
    0
  );

  const tax = parseFloat(
    asCurrency(total * TAXRATE)
  );

  const grandTotal =
    labor.valueAsNumber +
    additional.valueAsNumber +
    tax +
    total;
  total_due.value =
    grandTotal.toFixed(2);

  const total_payments = sum(
    Array.from(
      form.querySelectorAll(
        "input[name=amount_paid]"
      )
    ).map(asNumber)
  );

  balance_due.value = (
    grandTotal - total_payments
  ).toFixed(2);
}

function renderInvoiceItem(
  item: InvoiceItem
) {
  const form: HTMLDivElement = (
    <div>
      <label class="form-label col-1-last">
        Item
      </label>
      <input
        name="item"
        class="bold col-1-3 text trim"
        required
        autocomplete="off"
        type="text"
        value={item.item}
        list="inventory_list"
      />
      <input
        name="description"
        class="col-4-last text trim"
        type="text"
        value={item.description || ""}
      />
      <label class="form-label col-1-2 quantity">
        Quantity
      </label>
      <label class="form-label col-3-2 currency">
        Price
      </label>
      <label class="form-label col-5-last currency">
        Total
      </label>
      <input
        name="quantity"
        required
        class="quantity col-1-2"
        type="number"
        value={item.quantity}
      />
      <input
        name="price"
        required
        class="currency col-3-2"
        type="number"
        value={item.price.toFixed(2)}
      />
      <input
        readonly
        name="total"
        class="bold currency col-5-last"
        type="number"
        value={item.total.toFixed(2)}
      />
    </div>
  );

  return form;
}

function setupComputeOnLineItem(
  event: HTMLElement,
  form: HTMLDivElement
) {
  const itemInput = form.querySelector(
    "[name=item]"
  ) as HTMLInputElement;
  const quantityInput =
    form.querySelector(
      "[name=quantity]"
    ) as HTMLInputElement;
  const priceInput = form.querySelector(
    "[name=price]"
  ) as HTMLInputElement;
  const descriptionInput =
    form.querySelector(
      "[name=description]"
    ) as HTMLInputElement;
  const totalInput = form.querySelector(
    "[name=total]"
  ) as HTMLInputElement;
  const computeTotal = () => {
    const qty = getValueAsNumber(
      quantityInput
    );
    const price =
      getValueAsNumber(priceInput);
    const value = qty * price;
    totalInput.value = value.toFixed(2);
    trigger(event, "change");
  };
  on(
    quantityInput,
    "change",
    computeTotal
  );
  on(
    priceInput,
    "change",
    computeTotal
  );
  on(itemInput, "change", async () => {
    const item =
      await getInventoryItemByCode(
        itemInput.value
      );
    if (!item) return;
    const price =
      getValueAsNumber(priceInput);
    if (item.price !== price) {
      priceInput.value =
        item.price.toFixed(2);
      trigger(priceInput, "change");
    }

    if (item.description)
      descriptionInput.value =
        item.description;
  });
}

async function getInventoryItemByCode(
  code: string
) {
  const items =
    await inventoryModel.getItems();
  return items.find(
    (item) => item.code === code
  );
}
