import { dom } from "../dom.js";
import { Invoice } from "../services/invoices.js";

function moveChildren(items: HTMLDivElement, report: HTMLDivElement) {
  while (items.firstChild) report.appendChild(items.firstChild);
}

function totalInvoice(invoice: Invoice) {
  let total = invoice.items.reduce((a, b) => a + ((b.total || 0) - 0), 0);
  return total;
}

function renderInvoice(invoice: Invoice): HTMLDivElement {
  return (
    <div>
      <label class="col-1-4">{invoice.clientname}</label>
      <label class="col-5-2 currency">{totalInvoice(invoice).toFixed(2)}</label>
    </div>
  );
}
export function create(invoices: Invoice[]) {
  const total = invoices.map(totalInvoice).reduce((a, b) => a + b, 0);

  const report: HTMLDivElement = <div class="grid-6"></div>;
  invoices.map(renderInvoice).forEach((item) => moveChildren(item, report));
  moveChildren(
    <div>
      <div class="line col-1-6"></div>
      <label class="bold col-1-4">Total</label>
      <label class="currency bold col-5-2">{total.toFixed(2)}</label>
    </div>,
    report
  );
  return report;
}
