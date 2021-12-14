import faunadb from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";

const { query } = faunadb;
const q = query;

export interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  labor: number;
  id: string;
  clientname: string;
  billto: string;
  telephone?: string;
  email?: string;
  comments?: string;
  items: Array<InvoiceItem>;
}

export async function save(invoice: Invoice) {
  const client = createClient();

  if (!invoice.id) {
    const result = await client.query(
      q.Create(q.Collection("Todos"), {
        data: { ...invoice, user: CURRENT_USER },
      })
    );
  } else {
    const result = await client.query(
      q.Update(q.Ref(q.Collection("Todos"), invoice.id), {
        data: { ...invoice, user: CURRENT_USER || "unknown" },
      })
    );
  }
}

export async function invoices() {
  const client = createClient();

  const result: any = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Todos"))),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );

  console.log("invoices", result);

  const invoices = result.data as Array<{ data: Invoice }>;
  // copy ref into invoice id
  invoices.forEach((invoice: any) => (invoice.data.id = invoice.ref.value.id));
  return invoices
    .filter((invoice) => invoice.data.items)
    .map((invoice) => invoice.data)
    .map((invoice) => {
      invoice.items.forEach((item) => {
        item.quantity = item.quantity - 0;
        item.price = item.price - 0;
        item.total = item.total - 0;
      });
      return invoice;
    });
}
