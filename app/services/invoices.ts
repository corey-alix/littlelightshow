import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  createClient,
  CURRENT_USER,
  isDebug,
  isOffline,
} from "../globals.js";

const INVOICE_TABLE = "invoices";
const cache = new ServiceCache<Invoice>(
  INVOICE_TABLE
);

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
  mops: Array<{
    mop: string;
    paid: number;
  }>;
}

export async function deleteInvoice(
  id: string
) {
  if (!CURRENT_USER)
    throw "user must be signed in";

  if (!isOffline) {
    const client = createClient();
    const result = await client.query(
      q.Delete(
        q.Ref(
          q.Collection(INVOICE_TABLE),
          id
        )
      )
    );
  }

  cache.deleteLineItem(id);
}

export async function save(
  invoice: Invoice
) {
  if (!CURRENT_USER)
    throw "user must be signed in";

  const client = createClient();

  if (!invoice.id) {
    if (!isOffline) {
      const result =
        (await client.query(
          q.Create(
            q.Collection(INVOICE_TABLE),
            {
              data: {
                ...invoice,
                user: CURRENT_USER,
                create_date: Date.now(),
              },
            }
          )
        )) as {
          data: Invoice[];
          ref: { id: string };
        };
      invoice.id = result.ref.id;
    } else {
      invoice.id =
        "invoice_" +
        Date.now().toFixed();
    }
  } else {
    if (!isOffline) {
      const result = await client.query(
        q.Update(
          q.Ref(
            q.Collection(INVOICE_TABLE),
            invoice.id
          ),
          {
            data: {
              ...invoice,
              user: CURRENT_USER,
              update_date: Date.now(),
            },
          }
        )
      );
    }
  }
  cache.updateLineItem(invoice);
}

export async function invoices() {
  if (!CURRENT_USER)
    throw "user must be signed in";

  if (isOffline || !cache.expired())
    return cache.get();

  const client = createClient();

  const result: any =
    await client.query(
      q.Map(
        q.Paginate(
          q.Documents(
            q.Collection(INVOICE_TABLE)
          ),
          { size: 100 }
        ),
        q.Lambda(
          "ref",
          q.Get(q.Var("ref"))
        )
      )
    );

  const invoices =
    result.data as Array<{
      data: Invoice;
      ref: any;
    }>;

  // copy ref into invoice id
  invoices.forEach((invoice) => {
    invoice.data.id =
      invoice.ref.value.id;
    if (
      invoice.data["paid"] &&
      invoice.data["mop"]
    ) {
      invoice.data.mops.push({
        mop: invoice.data["mop"],
        paid: invoice.data["paid"],
      });
      delete invoice.data["paid"];
      delete invoice.data["mop"];
    }
  });

  const response = invoices
    .filter(
      (invoice) => invoice.data.items
    )
    .map((invoice) => invoice.data)
    .map((invoice) => {
      invoice.date =
        invoice.date ||
        (invoice as any).create_date;
      invoice.labor =
        (invoice.labor || 0) - 0;
      invoice.additional =
        (invoice.additional || 0) - 0;
      invoice.items.forEach((item) => {
        item.item = (
          item.item || ""
        ).toLocaleUpperCase();
        item.quantity =
          (item.quantity || 0) - 0;
        item.price =
          (item.price || 0) - 0;
        item.total =
          (item.total || 0) - 0;
      });
      return invoice;
    })
    .sortBy({ date: "date" })
    .reverse();

  cache.set(response);
  return response;
}
