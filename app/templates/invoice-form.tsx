import { dom } from "../dom.js";

export function create(): HTMLFormElement {
  return (
    <form id="invoice-form">
      <h1>Create an Invoice</h1>
      <section class="category">
        <div class="section-title">Client</div>
        <section class="grid-container">
          <label class="form-label">
            Client Name
            <input
              type="text"
              placeholder="clientname"
              name="clientname"
              required
            />
          </label>
          <label class="form-label">
            Telephone
            <input type="tel" placeholder="telephone" name="telephone" />
          </label>
          <label class="form-label">
            Email <input type="email" placeholder="email" name="email" />
          </label>
          <label class="form-label">
            Bill To
            <textarea
              class="address"
              placeholder="billto"
              name="billto"
            ></textarea>
          </label>
          <label class="form-label">
            Comments
            <textarea
              class="comments"
              placeholder="comments"
              name="comments"
            ></textarea>
          </label>
        </section>
      </section>
      <div class="vspacer"></div>
      <section class="category">
        <div class="section-title">Items</div>
        <section class="line-items line-item-grid"></section>
      </section>
      <div class="vspacer"></div>
      <button class="button" data-event="add-another-item" type="button">
        Add item
      </button>
      <section class="line-items">
        <label class="form-label align-right">Labor</label>
        <input
          type="number"
          class="currency"
          placeholder="labor"
          name="labor"
          id="labor"
        />
        <label class="form-label align-right">Total + Tax</label>
        <input
          readonly
          type="number"
          class="currency"
          id="total_due"
          name="total_due"
          value="$0.00"
        />
      </section>
      <div class="vspacer-1"></div>
      <button class="button" data-event="submit" type="button">
        Save
      </button>
      <button class="button" data-event="print" type="button">
        Print
      </button>
      <button class="button" data-event="clear" type="button">
        Clear
      </button>
      <button class="button" data-event="list-all-invoices" type="button">
        List All Invoices
      </button>
    </form>
  );
}
