import { StorageModel } from "./StorageModel";

const INVOICE_TABLE = "invoices";

export interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  total: number;
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

  invoices.forEach((invoice) => {
    invoice.mops = invoice.mops || [];
    if (
      invoice["paid"] &&
      invoice["mop"]
    ) {
      invoice.mops.push({
        mop: invoice["mop"],
        paid: invoice["paid"],
      });
      delete invoice["paid"];
      delete invoice["mop"];
    }
  });

  const response = invoices
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
