import { dom } from "../../dom.js";
import { asCurrency } from "../../fun/asCurrency.js";
import { moveChildren } from "../../fun/dom.js";
import { noZero } from "../../fun/isZero.js";
import { sum } from "../../fun/sum.js";
import { globals } from "../../globals.js";
import { routes } from "../../router.js";

import { Invoice } from "../../services/invoices.js";

export function create(
  invoices: Invoice[]
) {
  const total = sum(
    invoices.map(totalInvoice)
  );

  const labor = sum(
    invoices.map((i) => i.labor)
  );

  const payments = sum(
    invoices.map(totalPayments)
  );
  const balanceDue = total - payments;

  const target: HTMLFormElement =
    invoices.length ? (
      <form class="grid-6">
        <h1 class="centered col-1-last">
          {`Invoices for ${globals.primaryContact.companyName}`}
        </h1>
        <div class="bold col-1-4">
          Client
        </div>
        <div class="bold col-5 align-right">
          Labor
        </div>
        <div class="bold col-6 align-right">
          Total
        </div>
        <div class="bold col-7-last align-right">
          Balance Due
        </div>
        <div class="line col-1-last"></div>
      </form>
    ) : (
      <form class="grid-6">
        <div class="col-1-last centered">
          No invoices defined
        </div>
        <div class="line col-1-last"></div>
      </form>
    );

  invoices
    .map(renderInvoice)
    .forEach((item) =>
      moveChildren(item, target)
    );

  invoices.length &&
    moveChildren(
      <div>
        <div class="vspacer-1 col-1-last"></div>
        <div class="line col-1-last"></div>
        <label class="bold col-1-4">
          Total
        </label>
        <label class="bold col-5 currency">
          {asCurrency(labor)}
        </label>
        <label class="bold col-6 currency">
          {asCurrency(total)}
        </label>
        <label class="bold col-7-last currency">
          {asCurrency(balanceDue)}
        </label>
        <div class="vspacer-2 col-1-last"></div>
      </div>,
      target
    );

  return target;
}

function totalInvoice(
  invoice: Invoice
) {
  const total = sum(
    invoice.items.map((i) => i.total)
  );

  const tax = sum(
    invoice.items.map((i) => i.tax)
  );

  return (
    total +
    tax +
    invoice.labor +
    invoice.additional
  );
}

function renderInvoice(
  invoice: Invoice
): HTMLDivElement {
  const invoiceTotal =
    totalInvoice(invoice);
  return (
    <div>
      <a
        class="col-1-4"
        href={`${routes.invoice(
          invoice.id!
        )}`}
      >
        {invoice.clientname}
      </a>
      <label class="col-5 currency">
        {asCurrency(invoice.labor)}
      </label>
      <label class="col-6 currency">
        {asCurrency(invoiceTotal)}
      </label>
      <label class="col-7 currency">
        {noZero(
          asCurrency(
            invoiceTotal -
              totalPayments(invoice)
          )
        )}
      </label>
    </div>
  );
}
function totalPayments(
  invoice: Invoice
): number {
  return sum(
    invoice.mops.map((i) => i.paid)
  );
}
