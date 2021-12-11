import { Handler } from "@netlify/functions";
import faunadb from "faunadb";

import {
  domain,
  FAUNADB_SERVER_SECRET as secret,
} from "../../../app/globals.js";

const q = faunadb.query;
const client = new faunadb.Client({
  secret,
  domain,
});

export const handler = async (event, context) => {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Todos"))),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (ex) {
    return { statusCode: 200, body: JSON.stringify(ex) };
  }
};
