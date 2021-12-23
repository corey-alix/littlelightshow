import { StorageModel } from "./StorageModel.js";

const LEDGER_TABLE = "general_ledger";

export interface LedgerItem {
  comment: string;
  account: string;
  amount: number;
}

export interface Ledger {
  id?: string;
  date: number;
  description?: string;
  items: Array<LedgerItem>;
}

export const ledgerModel =
  new StorageModel<Ledger>({
    tableName: LEDGER_TABLE,
    offline: false,
  });

export async function removeItem(
  id: string
) {
  return ledgerModel.removeItem(id);
}

export async function getItem(
  id: string
) {
  return ledgerModel.getItem(id);
}

export async function upsertItem(
  data: Ledger
) {
  return ledgerModel.upsertItem(data);
}

export async function getItems() {
  const items =
    await ledgerModel.getItems();
  return items.filter(
    (ledger) =>
      ledger.items &&
      ledger.items[0] &&
      ledger.items[0].account
  );
}
