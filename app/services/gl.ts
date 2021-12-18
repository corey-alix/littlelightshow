import { query as q } from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";

const LEDGER_TABLE = "general_ledger";

export interface LedgerItem {
  comment: string;
  account: string;
  amount: number;
}

export interface Ledger {
  date: number;
  description?: string;
  items: Array<LedgerItem>;
}

export async function deleteLedger(id: string) {
  const client = createClient();
  const result = await client.query(
    q.Delete(q.Ref(q.Collection(LEDGER_TABLE), id))
  );
  return result;
}

export async function save(ledger: Ledger & { id?: string }) {
  if (!CURRENT_USER) throw "user must be signed in";

  const client = createClient();

  if (!ledger.id) {
    const result = (await client.query(
      q.Create(q.Collection(LEDGER_TABLE), {
        data: { ...ledger, user: CURRENT_USER, create_date: Date.now() },
      })
    )) as { data: any; ref: any };
  } else {
    const result = (await client.query(
      q.Update(q.Ref(q.Collection(LEDGER_TABLE), ledger.id), {
        data: { ...ledger, user: CURRENT_USER, update_date: Date.now() },
      })
    )) as { data: any; ref: any };
  }
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
  // copy ref into ledger id
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
