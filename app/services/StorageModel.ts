import { ServiceCache } from "./ServiceCache.js";
import { query as q } from "faunadb";
import {
  createClient,
  CURRENT_USER,
  isOffline,
} from "../globals.js";

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

  async removeItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (!isOffline) {
      const client = createClient();
      await client.query(
        q.Delete(
          q.Ref(
            q.Collection(
              this.tableName
            ),
            id
          )
        )
      );
    }
    this.cache.deleteLineItem(id);
  }

  async getItem(id: string) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (
      isOffline ||
      !this.cache.expired()
    ) {
      const result =
        this.cache.getById(id);
      if (result) return result;
    }

    if (!isOffline) {
      const client = createClient();
      const result =
        (await client.query(
          q.Get(
            q.Ref(
              q.Collection(
                this.tableName
              ),
              id
            )
          )
        )) as { data: T };
      return result.data;
    }

    throw `unable to load item: ${this.tableName} ${id}`;
  }

  async upsertItem(data: T) {
    if (!CURRENT_USER)
      throw "user must be signed in";

    const client = createClient();

    if (!data.id) {
      if (!isOffline) {
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
                    Date.now(),
                },
              }
            )
          )) as {
            data: T[];
            ref: { id: string };
          };
        data.id = result.ref.id;
      } else {
        data.id =
          "invoice_" +
          Date.now().toFixed();
      }
    } else {
      if (!isOffline) {
        const result =
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
                  update_date:
                    Date.now(),
                },
              }
            )
          );
      }
    }
    this.cache.updateLineItem(data);
  }

  async getItems() {
    if (!CURRENT_USER)
      throw "user must be signed in";

    if (
      isOffline ||
      !this.cache.expired()
    )
      return this.cache.get();

    const client = createClient();

    const result: any =
      await client.query(
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
      );

    const items = result.data as Array<{
      data: T;
      ref: any;
    }>;

    // copy ref into invoice id
    items.forEach((item) => {
      item.data.id = item.ref.value.id;
    });

    return items.map((i) => i.data);
  }
}
