import { isDebug } from "../globals";
import { ticksInSeconds } from "./gl";

const maxAge = isDebug ? 3600 : 60;

export class Cache<T> {
  deleteLineItem(id: string) {
    const data = this.get()
      ?.data as any as Array<{
      id: string;
    }>;
    const index = data.findIndex(
      (i) => i.id === id
    );
    data.splice(index, 1);
    this.set(<any>data);
  }

  updateLineItem(lineItem: any) {
    const data = this.get()
      ?.data as any as Array<{
      id: string;
    }>;
    const index = data.findIndex(
      (i) => i.id === lineItem.id
    );
    data.push(lineItem);
    this.set(<any>data);
  }

  constructor(public table: string) {}

  expired() {
    const data = this.get();
    if (!data) return true;
    const age = ticksInSeconds(
      Date.now() - data.lastWrite
    );
    return maxAge < age;
  }

  get() {
    const raw = localStorage.getItem(
      `table_${this.table}`
    );
    if (!raw) return null;
    return JSON.parse(raw) as {
      lastWrite: number;
      data: T;
    };
  }

  set(data: T) {
    localStorage.setItem(
      `table_${this.table}`,
      JSON.stringify({
        lastWrite: Date.now(),
        data,
      })
    );
  }
}
