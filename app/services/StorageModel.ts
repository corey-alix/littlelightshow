import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  BATCH_SIZE,
  createClient,
  CURRENT_USER,
  getGlobalState,
  isOffline as globalIsOffline,
  setGlobalState,
} from "../globals.js";
import {
  reportError,
  toast,
} from "../ux/Toaster.js";
import { getDatabaseTime } from "./getDatabaseTime.js";

const statusFlags = {
  DELETED: "___DELETED___",
  UPDATED: "___UPDATED___",
};

function isMarked(item: any) {
  return Object.values(
    statusFlags
  ).some((key) => !!item[key]);
}

function clearMarkings(item: any) {
  Object.values(statusFlags).forEach(
    (key) =>
      item[key] && delete item[key]
  );
}

function clearTemporaryId(item: {
  id?: string;
}) {
  delete item.id;
}

function IsTemporaryId(itemId: string) {
  return "9" < itemId[0];
}

function markForUpsert(item: any) {
  item[statusFlags.UPDATED] =
    Date.now();
}

function isMarkedForUpsert(item: any) {
  return !!item[statusFlags.UPDATED];
}

function markForDelete(item: any) {
  item[statusFlags.DELETED] =
    Date.now();
}

function isMarkedForDelete(item: any) {
  return !!item[statusFlags.DELETED];
}

export class StorageModel<
  T extends { id?: string }
