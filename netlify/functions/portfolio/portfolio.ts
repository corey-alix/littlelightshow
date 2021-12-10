import { Handler } from "@netlify/functions";
import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: (process.env.FAUNADB_SECRET ||
    process.env.FAUNADB_SERVER_SECRET) as string,
  domain: "db.us.fauna.com",
});

export const handler: Handler = async (event, context) => {
  const customers = await client.query(q.Create(q.Ref("customers")));

  return {
    statusCode: 200,
    body: JSON.stringify(customers),
  };
};
