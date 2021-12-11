import faunadb from "faunadb";
import { FAUNADB_SERVER_SECRET } from "../app/globals.js";
const { query, Client } = faunadb;
const q = query;

const client = new Client({
  secret: FAUNADB_SERVER_SECRET,
  domain: "db.us.fauna.com",
});

(async () => {
  let result = await client.query(
    q.If(
      q.Exists(q.Collection("Todos")),
      null,
      q.CreateCollection({ name: "Todos" })
    )
  );
  console.log(result);

  result = await client.query(
    q.Create(q.Collection("Todos"), {
      data: {
        description: "100CT WHITE WITH WHITE WIRE",
        code: "100CT WT WHITE",
        length: 20,
        color: "white",
        wire: "white",
      },
    })
  );
  console.log(result);

  result = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Todos"))),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );
  console.log(result);

  const refs = result.data.map((item) => {
    const { ref, data } = item;
    console.log(JSON.stringify(data));
    return ref;
  });
  console.log(refs);

  result = await client.query(q.Delete(refs[0]));
  console.log(result);
})();
