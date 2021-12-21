import { isDebug } from "../globals";
import { ticksInSeconds } from "../fun/ticksInSeconds";

const maxAge = isDebug
  ? 7 * 24 * 3600
  : 60;

export class ServiceCache<
  T extends { id?: string }
> {
  private data: Array<T>;
  private lastWrite: number;

  constructor(private table: string) {
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
    return maxAge < age;
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
