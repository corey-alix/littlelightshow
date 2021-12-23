import { createClient } from "../app/globals.js";
import faunadb from "faunadb";

const q = faunadb.query;

interface FaunaException {
  name: string;
  message: string;
  description: string;
  requestResult: any;
}

function reportError(
  faunaError: FaunaException
) {
  console.log(faunaError);
}

async function loadLatestData(args: {
  tableName;
}) {
  const client = createClient();
  let response = await client.query(
    q.Paginate(
      q.Match(
        q.Index(
          `${args.tableName}_updates`
        )
      )
    )
  );
  debugger;
  return response;
}

async function createUpdateStampIndexOnTable(args: {
  tableName: string;
}) {
  const client = createClient();
  let response = await client.query(
    q.CreateIndex({
      name: `${args.tableName}_updates`,
      source: q.Collection(
        args.tableName
      ),
      unique: false,
      serialized: true,
      terms: [],
      values: [
        {
          field: [
            "data",
            "updatestamp",
          ],
          reverse: true,
        },
        { field: ["ref"] },
      ],
    })
  );
  console.log({ args, response });
  return response;
}

async function injectDataWithTimestamp(args: {
  data: any;
  tableName: string;
}) {
  const client = createClient();
  const response = await client.query(
    q.Create(
      q.Collection(args.tableName),
      {
        data: {
          ...args.data,
          createstamp: Date.now,
          updatestamp: Date.now,
        },
      }
    )
  );
  return response;
}

export function init() {
  const runButton =
    document.querySelector(
      "#run"
    ) as HTMLButtonElement;

  runButton.addEventListener(
    "click",
    () => {
      run();
    }
  );
}

async function run() {
  const tableName = "Todos";

  try {
    if (
      !localStorage.getItem(
        "test1.createUpdateStampIndexOnTable"
      )
    ) {
      const response =
        await createUpdateStampIndexOnTable(
          {
            tableName,
          }
        );

      localStorage.setItem(
        "test1.createUpdateStampIndexOnTable",
        JSON.stringify(response)
      );
    }

    {
      const response =
        await loadLatestData({
          tableName,
        });
      localStorage.setItem(
        "test1.loadLatestData",
        JSON.stringify(response)
      );
    }
    if (
      !localStorage.getItem(
        "test1.injectDataWithTimestamp"
      )
    ) {
      debugger;
      const response =
        await injectDataWithTimestamp({
          tableName,
          data: {
            value: "test1",
          },
        });

      debugger;

      localStorage.setItem(
        "test1.injectDataWithTimestamp",
        JSON.stringify(response)
      );
    }
  } catch (ex) {
    reportError(ex as FaunaException);
  }
}
