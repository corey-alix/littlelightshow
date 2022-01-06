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
} from "./services/forceUpdatestampTable";
import { invoiceModel } from "./services/invoices";
import { inventoryModel } from "./services/inventory";
import { toast } from "./ux/Toaster";
import { isUndefined } from "./fun/isUndefined";
import { removeCssRestrictors } from "./fun/detect.js";

const VERSION = "1.0.5";

export async function init() {
  const domNode = document.body;

  if (!isOffline()) {
    await identify();
    await registerServiceWorker();
    setInitialState({
      VERSION: "1.0.3",
    });

    setInitialState({
      TAX_RATE: 6,
      CACHE_MAX_AGE: 600,
      BATCH_SIZE: 64,
      work_offline: true,
      VERSION,
    });
    setInitialState({ primaryContact });

    await upgradeFromCurrentVersion();
  }

  injectLabels(domNode);
  extendNumericInputBehaviors(domNode);
  hookupTriggers(domNode);
  setMode();
  removeCssRestrictors();
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
      await upgradeFrom103To105();
      toast(
        `upgraded to ${currentVersion}`
      );
      break;
    case "1.0.4":
      break; // nothing to do
    case "1.0.5":
      break; // nothing to do
    default:
      throw `unexpected version: ${currentVersion}`;
  }
}

async function upgradeFrom103To105() {
  // delete local-only inventory items
  inventoryModel.upgradeTo104();
  // pull in actual inventory items
  await inventoryModel.synchronize();

  setGlobalState("VERSION", VERSION);
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

async function registerServiceWorker() {
  const worker =
    await navigator.serviceWorker.register(
      "/app/worker.js",
      { type: "module" }
    );
}
