import { query as q } from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";

const LEDGER_TABLE = "Todos";

export interface LedgerItem {
  comment: string;
  date: number;
  account: string;
  amount: number;
}

export interface Ledger {
  items: Array<LedgerItem>;
}

export async function save(ledger: Ledger) {
  if (!CURRENT_USER) throw "user must be signed in";

  const client = createClient();

  const result = (await client.query(
    q.Create(q.Collection(LEDGER_TABLE), {
      data: { ...ledger, user: CURRENT_USER, create_date: Date.now() },
    })
  )) as { data: any; ref: any };
}

export async function ledgers() {
  if (!CURRENT_USER) throw "user must be signed in";

  const client = createClient();

  const result: any = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection(LEDGER_TABLE)), { size: 100 }),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );

  const ledgers = result.data as Array<{
    data: Ledger & { id: any };
    ref: any;
  }>;
  // copy ref into invoice id
  ledgers.forEach((ledger) => {
    ledger.data.id = ledger.ref.value.id;
  });
  return ledgers
    .filter(
      (ledger) =>
        ledger.data.items &&
        ledger.data.items[0] &&
        ledger.data.items[0].account
    )
    .map((ledger) => ledger.data);
}
