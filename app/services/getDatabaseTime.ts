import { query as q } from "faunadb";
import { createClient } from "../globals";

export async function getDatabaseTime() {
  const client = createClient();
  const response = (await client.query(
    q.Now()
  )) as { value: string };

  return new Date(
    response.value
  ).valueOf();
}
