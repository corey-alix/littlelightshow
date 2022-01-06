import { init as systemInit } from "../index.js";
import {
  Inventory,
  inventoryModel,
} from "../services/inventory.js";
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
import { isNull } from "../fun/isUndefined.js";
import { routes } from "../router.js";
import { globals } from "../globals.js";
import { gotoUrl } from "../fun/gotoUrl.js";
import { getQueryParameter } from "../fun/getQueryParameter.js";

export async function init(
  target = document.body
) {
  await systemInit();
  const inventoryItems =
    await inventoryModel.getItems();

  const id = getQueryParameter("id")!;
  if (!!id) {
    if (id === "all") {
      const report = showInventoryItems(
        inventoryItems.sortBy({
          code: "string",
        })
      );
      target.appendChild(report);
      return;
    }

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

      await saveChanges(
        inventoryItem,
        formDom
      );
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

    on(formDom, "clear", async () => {
      gotoUrl(routes.createInventory());
    });

    on(formDom, "show-all", () => {
      gotoUrl(
        routes.allInventoryItems()
      );
    });

    hookupTriggers(formDom);
    extendNumericInputBehaviors(
      formDom
    );
    extendTextInputBehaviors(formDom);
    return;
  }
  {
    const inventoryItem: Inventory = {
      code: "",
      price: 0,
      quantity: 1,
      taxrate: 100 * globals.TAXRATE,
      description: "",
    };
    const formDom = showInventoryItem(
      inventoryItem
    );
    target.appendChild(formDom);
    hookupTriggers(formDom);
    extendNumericInputBehaviors(
      formDom
    );
    extendTextInputBehaviors(formDom);

    on(formDom, "submit", async () => {
      await saveChanges(
        inventoryItem,
        formDom
      );
      gotoUrl(
        routes.inventory(
          inventoryItem.id!
        )
      );
    });

    on(formDom, "clear", async () => {
      gotoUrl(routes.createInventory());
    });

    on(formDom, "delete", () => {
      gotoUrl(routes.createInventory());
    });

    on(formDom, "show-all", () => {
      gotoUrl(
        routes.allInventoryItems()
      );
    });

    return;
  }
}

async function saveChanges(
  inventoryItem: {
    id?: string | undefined;
    code: string;
    description?: string | undefined;
    quantity: number;
    price: number;
    taxrate: number;
  },
  formDom: HTMLFormElement
) {
  const names: Array<keyof Inventory> =
    [
      "description",
      "code",
      "price",
      "quantity",
      "taxrate",
    ];
  names.forEach((name) => {
    (<any>inventoryItem)[name] =
      getValue(
        formDom,
        name,
        inventoryItem[name]
      );
  });

  try {
    await inventoryModel.upsertItem(
      inventoryItem
    );
  } catch (ex) {
    reportError(ex);
  }
  toast("Changes saved");
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
