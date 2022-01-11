import { asDateString } from "../fun/asDateString";
import { setGlobalState } from "../fun/globalState";
import { gotoUrl } from "../fun/gotoUrl";
import { on, trigger } from "../fun/on";
import { init as systemInit } from "../index";
import { routes } from "../router";
import {
  Todo,
  todoModel,
} from "../services/todo";
import {
  reportError,
  toast,
} from "../ux/toasterWriter";
import { getQueryParameter } from "../fun/getQueryParameter";
import { create as createTodoGrid } from "./grid-template.js";
import {
  setFormValue,
  getFormValue,
} from "../fun/setFormValue";
import { stripAccessControlItems } from "../fun/hookupTriggers";

export async function init(
  todoWidget: HTMLElement
) {
  await systemInit();

  const formDom =
    todoWidget.querySelector(
      "form"
    ) as HTMLFormElement;
  if (!formDom)
    throw "form not found in todo widget";

  const todoItemsPlaceholder =
    todoWidget.querySelector(
      ".todo-items.placeholder"
    ) as HTMLElement;

  if (!todoItemsPlaceholder)
    throw "todo-items placeholder not found in todo widget";

  const id = getQueryParameter("id");
  const activeTodoItem =
    id && (await todoModel.getItem(id));

  if (activeTodoItem) {
    setFormValue(
      formDom,
      "todo-comment",
      activeTodoItem.comment || ""
    );
    setFormValue(
      formDom,
      "todo-date",
      asDateString(
        new Date(activeTodoItem.date)
      )
    );
  }

  const render = async () => {
    if (todoItemsPlaceholder) {
      const todoItems = (
        await todoModel.getItems()
      ).sortBy({ date: "number" });
      const todoItemsGrid =
        createTodoGrid(todoItems);
      stripAccessControlItems(
        todoItemsGrid
      );
      todoItemsPlaceholder.innerText =
        "";
      todoItemsPlaceholder.appendChild(
        todoItemsGrid
      );
    }
  };

  on(todoWidget, "delete", async () => {
    if (!id) {
      trigger(todoWidget, "reset");
      return;
    }
    try {
      await todoModel.removeItem(id);
      trigger(todoWidget, "reset");
    } catch (ex) {
      reportError(ex);
    }
  });

  on(todoWidget, "reset", () => {
    setGlobalState(
      "todo-date",
      asDateString(new Date())
    );
    setGlobalState("todo-comment", "");
    gotoUrl(routes.createTodo());
  });

  on(todoWidget, "submit", async () => {
    const date = getFormValue(
      formDom,
      "todo-date"
    );

    const comment = getFormValue(
      formDom,
      "todo-comment"
    );

    const item = {
      id,
      date: new Date(date).valueOf(),
      comment,
    } as Todo;

    await todoModel.upsertItem(item);

    toast("Saved");
    gotoUrl(routes.todo(item.id!));
  });

  await render();
}
