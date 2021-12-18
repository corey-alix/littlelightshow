import { query as q } from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";

const INVOICE_TABLE = "invoices";

export interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  clientname: string;
  date: number;
  labor: number;
  additional: number;
  id: string;
  billto: string;
  telephone?: string;
  email?: string;
  comments?: string;
  items: Array<InvoiceItem>;
}

export async function deleteInvoice(id: string) {
  if (!CURRENT_USER) throw "user must be signed in";
  const client = createClient();
  const result = await client.query(
    q.Delete(q.Ref(q.Collection(INVOICE_TABLE), id))
  );
}

export async function save(invoice: Invoice) {
  if (!CURRENT_USER) throw "user must be signed in";

  const client = createClient();

  if (!invoice.id) {
    const result = (await client.query(
      q.Create(q.Collection(INVOICE_TABLE), {
        data: { ...invoice, user: CURRENT_USER, create_date: Date.now() },
      })
    )) as { data: any; ref: any };
    invoice.id = result.ref.id;
  } else {
    const result = await client.query(
      q.Update(q.Ref(q.Collection(INVOICE_TABLE), invoice.id), {
        data: { ...invoice, user: CURRENT_USER, update_date: Date.now() },
      })
    );
  }
}

export async function invoices() {
  if (!CURRENT_USER) throw "user must be signed in";

  const client = createClient();

  const result: any = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection(INVOICE_TABLE)), { size: 100 }),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );

  const invoices = result.data as Array<{ data: Invoice }>;
  // copy ref into invoice id
  invoices.forEach((invoice: any) => {
    invoice.data.id = invoice.ref.value.id;
  });
  return invoices
    .filter((invoice) => invoice.data.items)
    .map((invoice) => invoice.data)
    .map((invoice) => {
      invoice.date = invoice.date || (invoice as any).create_date;
      invoice.labor = (invoice.labor || 0) - 0;
      invoice.additional = (invoice.additional || 0) - 0;
      invoice.items.forEach((item) => {
        item.item = (item.item || "").toLocaleUpperCase();
        item.quantity = (item.quantity || 0) - 0;
        item.price = (item.price || 0) - 0;
        item.total = (item.total || 0) - 0;
      });
      return invoice;
    })
    .sort((a, b) => a.date - b.date)
    .reverse();
}
