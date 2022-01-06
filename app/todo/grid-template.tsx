import { dom } from "../dom";
import { Todo } from "../services/todo";
import { moveChildren } from "../fun/dom";
import { routes } from "../router";
import { asDateString } from "../fun/asDateString";
import { gotoUrl } from "../fun/gotoUrl";

dom;

function renderItem(
  item: Todo
): HTMLElement {
  const date = asDateString(
    new Date(item.date)
  );
  return (
    <div>
      <div class="col-1 date">
        <a
          click={() =>
            gotoUrl(
              routes.todo(item.id)
            )
          }
        >
          {date}
        </a>
      </div>
      <div class="col-2-last text pre no-overflow max-height-100">
        {item.comment}
      </div>
    </div>
  );
}
export function create(items: Todo[]) {
  const grid = (
    <div class="grid-6">
      <div class="col-1 line date">
        Date
      </div>
      <div class="col-2-last line text">
        Comment
      </div>
    </div>
  );
  items
    .map(renderItem)
    .forEach((item) =>
      moveChildren(item, grid)
    );
  return grid;
}
