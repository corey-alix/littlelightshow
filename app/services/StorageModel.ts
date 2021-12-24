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

interface SynchronizationAttributes {
  id?: string;
  create_date: number;
  update_date: number;
  delete_date?: number;
}

export class StorageModel<
  T extends Partial<SynchronizationAttributes>
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
    this.cache = new ServiceCache<
      T & SynchronizationAttributes
    >({
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
    after_date: number;
    before_date: number;
  }) {
    let upperBound = args.before_date;
    const lowerBound = args.after_date;

    const client = createClient();
    const result = [] as Array<
      T & SynchronizationAttributes
    >;
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
            data: T &
              SynchronizationAttributes;
          }>;
        };
      response.data.forEach((item) => {
        if (!!item.data.delete_date) {
          reportError(
            "Data contains client-side marking"
          );
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
          .data.update_date;
    }
    return result;
  }

  async synchronize() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (this.isOffline())
      throw "cannot synchronize in offline mode";

    const priorSyncTime =
      getPriorSyncTime(this.tableName);

    const currentSyncTime =
      await getDatabaseTime();

    const dataToImport =
      await this.loadLatestData({
        after_date: priorSyncTime,
        before_date: currentSyncTime,
      });

    // check for merge conflicts
    dataToImport.forEach((item) => {
      if (!item.id)
        throw `item must have an id`;
      const currentItem =
        this.cache.getById(item.id);
      if (
        currentItem &&
        this.isUpdated(currentItem)
      ) {
        toast(
          `item changed remotely and locally: ${item.id}`
        );
      }
      if (!!item.delete_date) {
        debugger;
        this.cache.deleteLineItem(
          item.id
        );
      } else {
        this.cache.updateLineItem(item);
      }
    });

    this.cache
      .get()
      .filter(
        (item) => !!item.delete_date
      )
      .forEach(async (item) => {
        if (!item.id)
          throw "all items must have an id";
        if (isOfflineId(item.id)) {
          this.cache.deleteLineItem(
            item.id
          );
        } else {
          await this.removeItem(
            item.id
          );
        }
      });

    this.cache
      .get()
      .filter(
        (item) =>
          item.update_date &&
          item.update_date >
            priorSyncTime
      )
      .forEach(async (item) => {
        await this.upsertItem(item);
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
    setFutureSyncTime(
      this.tableName,
      currentSyncTime
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
      if (isOfflineId(id)) {
        this.cache.deleteLineItem(id);
      } else {
        item.delete_date = Date.now();
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
      !this.isOffline() &&
      this.cache.expired()
    ) {
      await this.synchronize();
    }

    const result =
      this.cache.getById(id);

    if (!result)
      throw `unable to load item: ${this.tableName} ${id}`;

    if (!!result.delete_date)
      throw "item marked for deletion";
    return result;
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
      data.update_date = Date.now();
      this.cache.updateLineItem(data);
      return;
    }

    debugger;
    if (isOfflineId(data.id)) {
      this.cache.deleteLineItem(
        data.id!
      );
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
          ref: {
            value: { id: string };
          };
        };
      data.id = result.ref.value.id;
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

  private isUpdated(data: T) {
    return (
      (data.update_date || 0) >
      this.cache.lastWriteTime()
    );
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
        (item) => !item.delete_date
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
          data: T &
            SynchronizationAttributes;
          ref: any;
        }>;
      };

    const items = response.data;

    // copy ref into invoice id
    items.forEach((item) => {
      item.data.id = item.ref.value.id;
    });

    const result = items.map(
      (i) => i.data
    );
    return result;
  }
}

function isOfflineId(itemId?: string) {
  return !!itemId && "9" < itemId[0];
}

function getPriorSyncTime(
  tableName: string
) {
  return (
    getGlobalState(
      `timeOfLastSynchronization_${tableName}`
    )?.value || 0
  );
}

function setFutureSyncTime(
  tableName: string,
  syncTime: number
) {
  // preserve the timestamp for a future sync run
  // notice the next sync will pull in the data we just pushed
  setGlobalState(
    `timeOfLastSynchronization_${tableName}`,
    syncTime
  );
}
