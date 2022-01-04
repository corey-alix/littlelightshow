import "./fun/sort.js";
import { setMode } from "./fun/setMode";
import {
  globals,
  isOffline,
} from "./globals";
const { primaryContact } = globals;
import {
  getGlobalState,
  setGlobalState,
} from "./fun/globalState";
import { identify } from "./identify";
import { extendNumericInputBehaviors } from "./fun/behavior/form";
import { hookupTriggers } from "./fun/hookupTriggers";
import { injectLabels } from "./ux/injectLabels";
import {
  forceUpdatestampIndex,
  forceUpdatestampTable,
} from "./services/admin";
import { invoiceModel } from "./services/invoices";
import { inventoryModel } from "./services/inventory";
import {
  reportError,
  toast,
} from "./ux/Toaster";
import { isUndefined } from "./isUndefined";

const VERSION = "1.0.4";

export async function init() {
  const domNode = document.body;

  setInitialState({ VERSION: "1.0.3" });

  setInitialState({
    TAX_RATE: 6,
    CACHE_MAX_AGE: 600,
    BATCH_SIZE: 64,
    work_offline: true,
    VERSION,
  });
  setInitialState({ primaryContact });

  if (!isOffline())
    await upgradeFromCurrentVersion();

  await identify();
  injectLabels(domNode);
  extendNumericInputBehaviors(domNode);
  hookupTriggers(domNode);
  setMode();
}

function setInitialState(
  data: Record<string, any>
) {
  Object.keys(data).forEach((key) => {
    const value = getGlobalState(key);
    if (isUndefined(value)) {
      setGlobalState(key, data[key]);
    }
  });
}

async function upgradeFromCurrentVersion() {
  const currentVersion =
    getGlobalState<string>("VERSION");

  switch (currentVersion) {
    case "1.0.3":
      await upgradeFrom103To104();
      break;
    case "1.0.4":
      break; // nothing to do
    default:
      throw `unexpected version: ${currentVersion}`;
  }
}

async function upgradeFrom103To104() {
  // delete local-only inventory items
  inventoryModel.upgradeTo104();
  // pull in actual inventory items
  await inventoryModel.synchronize();

  setGlobalState("VERSION", VERSION);
  toast("upgraded from 1.0.3 to 1.0.4");
}

async function createInventoryCollection() {
  await forceUpdatestampTable(
    "inventory"
  );
  await forceUpdatestampIndex(
    "inventory"
  );
}

async function populateInventoryFromInvoice() {
  const taxrate =
    getGlobalState<number>(
      "TAX_RATE"
    ) || 0;

  const currentInventoryItems =
    await inventoryModel.getItems();

  const invoices =
    await invoiceModel.getItems();
  for (let invoice of invoices) {
    invoice.items.forEach(
      async (item) => {
        // skip if already defined in inventory
        if (
          currentInventoryItems.some(
            (i) => i.code === item.item
          )
        )
          return;
        await inventoryModel.upsertItem(
          {
            code: item.item,
            description:
              item.description,
            quantity: item.quantity,
            price: item.price,
            taxrate:
              item.tax === 0
                ? 0
                : taxrate,
          }
        );
      }
    );
  }
}
