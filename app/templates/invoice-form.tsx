import { dom } from "../dom.js";
import { moveChildren } from "../fun/dom.js";
import { Invoice, InvoiceItem } from "../services/invoices.js";

export function create(invoice: Invoice): HTMLFormElement {
  console.log({ invoice });
  const form: HTMLFormElement = (
    <form id="invoice-form">
      <h1>Create an Invoice</h1>
      <input
        class="form-label"
        readonly
        type="text"
        name="id"
        value={invoice.id}
      />
      <section class="category">
        <div class="section-title">Client</div>
        <section class="grid-6">
          <label class="form-label col-1-6">
            Client Name
            <input
              type="text"
              placeholder="clientname"
              name="clientname"
              required
              value={invoice.clientname}
            />
          </label>
          <label class="form-label col-1-3">
            Telephone
            <input
              type="tel"
              placeholder="telephone"
              name="telephone"
              value={invoice.telephone}
            />
          </label>
          <label class="form-label col-4-3">
            Email{" "}
            <input
              type="email"
              placeholder="email"
              name="email"
              value={invoice.email}
            />
          </label>
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
        </section>
      </section>
      <div class="vspacer"></div>
      <section class="category">
        <div class="section-title">Items</div>
        <section class="line-items grid-6"></section>
      </section>
      <div class="vspacer"></div>
      <section class="grid-6">
        <button
          class="button col-1-3"
          data-event="add-another-item"
          type="button"
        >
          Add item
        </button>
        <button
          class="button col-4-3"
          data-event="remove-last-item"
          type="button"
        >
          Remove Last Item
        </button>
        <label class="form-label col-1-6">Labor</label>
        <input
          type="number"
          class="currency"
          placeholder="labor"
          name="labor"
          id="labor"
          value={invoice.labor.toFixed(2)}
        />
        <label class="form-label col-1-6">Total + Tax</label>
        <input
          readonly
          type="number"
          class="currency"
          id="total_due"
          name="total_due"
          value="$0.00"
        />
      </section>
      <section class="grid-6">
        <div class="vspacer-1"></div>
        <button class="button col-1-2" data-event="submit" type="button">
          Save
        </button>
        <button class="button col-3-2" data-event="print" type="button">
          Print
        </button>
        <button class="button col-1-2" data-event="clear" type="button">
          Clear
        </button>
        <button
          class="button col-3-2"
          data-event="list-all-invoices"
          type="button"
        >
          List All Invoices
        </button>
      </section>
    </form>
  );

  const lineItemsTarget = form.querySelector(".line-items") as HTMLElement;
  const lineItems = invoice.items.map(renderInvoiceItem);
  lineItems.forEach((item) => moveChildren(item, lineItemsTarget));
  return form;
}

export function renderInvoiceItem(item: InvoiceItem): HTMLDivElement {
  return (
    <div>
      <label class="form-label col-1-6">
        Item
        <input required type="text" value={item.item} />
      </label>
      <label class="form-label col-1-3">
        Quantity
        <input required class="quantity" type="number" value={item.quantity} />
      </label>
      <label class="form-label col-4-3">
        Price
        <input
          required
          class="currency"
          type="text"
          value={item.price.toFixed(2)}
        />
      </label>
      <label class="form-label col-4-3">
        Total
        <input
          class="bold currency"
          type="text"
          value={item.total.toFixed(2)}
        />
      </label>
    </div>
  );
}
