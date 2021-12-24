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
  tableName: string;
  update_date: number;
}) {
  const client = createClient();
  let response = await client.query(
    q.Map(
      q.Paginate(
        q.Filter(
          q.Match(
            q.Index(
              `${args.tableName}_updates`
            )
          ),
          q.Lambda(
            "item",
            q.And(
              q.ContainsField(
                "update_date",
                q.Select(
                  ["data"],
                  q.Var("item")
                )
              ),
              q.GT(
                q.Select(
                  [
                    "data",
                    "update_date",
                  ],
                  q.Var("item")
                ),
                args.update_date
              )
            )
          )
        ),
        { size: 10 }
      ),
      q.Lambda(
        "item",
        q.Get(
          q.Select([1], q.Var("item"))
        )
      )
    )
  );
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
      values: [
        {
          field: [
            "data",
            "update_date",
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

  if (false) {
    const response =
      await updateItemsWithoutUpdateInfo(
        {
          tableName,
        }
      );

    localStorage.setItem(
      "test1.updateItemsWithoutCreateInfo",
      JSON.stringify(response)
    );
    return;
  }

  if (
    false &&
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

  if (
    true ||
    !localStorage.getItem(
      "test1.loadLatestData"
    )
  ) {
    const response =
      await loadLatestData({
        tableName,
        update_date: 1639791009133,
      });

    localStorage.setItem(
      "test1.loadLatestData",
      JSON.stringify(response)
    );
    return;
  }

  if (
    false &&
    !localStorage.getItem(
      "test1.injectDataWithTimestamp"
    )
  ) {
    const response =
      await injectDataWithTimestamp({
        tableName,
        data: {
          value: "test1",
        },
      });

    localStorage.setItem(
      "test1.injectDataWithTimestamp",
      JSON.stringify(response)
    );
  }
}
async function updateItemsWithoutUpdateInfo(args: {
  tableName: string;
}) {
  const client = createClient();

  const getItems = q.Map(
    q.Paginate(
      q.Documents(
        q.Collection(args.tableName)
      ),
      { size: 100 }
    ),
    q.Lambda("x", q.Get(q.Var("x")))
  );

  const filterItems = q.Filter(
    getItems,
    q.Lambda(
      "x",
      q.And(
        q.ContainsField(
          "create_date",
          q.Select(["data"], q.Var("x"))
        ),
        q.Not(
          q.ContainsField(
            "update_date",
            q.Select(
              ["data"],
              q.Var("x")
            )
          )
        )
      )
    )
  );

  const deleteItems = q.Map(
    filterItems,
    q.Lambda(
      "x",
      q.Delete(
        q.Select(["ref"], q.Var("x"))
      )
    )
  );

  const updateItems = q.Map(
    filterItems,
    q.Lambda(
      "x",
      q.Update(
        q.Select(["ref"], q.Var("x")),
        {
          data: {
            update_date: q.Select(
              ["data", "create_date"],
              q.Var("x")
            ),
          },
        }
      )
    )
  );

  const itemsWithNoUpdateInfo =
    await client.query(updateItems);

  return itemsWithNoUpdateInfo;
}
