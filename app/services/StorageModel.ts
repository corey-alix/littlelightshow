import type { FaunaException } from "../admin/FaunaException";

import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  globals,
  createClient,
  isOffline as globalIsOffline,
} from "../globals.js";
import {
  getGlobalState,
  setGlobalState,
} from "../fun/globalState";
import { toast } from "../ux/toasterWriter";
import { getDatabaseTime } from "./getDatabaseTime.js";
import {
  forceUpdatestampIndex,
  forceUpdatestampTable,
} from "./forceUpdatestampTable";

const { BATCH_SIZE, CURRENT_USER } =
  globals;

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
  protected cache: ServiceCache<T>;

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

  // return items [after_date, before_date)
  async loadLatestData(args: {
    lowerBound: number;
    upperBound: number;
  }) {
    const size = BATCH_SIZE;

    const { upperBound, lowerBound } =
      args;

    let after = null;
    const client = createClient();
    const result = [] as Array<
      T & SynchronizationAttributes
    >;

    // only get one batch, advancing the sync time to date of last fetched record
    // so if BATCH_SIZE items are fetched then the last item (and possibly more) will
    // be fetched again, so BATCH_SIZE should be large.
    let maximum_query_count = 1;
    while (maximum_query_count--) {
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
                    q.LTE(
                      lowerBound,
                      q.Select(
                        [0],
                        q.Var("item")
                      )
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
              after
                ? {
                    size,
                    after,
                  }
                : { size }
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
          after: any;
          data: Array<{
            ref: {
              value: { id: string };
            };
            data: T &
              SynchronizationAttributes;
          }>;
        };

      const dataToImport =
        response.data.map((item) => ({
          ...item.data,
          id: item.ref.value.id,
        }));

      result.push(...dataToImport);

      // capture progress
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
          // item pushed to server has now been pulled back
        }
        if (!!item.delete_date) {
          this.cache.deleteLineItem(
            item.id
          );
        } else {
          this.cache.updateLineItem(
            item
          );
        }
      });

      // capture progress
      this.cache.renew();
      dataToImport.length &&
        setFutureSyncTime(
          this.tableName,
          dataToImport[
            dataToImport.length - 1
          ].update_date
        );

      after = response.after;
      if (!after) {
        // preserve the timestamp for a future sync run
        // notice the next sync will pull in the data we just pushed
        setFutureSyncTime(
          this.tableName,
          upperBound
        );
        break;
      }
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

    // must capture before importing
    // to prevent exporting what was imported
    const dataToExport = this.cache
      .get()
      .filter(
        (item) =>
          item.update_date &&
          item.update_date >
            priorSyncTime
      );

    await retryOnInvalidRef(
      this.tableName,
      async () => {
        await this.loadLatestData({
          lowerBound: priorSyncTime,
          upperBound: currentSyncTime,
        });
      }
    );

    // apply local deletes
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

    // apply local updates
    dataToExport.forEach(
      async (item) => {
        await this.upsertItem(item);
      }
    );

    // reset the cache expiration stamp
    this.cache.renew();
  }

  async removeItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (isOfflineId(id)) {
      this.cache.deleteLineItem(id);
      return;
    }

    if (this.isOffline()) {
      const item =
        this.cache.getById(id);
      if (!item)
        throw "cannot remove an item that is not already there";
      item.delete_date = Date.now();
      this.cache.updateLineItem(item);
      return;
    }

    // online
    const client = createClient();
    await client.query(
      q.Replace(
        q.Ref(
          q.Collection(this.tableName),
          id
        ),
        {
          data: {
            id: id,
            user: CURRENT_USER,
            update_date: q.ToMillis(
              q.Now()
            ),
            delete_date: q.ToMillis(
              q.Now()
            ),
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
    } else {
      if (!!this.cache.getById(id)) {
        this.cache.renew();
      } else {
        if (!this.isOffline())
          await this.synchronize();
      }
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

    // copy into local cached temporarily
    data.id =
      data.id ||
      `${
        this.tableName
      }:${Date.now().toFixed()}`;
    data.update_date = Date.now();
    this.cache.updateLineItem(data);

    // if offline then that is all we can do
    if (this.isOffline()) {
      return;
    }

    // remember the offlineId so the proper cache item can be updated
    const offlineId =
      data.id && isOfflineId(data.id)
        ? data.id
        : "";

    // clear the offline id so it is not sent to the server
    if (offlineId) data.id = "";

    if (!data.id) {
      await retryOnInvalidRef(
        this.tableName,
        async () => {
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
                    create_date:
                      q.ToMillis(
                        q.Now()
                      ),
                    update_date:
                      q.ToMillis(
                        q.Now()
                      ),
                  },
                }
              )
            )) as {
              data: T[];
              ref: {
                value: { id: string };
              };
            };

          // replace the temporary item with the real one
          {
            offlineId &&
              this.cache.deleteLineItem(
                offlineId
              );
            data.id =
              result.ref.value.id;
            this.cache.updateLineItem(
              data
            );
          }
        }
      );
      return;
    }

    // update an existing server-side collection
    await client.query(
      q.Replace(
        q.Ref(
          q.Collection(this.tableName),
          data.id
        ),
        {
          data: {
            ...data,
            user: CURRENT_USER,
            update_date: q.ToMillis(
              q.Now()
            ),
          },
        }
      )
    );
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
    ) {
      await this.synchronize();
    } else {
      this.cache.renew();
    }

    return this.cache
      .get()
      .filter(
        (item) => !item.delete_date
      );
  }
}

function isOfflineId(itemId?: string) {
  return !!itemId && "9" < itemId[0];
}

function getPriorSyncTime(
  tableName: string
) {
  return (
    getGlobalState<number>(
      `timeOfLastSynchronization_${tableName}`
    ) || 0
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

async function retryOnInvalidRef(
  tableName: string,
  op: () => Promise<void>
) {
  try {
    await op();
  } catch (ex) {
    // if "invalid ref" then create the table and try again
    const error = ex as FaunaException;
    if (error.message !== "invalid ref")
      throw ex;
    try {
      await forceUpdatestampTable(
        tableName
      );
    } catch (ex) {
      if (
        (ex as FaunaException)
          .message !==
        "instance already exists"
      )
        throw ex;
    }
    try {
      await forceUpdatestampIndex(
        tableName
      );
    } catch (ex) {
      if (
        (ex as FaunaException)
          .message !==
        "instance already exists"
      )
        throw ex;
    }
    await op();
  }
}
