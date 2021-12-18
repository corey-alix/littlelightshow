import { query as q } from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";
import { Invoice } from "./invoices.js";

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
      q.Paginate(q.Documents(q.Collection("Todos")), { size: 25 }),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  )) as { data: Array<{ data: Invoice }> };

  const records = result.data.map((v) => v.data);

  records.forEach(async (record, index) => {
    console.log("copying invoice", record);
    const priorKey = record.id;
    const result = await client.query(
      q.Create(q.Collection("general_ledger"), {
        data: { ...record, priorKey },
      })
    );
  });
}
