import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  BATCH_SIZE,
  createClient,
  CURRENT_USER,
  isOffline as globalIsOffline,
} from "../globals.js";

const statusFlags = {
  DELETED: "___DELETED___",
  UPDATED: "___UPDATED___",
};

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

  async synchronize() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (this.isOffline())
      throw "cannot synchronize in offline mode";

    this.cache
      .get()
      .filter(isMarkedForDelete)
      .forEach(async (item) => {
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
      });

    this.cache
      .get()
      .filter(isMarkedForUpsert)
      .forEach(async (item) => {
        await this.upsertItem(item);
      });

    const result =
      await this.forceFetchAllItems();
    this.cache.set(result);
    return result;
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
      q.Delete(
        q.Ref(
          q.Collection(this.tableName),
          id
        )
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
      this.isOffline() ||
      !this.cache.expired()
    )
      return this.cache
        .get()
        .filter(
          (item) =>
            !isMarkedForDelete(item)
        );

    // save offline changes before fetching new items
    return await this.synchronize();
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
