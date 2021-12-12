import faunadb from "faunadb";
import {
  domain,
  FAUNADB_SERVER_SECRET,
  FAUNADB_ADMIN_SECRET,
} from "../globals.js";

const { query, Client } = faunadb;
const q = query;

export async function save(invoice) {
  const client = new faunadb.Client({ secret: FAUNADB_SERVER_SECRET, domain });

  const result = await client.query(
    q.Create(q.Collection("Todos"), {
      data: invoice,
    })
  );

  return result;
}
