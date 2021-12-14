import { dom } from "../dom.js";
import { TAXRATE } from "../globals.js";
import { Invoice, InvoiceItem } from "../services/invoices.js";

function invoiceItem(item: InvoiceItem): HTMLDivElement {
  return (
    <div>
      <label class="tall col-1-3">{item.item}</label>
      <label class="tall col-4 align-right">{item.quantity}</label>
      <label class="tall col-5 align-right">{item.price}</label>
      <label class="tall col-6 align-right">{item.total}</label>
    </div>
  );
}

export function create(invoice: Invoice) {
  const report: HTMLDivElement = (
    <div class="print page grid-6">
      <label class="bold line row-1 col-1-2">Little Light Show</label>
      <label class="bold line row-1 col-5-2 align-right">Invoice</label>
      <label class="row-2 col-1-2">Nathan Alix</label>
      <label class="row-2 col-5-2 align-right">{invoice.id}</label>
      <label class="row-3 col-1-2">4 Andrea Lane</label>
      <label class="row-3 col-5-2 align-right">
        {new Date().toDateString()}
      </label>
      <div class="vspacer-2 col-1-6"></div>
      <label class="bold row-5 col-1">Bill To:</label>
      <label class="row-5 col-2-2">{invoice.clientname}</label>
      <label class="row-6 col-2-2">{invoice.billto}</label>
      {invoice.comments && <div class="vspacer-2 col-1-6"></div>}
      {invoice.comments && (
        <label class="row-6 col-2-5">{invoice.comments}</label>
      )}
      <div class="vspacer-2 col-1-6"></div>
      <label class="bold row-7 col-1-3">Description</label>
      <label class="bold row-7 col-4 align-right">Quantity</label>
      <label class="bold row-7 col-5 align-right">Rate</label>
      <label class="bold row-7 col-6 align-right">Amount</label>
      <div class="line col-1-6" />
    </div>
  );
  {
    invoice.items.forEach((item) => {
      moveChildren(invoiceItem(item), report);
    });

    const totalItems = invoice.items.reduce(
      (a, b) => a + ((b.total || 0) - 0),
      0
    );
    console.log(invoice.items, totalItems);
    const summary = (
      <div>
        <div class="line col-1-6" />
        <div class="vspacer-2 col-1-6"></div>
        <label class="col-5">Total Supplies</label>
        <label class="col-6 align-right">{totalItems.toFixed(2)}</label>
        <label class="col-5">Tax ({100 * TAXRATE + ""}%)</label>
        <label class="col-6 align-right">
          {(totalItems * TAXRATE).toFixed(2)}
        </label>
        {invoice.labor && <label class="col-5">Labor</label>}
        {invoice.labor && (
          <label class="col-6 align-right">{invoice.labor.toFixed(2)}</label>
        )}
        <label class="bold col-5">Balance Due</label>
        <label class="bold col-6 align-right">
          {((invoice.labor || 0) + totalItems * (1 + TAXRATE)).toFixed(2)}
        </label>
      </div>
    );

    moveChildren(summary, report);
  }
  return report;
}
function moveChildren(items: HTMLDivElement, report: HTMLDivElement) {
  while (items.firstChild) report.appendChild(items.firstChild);
}
