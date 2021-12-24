import { isDebug } from "../globals";
import { ticksInSeconds } from "../fun/ticksInSeconds";

// in seconds
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * 60;

const MAX_AGE = isDebug
  ? 4 * SECONDS_PER_HOUR
  : 5 * SECONDS_PER_MINUTE;

export class ServiceCache<
  T extends { id?: string }
> {
  clear() {
    this.lastWrite = 0;
    this.save();
  }

  renew() {
    this.lastWrite = Date.now();
    this.save();
    return this.lastWrite;
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
    options.maxAge =
      options.maxAge || MAX_AGE;
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
    this.data.splice(index, 1);
    this.save();
  }

  updateLineItem(lineItem: T) {
    const index = this.data.findIndex(
      (i) => i.id === lineItem.id
    );
    if (-1 < index) {
      this.data.splice(index, 1);
    }
    this.data.push(lineItem);
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

  // reset the cache
  set(data: T[]) {
    this.lastWrite = Date.now();
    this.data = data;
    this.save();
  }
}
