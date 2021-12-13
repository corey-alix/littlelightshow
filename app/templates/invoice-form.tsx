import { dom } from "../dom.js";

export const template = (
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
    <div class="vspacer-1"></div>
    <button class="button" data-event="submit" type="button">
      Save
    </button>
    <div class="vspacer"></div>
    <button class="button" data-event="clear" type="button">
      Start Over
    </button>
    <button class="button" data-event="list-all-invoices" type="button">
      List All Invoices
    </button>
  </form>
);
