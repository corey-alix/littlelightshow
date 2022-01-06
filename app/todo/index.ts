import { asDateString } from "../fun/asDateString";
import { setGlobalState } from "../fun/globalState";
import { gotoUrl } from "../fun/gotoUrl";
import { on, trigger } from "../fun/on";
import { init as systemInit } from "../index";
import { routes } from "../router";
import { todoModel } from "../services/todo";
import {
  reportError,
  toast,
} from "../ux/Toaster";
import { getQueryParameter } from "../fun/getQueryParameter";
import { create as createTodoGrid } from "./grid-template.js";
import {
  setFormValue,
  getFormValue,
} from "../fun/setFormValue";

export async function init() {
  await systemInit();

  const todoItemsPlaceholder =
    document.body.querySelector(
      ".todo-items.placeholder"
    ) as HTMLElement;

  if (!todoItemsPlaceholder)
    throw "todo-items placeholder not found";

  const formDom =
    document.body.querySelector(
      "form"
    ) as HTMLFormElement;
  if (!formDom) throw "form not found";

  const id = getQueryParameter("id");
  const activeTodoItem =
    id && (await todoModel.getItem(id));

  if (activeTodoItem) {
    setFormValue(
      formDom,
      "todo-comment",
      activeTodoItem.comment
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
      ).sortBy({ date: "-number" });
      const todoItemsGrid =
        createTodoGrid(todoItems);
      todoItemsPlaceholder.innerText =
        "";
      todoItemsPlaceholder.appendChild(
        todoItemsGrid
      );
    }
  };

  on(
    document.body,
    "delete",
    async () => {
      if (!id) {
        trigger(document.body, "reset");
        return;
      }
      try {
        await todoModel.removeItem(id);
        trigger(document.body, "reset");
      } catch (ex) {
        reportError(ex);
      }
    }
  );

  on(document.body, "reset", () => {
    setGlobalState(
      "todo-date",
      asDateString(new Date())
    );
    setGlobalState("todo-comment", "");
    gotoUrl(routes.createTodo());
  });

  on(
    document.body,
    "submit",
    async () => {
      const date = getFormValue(
        formDom,
        "todo-date"
      );

      const comment = getFormValue(
        formDom,
        "todo-comment"
      );

      await todoModel.upsertItem({
        id,
        date: new Date(date).valueOf(),
        comment,
      });

      toast("Saved");
      render();
    }
  );

  render();
}
