import { query as q } from "faunadb";
import { createClient } from "../globals.js";

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
