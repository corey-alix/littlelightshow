import { FAUNADB_SERVER_SECRET, domain, CONTEXT } from "../app/globals.js";
import { tables } from "../app/meta/tables.js";
import faunadb from "faunadb";

const q = faunadb.query;

export function createDatabase() {
  if (CONTEXT !== "dev") return;

  const client = new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET,
    domain: domain,
  });

  const tableNames = Object.keys(tables);
  tableNames.forEach(async (tableName) => {
    const response = await client.query(
      q.Create(q.Ref("classes"), { name: tableName })
    );
  });
}
