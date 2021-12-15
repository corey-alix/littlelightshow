import { dom } from "../dom.js";
import { moveChildren } from "../fun/dom.js";
import { TAXRATE } from "../globals.js";
import { Invoice } from "../services/invoices.js";

function totalInvoice(invoice: Invoice) {
  let total = invoice.items.reduce((a, b) => a + ((b.total || 0) - 0), 0);
  return total * (1 + TAXRATE) + invoice.labor;
}

function renderInvoice(invoice: Invoice): HTMLDivElement {
  return (
    <div>
      <a class="col-1-4" href={`invoice?id=${invoice.id}`}>
        {invoice.clientname}
      </a>
      <label class="col-5 align-right">{invoice.labor.toFixed(2)}</label>
      <label class="col-6 align-right">
        {totalInvoice(invoice).toFixed(2)}
      </label>
    </div>
  );
}
export function create(invoices: Invoice[]) {
  const total = invoices.map(totalInvoice).reduce((a, b) => a + b, 0);

  const report: HTMLFormElement = (
    <form class="grid-6">
      <label class="bold col-1-4">Client</label>
      <label class="bold col-5 align-right">Labor</label>
      <label class="bold col-6 align-right">Total</label>
      <div class="line col-1-6"></div>
    </form>
  );
  invoices.map(renderInvoice).forEach((item) => moveChildren(item, report));
  moveChildren(
    <div>
      <div class="line col-1-6"></div>
      <label class="bold col-1-4">Total</label>
      <label class="bold col-5-2 align-right">{total.toFixed(2)}</label>
      <div class="vspacer-2 col-1-6"></div>
      <button type="button" class="button col-1-2" data-event="create-invoice">
        Create Invoice
      </button>
    </div>,
    report
  );
  return report;
}
