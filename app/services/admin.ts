import { query as q } from "faunadb";
import { sum } from "../fun/sum.js";
import {
  createClient,
  globals,
} from "../globals.js";
const { TAXRATE } = globals;
import {
  Ledger,
  upsertItem as saveLedger,
  getItems as loadAllLedgers,
} from "./gl.js";
import {
  Invoice,
  getItems as loadAllInvoices,
} from "./invoices.js";
import { split } from "../fun/split";
import { distinct } from "../fun/distinct.js";
import { asCurrency } from "../fun/asCurrency.js";
import { inventoryModel } from "./inventory.js";

export async function removeDuplicateInventoryItems() {
  const inventoryItems =
    await inventoryModel.getItems();
  const itemCodes = distinct(
    inventoryItems.map((i) => i.code)
  );
  for (let code of itemCodes) {
    const duplicates =
      inventoryItems.filter(
        (i) => i.code === code
      );
    if (duplicates.length <= 1)
      continue;

    const deleteOrder =
      duplicates.sortBy({
        taxrate: "-number",
      });

    while (deleteOrder.length > 1) {
      const deleteMe =
        deleteOrder.pop()!;
      await inventoryModel.removeItem(
        deleteMe.id!
      );
    }
  }
}

export async function forceUpdatestampTable(
  tableName: string
) {
  const client = createClient();
  return await client.query(
    q.CreateCollection({
      name: tableName,
    })
  );
}

export async function forceUpdatestampIndex(
  tableName: string
) {
  const client = createClient();

  const query = q.CreateIndex({
    name: `${tableName}_updates`,
    source: q.Collection(tableName),
    values: [
      {
        field: ["data", "update_date"],
        reverse: false,
      },
      {
        field: ["ref"],
      },
    ],
  });

  return await client.query(query);
}

export async function importInvoicesToGeneralLedger() {
  const invoices =
    await loadAllInvoices();
  const ledgers =
    await loadAllLedgers();
  const [
    invoicesToImport,
    invoicesToUpdate,
  ] = split(
    invoices,
    (i) =>
      !ledgers.find(
        (l) =>
          l.description ===
          `INVOICE ${i.id}`
      )
  );

  // update these invoices
  invoicesToUpdate.forEach(
    async (invoice) => {
      const ledger = ledgers.find(
        (l) =>
          l.description ===
          `INVOICE ${invoice.id}`
      );
      if (!ledger)
        throw `ledger must exist for invoice: ${invoice.id}`;

      const newLedger = {
        ...createLedger(invoice),
        id: ledger.id,
      };

      if (
        JSON.stringify([
          newLedger.date,
          newLedger.items,
        ]) !==
        JSON.stringify([
          ledger.date,
          ledger.items,
        ])
      ) {
        await saveLedger({
          ...newLedger,
          id: ledger.id,
        });
      }
    }
  );

  while (invoicesToImport.length) {
    const invoice =
      invoicesToImport.shift()!;
    const ledger =
      createLedger(invoice);
    await saveLedger(ledger);
  }
}

function createLedger(
  invoice: Invoice
) {
  const inventory = sum(
    invoice.items.map((i) => i.total)
  );
  const tax = parseFloat(
    asCurrency(inventory * TAXRATE)
  );
  const labor = invoice.labor;
  const rent =
    invoice.additional > 0
      ? invoice.additional
      : 0;
  const discount =
    invoice.additional < 0
      ? invoice.additional
      : 0;

  const totalPayments = sum(
    invoice.mops.map((i) => i.paid)
  );

  const payments = distinct(
    invoice.mops.map((i) => i.mop)
  ).map((mop) => ({
    mop,
    total: sum(
      invoice.mops
        .filter((i) => i.mop === mop)
        .map((i) => i.paid)
    ),
  }));

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
      {
        account: "AR",
        amount: -totalPayments,
        comment: "PAYMENT",
      },
    ],
  };

  payments.forEach((payment) => {
    ledger.items.push({
      account: payment.mop,
      amount: payment.total,
      comment: `PAYMENT`,
    });
  });

  ledger.items = ledger.items.filter(
    (i) => 0 != i.amount
  );
  return ledger;
}
