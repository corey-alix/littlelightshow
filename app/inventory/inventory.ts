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
import {
  extendNumericInputBehaviors,
  extendTextInputBehaviors,
} from "../fun/behavior/form.js";
import { invoiceModel } from "../services/invoices.js";
import { isNull } from "../isUndefined.js";

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
      const priorCode =
        inventoryItem.code;
      inventoryItem.code = getValue(
        formDom,
        "code",
        inventoryItem.code
      );

      await renameInvoiceItems(
        priorCode,
        inventoryItem.code
      );

      inventoryItem.description =
        getValue(
          formDom,
          "description",
          inventoryItem.description
        );

      inventoryItem.quantity = getValue(
        formDom,
        "quantity",
        inventoryItem.quantity
      );

      inventoryItem.price = getValue(
        formDom,
        "price",
        inventoryItem.price
      );

      inventoryItem.taxrate = getValue(
        formDom,
        "taxrate",
        inventoryItem.taxrate
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
    extendTextInputBehaviors(formDom);
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
  )?.value;

  if (!isNull(value)) {
    if (
      typeof defaultValue === "number"
    )
      return <T>(
        (<any>parseFloat(value || "0"))
      );
    return <T>(<any>value);
  }
  return defaultValue;
}

async function renameInvoiceItems(
  priorCode: string,
  code: string
) {
  if (priorCode === code) return;

  const invoices =
    await invoiceModel.getItems();

  for (let invoice of invoices) {
    const itemsToRename =
      invoice.items?.filter(
        (item) => item.item == priorCode
      );
    if (!!itemsToRename?.length) {
      for (let item of itemsToRename) {
        item.item = code;
        item.description =
          item.description ||
          priorCode.trim();
        await invoiceModel.upsertItem(
          invoice
        );
        toast(
          `updated invoice ${invoice.id}`
        );
      }
    }
  }
}
