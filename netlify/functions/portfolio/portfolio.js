import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

export const handler = async (event, context) => {
  const customers = await client.query(q.Create(q.Ref("customers")));

  return {
    statusCode: 200,
    body: JSON.stringify(customers),
  };
};
