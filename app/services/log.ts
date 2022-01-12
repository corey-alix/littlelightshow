import { StorageModel } from "./StorageModel.js";
const TABLE_NAME = "log";

export interface Log {
  id?: string;
  message: string;
}

export class LogModel extends StorageModel<Log> {}

export const logStore = new LogModel({
  tableName: TABLE_NAME,
  offline: false,
});
