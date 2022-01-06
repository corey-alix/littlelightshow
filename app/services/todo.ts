import { StorageModel } from "./StorageModel";

const TABLE_NAME = "todo";

export interface Todo {
  id?: string;
  date: number;
  comment?: string;
}

export class TodoModel extends StorageModel<Todo> {}

export const todoModel = new TodoModel({
  tableName: TABLE_NAME,
  offline: true,
});
