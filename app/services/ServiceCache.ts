import { isDebug } from "../globals";
import { getGlobalState } from "../fun/globalState";
import { ticksInSeconds } from "../fun/ticksInSeconds";

const MAX_AGE =
  getGlobalState<number>(
    "CACHE_MAX_AGE"
  ) || 0;

export class ServiceCache<
  T extends { id?: string }
> {
  lastWriteTime() {
    return this.lastWrite;
  }

  renew() {
    this.lastWrite = Date.now();
    this.save();
  }

  private data: Array<T>;
  private lastWrite: number;
  private readonly table: string;

  constructor(
    private options: {
      table: string;
      maxAge?: number;
    }
  ) {
    options.maxAge = Math.max(
      options.maxAge || MAX_AGE,
      MAX_AGE
    );
    this.table = options.table;
    const raw = localStorage.getItem(
      `table_${this.table}`
    );
    if (!raw) {
      this.data = [];
      this.lastWrite = 0;
    } else {
      const info = JSON.parse(raw) as {
        lastWrite: number;
        data: T[];
      };

      this.lastWrite = info.lastWrite;
      this.data = info.data;
    }
  }

  private save() {
    localStorage.setItem(
      `table_${this.table}`,
      JSON.stringify({
        lastWrite: this.lastWrite,
        data: this.data,
      })
    );
  }

  deleteLineItem(id: string) {
    const index = this.data.findIndex(
      (i) => i.id === id
    );
    if (-1 < index)
      this.data.splice(index, 1);
    this.save();
  }

  updateLineItem(lineItem: T) {
    const index = this.data.findIndex(
      (i) => i.id === lineItem.id
    );
    if (-1 < index) {
      this.data[index] = lineItem;
    } else {
      this.data.push(lineItem);
    }
    this.save();
  }

  expired() {
    const age = ticksInSeconds(
      Date.now() - this.lastWrite
    );
    return this.options.maxAge! < age;
  }

  getById(id: string) {
    return this.data.find(
      (item) => item.id === id
    );
  }

  get() {
    return this.data;
  }
}
