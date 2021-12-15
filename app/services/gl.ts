import { query as q } from "faunadb";
import { createClient, CURRENT_USER } from "../globals.js";

const LEDGER_TABLE = "Todos";

export interface LedgerItem {
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
