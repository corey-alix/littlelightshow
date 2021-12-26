import { query as q } from "faunadb";
import { sum } from "../fun/sum.js";
import {
  createClient,
  TAXRATE,
} from "../globals.js";
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
  const tax = inventory * TAXRATE;
  const labor = invoice.labor;
  const rent =
    invoice.additional > 0
      ? invoice.additional
      : 0;
  const discount =
    invoice.additional < 0
      ? invoice.additional
      : 0;
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
  ledger.items = ledger.items.filter(
    (i) => 0 != i.amount
  );
  return ledger;
}

export async function copyInvoicesFromTodo() {
  const client = createClient();

  const result = (await client.query(
    q.Map(
      q.Paginate(
        q.Documents(
          q.Collection("Todos")
        ),
        { size: 25 }
      ),
      q.Lambda(
        "ref",
        q.Get(q.Var("ref"))
      )
    )
  )) as {
    data: Array<{ data: Invoice }>;
  };

  const invoices = result.data.map(
    (v) => v.data
  );

  invoices.forEach(
    async (invoice, index) => {
      console.log(
        "copying invoice",
        invoice
      );
      const priorKey = invoice.id;
      const id = 1001 + index;
      const result = await client.query(
        q.Create(
          q.Collection("invoices"),
          {
            data: {
              ...invoice,
              priorKey,
              id,
            },
          }
        )
      );
    }
  );
}

export async function copyGeneralLedgerEntriesFromTodo() {
  const client = createClient();

  const result = (await client.query(
    q.Map(
      q.Paginate(
        q.Documents(
          q.Collection("Todos")
        )
      ),
      q.Lambda(
        "ref",
        q.Get(q.Var("ref"))
      )
    )
  )) as {
    data: Array<{ data: Ledger }>;
  };

  const records = result.data
    .map((v) => v.data)
    .filter(
      (v) =>
        v.items.length &&
        !!v.items[0].account
    );

  records.forEach(async (record) => {
    console.log("ledger", { record });
    await client.query(
      q.Create(
        q.Collection("general_ledger"),
        {
          data: record,
        }
      )
    );
  });
}
