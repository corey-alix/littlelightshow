import { dom } from "../../dom.js";
import { moveChildren } from "../../fun/dom.js";
import { TAXRATE } from "../../globals.js";
import { Invoice, InvoiceItem } from "../../services/invoices.js";

function invoiceItem(item: InvoiceItem): HTMLDivElement {
  console.log("invoiceItem", { item });
  return (
    <div>
      <label class="tall col-1-3">{item.item}</label>
      <label class="tall col-4 align-right">{item.quantity.toFixed(2)}</label>
      <label class="tall col-5 align-right">{item.price.toFixed(2)}</label>
      <label class="tall col-6 align-right">{item.total.toFixed(2)}</label>
    </div>
  );
}

export function create(invoice: Invoice) {
  const report: HTMLDivElement = (
    <div class="print page grid-6">
      <label class="bold col-1-2">Little Light Show</label>
      <label class="bold col-3-4 align-right">Invoice</label>
      <div class="line col-1-6"></div>
      <div class="col-1-6 vspacer"></div>
      <label class="col-1-2">Nathan Alix</label>
      <label class="col-5-2 align-right">{invoice.id}</label>
      <label class="col-1-2">4 Andrea Lane</label>
      <label class="col-5-2 align-right">{new Date().toDateString()}</label>
      <label class="col-1-2">Greenville, SC 29615</label>
      <div class="vspacer-2 col-1-6"></div>
      <label class="bold col-1">Bill To:</label>
      <label class="col-2-2">{invoice.clientname}</label>
      {invoice.billto.split("\n").map((n) => (
        <label class="col-2-2">{n}</label>
      ))}
      {invoice.comments && <div class="vspacer-2 col-1-6"></div>}
      {invoice.comments &&
        invoice.comments
          .split("\n")
          .map((n) => <label class="col-2-5">{n}</label>)}
      <div class="vspacer-2 col-1-6"></div>
      <label class="bold col-1-3">Description</label>
      <label class="bold col-4 align-right">Quantity</label>
      <label class="bold col-5 align-right">Rate</label>
      <label class="bold col-6 align-right">Amount</label>
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
        {invoice.additional && <label class="col-5">Additional</label>}
        {invoice.additional && (
          <label class="col-6 align-right">
            {invoice.additional.toFixed(2)}
          </label>
        )}
        <label class="bold col-5">Balance Due</label>
        <label class="bold col-6 align-right">
          {(
            (invoice.labor || 0) +
            (invoice.additional || 0) +
            totalItems * (1 + TAXRATE)
          ).toFixed(2)}
        </label>
      </div>
    );

    moveChildren(summary, report);
  }
  return report;
}
