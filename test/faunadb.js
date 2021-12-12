import faunadb from "faunadb";
import {
  domain,
  FAUNADB_SERVER_SECRET,
  FAUNADB_ADMIN_SECRET,
} from "../app/globals.js";
import { tables } from "../app/meta/tables.js";

const { query, Client } = faunadb;
const q = query;

function isNetlifyBuildContext() {
  return !!process.env.DEPLOY_PRIME_URL;
}

export async function createDatabase() {
  if (isNetlifyBuildContext()) return;

  const adminClient = new faunadb.Client({
    secret: FAUNADB_ADMIN_SECRET,
    domain,
  });

  // create the database
  let response = await adminClient.query(
    q.CreateDatabase({ name: "littlelightshow" })
  );
  console.log({ response });

  // generate an access key for the database
  response = adminClient.query(
    q.CreateKey({
      database: q.Database("littlelightshow"),
      role: "server",
    })
  );

  // store the secret
  const FAUNADB_SERVER_SECRET = response.secret;
  console.log({ response });
  localStorage.setItem("littlelightshow", {
    FAUNADB_SERVER_SECRET,
  });

  const client = new faunadb.Client({ secret: FAUNADB_SERVER_SECRET, domain });
  const tableNames = Object.keys(tables);
  console.log({ tableNames });
  while (tableNames.length) {
    const tableName = tableNames.shift();
    console.log(`creating table ${tableName}`);
    try {
      await client.query(q.Create(q.Ref("classes"), { name: tableName }));
    } catch (ex) {
      console.error(ex);
    }
  }
}

await createDatabase();

async function playground() {
  const client = new Client({
    secret: FAUNADB_SERVER_SECRET,
    domain: domain,
  });

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
}
//playground();
