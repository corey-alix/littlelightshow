import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  createClient,
  CURRENT_USER,
  isOffline,
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

  constructor(options: {
    tableName: string;
  }) {
    this.tableName = options.tableName;
    this.cache = new ServiceCache<T>(
      this.tableName
    );
  }

  async synchronize() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (isOffline())
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
        debugger;
        clearMarkings(item);
        await this.upsertItem(item);
      });
  }

  async removeItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (isOffline()) {
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
      isOffline() ||
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

    if (isOffline())
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

    if (isOffline()) {
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
      isOffline() ||
      !this.cache.expired()
    )
      return this.cache
        .get()
        .filter(
          (item) =>
            !isMarkedForDelete(item)
        );

    const client = createClient();

    // save offline changes before fetching new items
    await this.synchronize();

    const response =
      (await client.query(
        q.Map(
          q.Paginate(
            q.Documents(
              q.Collection(
                this.tableName
              )
            ),
            { size: 100 }
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
    this.cache.set(result);
    return result;
  }
}