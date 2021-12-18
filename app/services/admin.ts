import { query as q } from "faunadb";
import { asCurrency } from "../fun/asCurrency.js";
import { sum } from "../fun/sum.js";
import { createClient, TAXRATE } from "../globals.js";
import { Ledger, save as saveLedger, ledgers as loadAllLedgers } from "./gl.js";
import { Invoice, invoices as loadAllInvoices } from "./invoices.js";

export async function importInvoicesToGeneralLedger() {
  const invoices = await loadAllInvoices();
  const ledgers = await loadAllLedgers();
  let invoicesToImport = invoices.filter(
    (i) => !ledgers.find((l) => l.description === `INVOICE ${i.id}`)
  );

  // update these invoices
  invoices.forEach((i) => {
    const ledger = ledgers.find((l) => l.description === `INVOICE ${i.id}`);
    if (!ledger) return;
    if (ledger.date === i.date) return;
    // todo...any changes should be logged
    ledger.date = i.date;
    saveLedger(ledger);
  });

  while (invoicesToImport.length) {
    const invoice = invoicesToImport.shift()!;
    const inventory = sum(invoice.items.map((i) => i.total));
    const tax = inventory * TAXRATE;
    const labor = invoice.labor;
    const rent = invoice.additional > 0 ? invoice.additional : 0;
    const discount = invoice.additional < 0 ? invoice.additional : 0;
    const ledger: Ledger = {
      date: invoice.date,
      description: `INVOICE ${invoice.id}`,
      items: [
        {
          account: "AR",
          amount: inventory,
          comment: "INVENTORY",
        },
        {
          account: "INVENTORY",
          amount: -inventory,
          comment: "INVENTORY",
        },
        {
          account: "AR",
          amount: tax,
          comment: "TAX",
        },
        {
          account: "TAX",
          amount: -tax,
          comment: "TAX",
        },
        {
          account: "AR",
          amount: rent,
          comment: "RENT",
        },
        {
          account: "RENT",
          amount: -rent,
          comment: "RENT",
        },
        {
          account: "AR",
          amount: labor,
          comment: "LABOR",
        },
        {
          account: "LABOR",
          amount: -labor,
          comment: "LABOR",
        },
        {
          account: "AR",
          amount: discount,
          comment: "DISCOUNT",
        },
        {
          account: "LABOR",
          amount: -discount,
          comment: "DISCOUNT",
        },
      ],
    };

    ledger.items = ledger.items.filter((i) => 0 != i.amount);
    await saveLedger(ledger);
    debugger;
  }
}

export async function copyInvoicesFromTodo() {
  const client = createClient();

  const result = (await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Todos")), { size: 25 }),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  )) as { data: Array<{ data: Invoice }> };

  const invoices = result.data.map((v) => v.data);

  invoices.forEach(async (invoice, index) => {
    console.log("copying invoice", invoice);
    const priorKey = invoice.id;
    const id = 1001 + index;
    const result = await client.query(
      q.Create(q.Collection("invoices"), {
        data: { ...invoice, priorKey, id },
      })
    );
  });
}

export async function copyGeneralLedgerEntriesFromTodo() {
  const client = createClient();

  const result = (await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Todos"))),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  )) as { data: Array<{ data: Ledger }> };

  const records = result.data
    .map((v) => v.data)
    .filter((v) => v.items.length && !!v.items[0].account);

  records.forEach(async (record) => {
    console.log("ledger", { record });
    await client.query(
      q.Create(q.Collection("general_ledger"), {
        data: record,
      })
    );
  });
}
