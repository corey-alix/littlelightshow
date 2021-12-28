import { asCurrency } from "../fun/asCurrency";
import { globals } from "../globals.js";
const { TAXRATE } = globals;
import { StorageModel } from "./StorageModel";

const INVOICE_TABLE = "invoices";

export interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  total: number;
  tax: number;
}

export interface Invoice {
  id?: string;
  clientname: string;
  billto: string;
  telephone?: string;
  email?: string;
  date: number;
  comments?: string;
  // TODO: labor + additional should become mobs (method of billing)
  labor: number;
  // TODO: labor + additional should become mobs (method of billing)
  additional: number;
  items: Array<InvoiceItem>;
  mops: Array<{
    mop: string;
    paid: number;
  }>;
  taxrate: number;
}

export const invoiceModel =
  new StorageModel<Invoice>({
    tableName: INVOICE_TABLE,
    offline: false,
  });

export async function removeItem(
  id: string
) {
  return invoiceModel.removeItem(id);
}

export async function getItem(
  id: string
) {
  return invoiceModel.getItem(id);
}

export async function upsertItem(
  data: Invoice
) {
  return invoiceModel.upsertItem(data);
}

export async function getItems() {
  const invoices =
    await invoiceModel.getItems();

  let normalizedInvoices = invoices.map(
    normalizeInvoice
  );

  const response = normalizedInvoices
    .filter((invoice) => invoice.items)
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

  return response;
}

function normalizeInvoice(
  invoice: Invoice
) {
  let raw = invoice as any;
  if (raw.data) {
    raw.data.id = invoice.id;
    raw.data.mops = invoice.mops || [];
    invoice = raw = raw.data;
  }
  invoice.mops = invoice.mops || [];
  invoice.items = invoice.items || [];

  if (raw["paid"] && raw["mop"]) {
    invoice.mops.push({
      mop: raw["mop"],
      paid: raw["paid"],
    });
    delete raw["paid"];
    delete raw["mop"];
  }

  if (!invoice.taxrate && TAXRATE) {
    invoice.taxrate = TAXRATE;
    invoice.items.forEach(
      (i) =>
        (i.tax = parseFloat(
          asCurrency(
            i.total * invoice.taxrate
          )
        ))
    );
  }
  return raw as Invoice;
}
