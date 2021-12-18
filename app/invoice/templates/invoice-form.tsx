import { dom } from "../../dom.js";
import { asDateString } from "../../fun/asDateString.js";
import { moveChildren } from "../../fun/dom.js";
import { hookupTriggers } from "../../fun/hookupTriggers.js";
import { on, trigger } from "../../fun/on.js";
import { TAXRATE } from "../../globals.js";
import { forceDatalist, inventoryManager } from "../../InventoryManager.js";
import { Invoice, InvoiceItem } from "../../services/invoices.js";

export function create(invoice: Invoice): HTMLFormElement {
  console.log({ invoice });
  const form: HTMLFormElement = (
    <form class="grid-6" id="invoice-form">
      <h1 class="col-1-6">Create an Invoice</h1>
      <input
        class="form-label hidden"
        readonly
        type="text"
        name="id"
        value={invoice.id}
      />
      <div class="section-title col-1-6">Client</div>
      <label class="form-label col-1-5">Client Name</label>
      <label class="form-label col-6">Date</label>
      <input
        class="col-1-5"
        type="text"
        placeholder="clientname"
        name="clientname"
        required
        value={invoice.clientname}
      />
      <input
        class="col-6"
        type="date"
        placeholder="Date"
        name="date"
        required
        value={asDateString(new Date(invoice.date || Date.now()))}
      />
      <label class="form-label col-1-3">Telephone</label>
      <label class="form-label col-4-3">Email</label>
      <input
        type="tel"
        class="col-1-3"
        placeholder="telephone"
        name="telephone"
        value={invoice.telephone}
      />
      <input
        type="email"
        class="col-4-3"
        placeholder="email"
        name="email"
        value={invoice.email}
      />
      <label class="form-label col-1-6">
        Bill To
        <textarea class="address" placeholder="billto" name="billto">
          {invoice.billto}
        </textarea>
      </label>
      <label class="form-label col-1-6">
        Comments
        <textarea class="comments" placeholder="comments" name="comments">
          {invoice.comments}
        </textarea>
      </label>
      <div class="vspacer col-1-6"></div>
      <section class="line-items grid-6 col-1-6">
        <div class="section-title col-1-6">Items</div>
      </section>
      <div class="vspacer col-1-6"></div>
      <button
        class="button col-1-4"
        data-event="add-another-item"
        type="button"
      >
        Add item
      </button>
      <button
        class="button col-5-2"
        data-event="remove-last-item"
        type="button"
      >
        Remove Last Item
      </button>
      <div class="vspacer col-1-6"></div>
      <div class="section-title col-1-6">Summary</div>
      <label class="form-label col-1-2 currency">Labor</label>
      <label class="form-label col-3-2 currency">Other</label>
      <label class="form-label col-5-2 currency">Total + Tax</label>
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
        value={invoice.additional.toFixed(2)}
      />
      <input
        readonly
        type="number"
        class="currency col-5-2 bold"
        id="total_due"
        name="total_due"
      />
      <div class="vspacer-1 col-1-6 flex">
        <button class="bold button" data-event="submit" type="button">
          Save
        </button>
        <button class="button" data-event="print" type="button">
          Print
        </button>
        <button class="button" data-event="clear" type="button">
          Clear
        </button>
        <button class="button" data-event="delete" type="button">
          Delete
        </button>
        <button class="button" data-event="list-all-invoices" type="button">
          Show All
        </button>
      </div>
    </form>
  );

  const labor = form.querySelector("[name=labor]") as HTMLInputElement;
  const additional = form.querySelector(
    "[name=additional]"
  ) as HTMLInputElement;

  on(labor, "change", () => trigger(form, "change"));

  on(additional, "change", () => trigger(form, "change"));

  const lineItemsTarget = form.querySelector(".line-items") as HTMLElement;
  const lineItems = invoice.items.map(renderInvoiceItem);
  lineItems.forEach((item) => setupComputeOnLineItem(form, item));
  lineItems.forEach((item) => moveChildren(item, lineItemsTarget));
  on(form, "change", () => compute(form));
  hookupTriggers(form);
  compute(form);
  return form;
}

function compute(form: HTMLFormElement) {
  const labor = form.querySelector("[name=labor]") as HTMLInputElement;
  const additional = form.querySelector(
    "[name=additional]"
  ) as HTMLInputElement;
  const total_due = form.querySelector("[name=total_due]") as HTMLInputElement;
  const totals = Array.from(form.querySelectorAll("input[name=total]")).map(
    (input) => parseFloat((input as HTMLInputElement).value || "0")
  );
  const total = totals.reduce((a, b) => a + b, 0);
  const grandTotal =
    labor.valueAsNumber + additional.valueAsNumber + total * (1.0 + TAXRATE);
  total_due.value = grandTotal.toFixed(2);
}

// TODO: make private
export function renderInvoiceItem(item: InvoiceItem): HTMLDivElement {
  const form: HTMLDivElement = (
    <div>
      <label class="form-label col-1-6">Item</label>
      <input
        name="item"
        class="bold col-1-6"
        required
        type="text"
        value={item.item}
        list={forceDatalist().id}
      />
      <label class="form-label col-1 quantity">Quantity</label>
      <label class="form-label col-2-2 currency">Price</label>
      <label class="form-label col-4-3 currency">Total</label>
      <input
        name="quantity"
        required
        class="quantity col-1"
        type="number"
        value={item.quantity}
      />
      <input
        name="price"
        required
        class="currency col-2-2"
        type="number"
        step="0.01"
        value={item.price.toFixed(2)}
      />
      <input
        readonly
        name="total"
        class="bold currency col-4-3"
        type="number"
        value={item.total.toFixed(2)}
      />
    </div>
  );

  return form;
}

// TODO: make private
export function setupComputeOnLineItem(
  event: HTMLElement,
  form: HTMLDivElement
) {
  const itemInput = form.querySelector("[name=item]") as HTMLInputElement;
  const quantityInput = form.querySelector(
    "[name=quantity]"
  ) as HTMLInputElement;
  const priceInput = form.querySelector("[name=price]") as HTMLInputElement;
  const totalInput = form.querySelector("[name=total]") as HTMLInputElement;
  const computeTotal = () => {
    const qty = parseFloat(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const value = qty * price;
    console.log({ qty, price, value });
    totalInput.value = value.toFixed(2);
    trigger(event, "change");
  };
  on(quantityInput, "change", computeTotal);
  on(priceInput, "change", computeTotal);
  on(itemInput, "change", () => {
    const item = inventoryManager.getInventoryItemByCode(itemInput.value);
    if (!item) return;
    const price = parseFloat(priceInput.value);
    if (item.price !== price) {
      priceInput.value = item.price.toFixed(2);
      trigger(priceInput, "change");
    }
  });
}