> {
  private tableName: string;
  private cache: ServiceCache<T>;

  constructor(
    private options: {
      tableName: string;
      maxAge?: number;
      offline: boolean;
    }
  ) {
    this.tableName = options.tableName;
    this.cache = new ServiceCache<T>({
      table: options.tableName,
      maxAge: options.maxAge,
    });
  }

  private isOffline() {
    return (
      this.options.offline ||
      globalIsOffline()
    );
  }

  async loadLatestData(args: {
    update_date: number;
  }) {
    const lowerBound = args.update_date;
    let upperBound =
      Number.MAX_SAFE_INTEGER;

    const client = createClient();
    const result = [] as Array<T>;
    while (true) {
      const response =
        (await client.query(
          q.Map(
            q.Paginate(
              q.Filter(
                q.Match(
                  q.Index(
                    `${this.tableName}_updates`
                  )
                ),
                q.Lambda(
                  "item",
                  q.And(
                    q.GT(
                      q.Select(
                        [0],
                        q.Var("item")
                      ),
                      lowerBound
                    ),
                    q.LT(
                      q.Select(
                        [0],
                        q.Var("item")
                      ),
                      upperBound
                    )
                  )
                )
              ),

              { size: BATCH_SIZE }
            ),
            q.Lambda(
              "item",
              q.Get(
                q.Select(
                  [1],
                  q.Var("item")
                )
              )
            )
          )
        )) as {
          data: Array<{
            ref: {
              value: { id: string };
            };
            data: T;
          }>;
        };
      response.data.forEach((item) => {
        if (isMarked(item.data)) {
          reportError(
            "Data contains client-side marking"
          );
          clearMarkings(item.data);
        }
        result.push({
          ...item.data,
          id: item.ref.value.id,
        });
      });
      if (
        response.data.length <
        BATCH_SIZE
      )
        break;
      upperBound =
        response.data[BATCH_SIZE - 1]
          .data["update_date"];
    }
    return result;
  }

  async forceUpdatestampIndex() {
    const client = createClient();

    const query = q.CreateIndex({
      name: `${this.tableName}_updates`,
      source: q.Collection(
        this.tableName
      ),
      values: [
        {
          field: [
            "data",
            "update_date",
          ],
          reverse: true,
        },
        {
          field: ["ref"],
        },
      ],
    });

    try {
      return await client.query(query);
    } catch (ex) {
      reportError(ex);
    }
  }

  async synchronize() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (this.isOffline())
      throw "cannot synchronize in offline mode";

    // get data by timestamp (descending order)
    if (
      !getGlobalState(
        `forceUpdatestampIndex_${this.tableName}`
      )
    ) {
      await this.forceUpdatestampIndex();
      setGlobalState(
        `forceUpdatestampIndex_${this.tableName}`,
        Date.now()
      );
    }
    const timeOfLastSynchronization =
      getGlobalState(
        `timeOfLastSynchronization_${this.tableName}`
      )?.value || 0;

    const timeOfCurrentSynchronization =
      await getDatabaseTime();

    const dataToImport =
      await this.loadLatestData({
        update_date:
          timeOfLastSynchronization,
      });

    // check for merge conflicts
    dataToImport.forEach((item) => {
      if (!item.id)
        throw `item must have an id`;
      const currentItem =
        this.cache.getById(item.id);
      if (
        currentItem &&
        isMarkedForUpsert(currentItem)
      ) {
        toast(
          `item changed remotely and locally: ${item.id}`
        );
      }
      if (isMarkedForDelete(item)) {
        this.cache.deleteLineItem(
          item.id
        );
      } else {
        this.cache.updateLineItem(item);
      }
    });

    const dataToExport = this.cache
      .get()
      .filter(isMarkedForDelete);

    dataToExport.forEach(
      async (item) => {
        if (!item.id)
          throw "all items must have an id";
        if (IsTemporaryId(item.id)) {
          this.cache.deleteLineItem(
            item.id
          );
        } else {
          await this.removeItem(
            item.id
          );
        }
      }
    );

    this.cache
      .get()
      .filter(isMarkedForUpsert)
      .forEach(async (item) => {
        clearMarkings(item);
        try {
          await this.upsertItem(item);
        } catch (ex) {
          markForUpsert(item);
          reportError(ex);
        }
      });

    // actually this only fetches the 25 most recently changed.
    // TODO: deleted items should be marked "deleted" instead of actually deleted
    const result =
      await this.forceFetchAllItems();

    // items delete by other users will remain in the cache...
    result.forEach((item) =>
      this.cache.updateLineItem(item)
    );

    // preserve the timestamp for a future sync run
    // notice the next sync will pull in the data we just pushed
    setGlobalState(
      `timeOfLastSynchronization_${this.tableName}`,
      timeOfCurrentSynchronization
    );

    // reset the cache expiration stamp
    this.cache.renew();
  }

  async removeItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (this.isOffline()) {
      const item =
        this.cache.getById(id);
      if (!item)
        throw "cannot remove an item that is not already there";
      markForDelete(item);
      if (IsTemporaryId(id)) {
        this.cache.deleteLineItem(id);
      } else {
        this.cache.updateLineItem(item);
      }
      return;
    }

    // online
    const client = createClient();
    await client.query(
      q.Update(
        q.Ref(
          q.Collection(this.tableName),
          id
        ),
        {
          data: {
            user: CURRENT_USER,
            update_date: Date.now(),
            delete_date: Date.now(),
          },
        }
      )
    );
    this.cache.deleteLineItem(id);
  }

  async getItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (
      this.isOffline() ||
      !this.cache.expired()
    ) {
      const result =
        this.cache.getById(id);

      if (!!result) {
        if (isMarkedForDelete(result))
          throw "item marked for deletion";
        return result;
      }
    }

    if (this.isOffline())
      throw `unable to load item: ${this.tableName} ${id}`;

    const client = createClient();
    const result = (await client.query(
      q.Get(
        q.Ref(
          q.Collection(this.tableName),
          id
        )
      )
    )) as { data: T };
    this.cache.updateLineItem(
      result.data
    );
    return result.data;
  }

  async upsertItem(data: T) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    const client = createClient();

    if (this.isOffline()) {
      data.id =
        data.id ||
        `${
          this.tableName
        }:${Date.now().toFixed()}`;
      markForUpsert(data);
      this.cache.updateLineItem(data);
      return;
    }

    if (
      !data.id ||
      (isMarkedForUpsert(data) &&
        IsTemporaryId(data.id))
    ) {
      clearMarkings(data);
      clearTemporaryId(data);
      const result =
        (await client.query(
          q.Create(
            q.Collection(
              this.tableName
            ),
            {
              data: {
                ...data,
                user: CURRENT_USER,
                create_date: Date.now(),
                update_date: Date.now(),
              },
            }
          )
        )) as {
          data: T[];
          ref: { id: string };
        };
      data.id = result.ref.id;
      this.cache.updateLineItem(data);
    } else {
      await client.query(
        q.Update(
          q.Ref(
            q.Collection(
              this.tableName
            ),
            data.id
          ),
          {
            data: {
              ...data,
              user: CURRENT_USER,
              update_date: Date.now(),
            },
          }
        )
      );
    }
    this.cache.updateLineItem(data);
  }

  async getItems() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (
      this.cache.expired() &&
      !this.isOffline()
    )
      await this.synchronize();

    return this.cache
      .get()
      .filter(
        (item) =>
          !isMarkedForDelete(item)
      );
  }

  private async forceFetchAllItems() {
    const client = createClient();
    const response =
      (await client.query(
        q.Map(
          q.Paginate(
            q.Documents(
              q.Collection(
                this.tableName
              )
            ),
            { size: BATCH_SIZE }
          ),
          q.Lambda(
            "ref",
            q.Get(q.Var("ref"))
          )
        )
      )) as {
        data: Array<{
          data: T;
          ref: any;
        }>;
      };

    const items = response.data;

    // copy ref into invoice id
    items.forEach((item) => {
      item.data.id = item.ref.value.id;
      clearMarkings(item.data);
    });

    const result = items.map(
      (i) => i.data
    );
    return result;
  }
}
