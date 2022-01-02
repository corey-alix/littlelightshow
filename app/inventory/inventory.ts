import { init as systemInit } from "../index.js";
import { inventoryModel } from "../services/inventory.js";
import { create as showInventoryItems } from "./templates/inventory.js";
import { create as showInventoryItem } from "./templates/inventory-item.js";
import { on } from "../fun/on.js";
import {
  reportError,
  toast,
} from "../ux/Toaster.js";
import { hookupTriggers } from "../fun/hookupTriggers.js";
import { extendNumericInputBehaviors } from "../fun/behavior/form.js";

export async function init(
  target = document.body
) {
  await systemInit();
  const inventoryItems =
    await inventoryModel.getItems();

  const queryParams =
    new URLSearchParams(
      window.location.search
    );

  if (queryParams.has("id")) {
    const id = queryParams.get("id")!;
    const inventoryItem = {
      ...(await inventoryModel.getItem(
        id
      )),
    };

    const formDom = showInventoryItem(
      inventoryItem
    );
    target.appendChild(formDom);

    on(formDom, "submit", async () => {
      if (!formDom.checkValidity()) {
        formDom.reportValidity();
        return false;
      }
      inventoryItem.code = getValue(
        formDom,
        "code",
        inventoryItem.code
      );
      inventoryItem.price = getValue(
        formDom,
        "price",
        inventoryItem.price
      );
      try {
        await inventoryModel.upsertItem(
          inventoryItem
        );
      } catch (ex) {
        reportError(ex);
      }
      toast("Changes saved");
    });

    on(formDom, "delete", async () => {
      try {
        await inventoryModel.removeItem(
          inventoryItem.id!
        );
      } catch (ex) {
        reportError(ex);
      }
      toast("Item Deleted");
    });

    hookupTriggers(formDom);
    extendNumericInputBehaviors(
      formDom
    );
  } else {
    const report = showInventoryItems(
      inventoryItems.sortBy({
        code: "string",
      })
    );
    target.appendChild(report);
  }
}

function getValue<T>(
  form: HTMLFormElement,
  name: string,
  defaultValue: T
): T {
  const value = (
    form[name] as HTMLInputElement
  ).value;

  if (value) {
    if (
      typeof defaultValue === "number"
    )
      return <T>(
        (<any>parseFloat(value))
      );
    return <T>(<any>value);
  }
  return defaultValue;
}
