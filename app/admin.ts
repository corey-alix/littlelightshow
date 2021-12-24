import "./fun/sort.js";

import { identify } from "./identify.js";
import { hookupTriggers } from "./fun/hookupTriggers.js";

import {
  forceUpdatestampIndex,
  forceUpdatestampTable,
  importInvoicesToGeneralLedger,
} from "./services/admin.js";
import {
  getItems as loadAllLedgers,
  ledgerModel,
} from "./services/gl.js";
import { accountModel } from "./services/accounts.js";
import { on } from "./fun/on.js";
import {
  modes,
  setMode,
} from "./fun/setMode.js";
import { invoiceModel } from "./services/invoices.js";
import {
  reportError,
  toast,
} from "./ux/Toaster.js";
import { inventoryModel } from "./services/inventory.js";
import { getDatabaseTime } from "./services/getDatabaseTime.js";
const starterAccounts = [
  "AP",
  "AR",
  "CASH",
  "INVENTORY",
  "LABOR",
  "OPEX",
  "Phone",
  "Rental",
  "SALE TAX",
  "SALES",
  "STORAGE",
  "TOOLS",
  "Utilities",
];

interface FaunaException {
  name: string;
  message: string;
  description: string;
  requestResult: any;
}

export async function init() {
  await identify();
  const domNode = document.body;

  hookupTriggers(domNode);

  Object.keys(modes).forEach((mode) =>
    on(domNode, mode, () => {
      setMode(modes[mode]);
      toast(`theme changed to ${mode}`);
    })
  );

  const tableNames = [
    "general_ledger",
    "invoices",
  ];

  on(
    domNode,
    "database-rebuild-collection",
    () => {
      tableNames.forEach(
        async (tableName) => {
          try {
            await forceUpdatestampTable(
              tableName
            );
            toast(
              `Table created: ${tableName}`
            );
          } catch (ex) {
            reportError(
              `Failed to create table: ${tableName}: ${
                (ex as FaunaException)
                  .description
              }`
            );
          }
        }
      );
    }
  );

  on(
    domNode,
    "database-rebuild-index",
    async () => {
      tableNames.forEach(
        async (tableName) => {
          try {
            await forceUpdatestampIndex(
              tableName
            );
            toast(
              `Index Rebuilt: ${tableName}`
            );
          } catch (ex) {
            reportError(
              `Failed to create index: ${tableName}: ${
                (ex as FaunaException)
                  .description
              }`
            );
          }
        }
      );
    }
  );

  on(
    domNode,
    "synchronize-invoice-data",
    async () => {
      try {
        await invoiceModel.synchronize();
        toast("invoice sync completed");
      } catch (ex) {
        reportError(ex);
      }
    }
  );

  on(
    domNode,
    "synchronize-ledger-data",
    async () => {
      try {
        await ledgerModel.synchronize();

        toast("ledger sync completed");
      } catch (ex) {
        reportError(ex);
      }
    }
  );

  on(domNode, "set-api-key", () => {
    prompt(
      "Enter API Key",
      (secret) => {
        if (!secret) return;
        localStorage.setItem(
          "FAUNADB_SERVER_SECRET",
          secret
        );
      }
    );
  });

  on(
    domNode,
    "ping-local-storage",
    async () => {
      const ticks = {
        start: Date.now(),
        end: -1,
      };
      const time =
        await getDatabaseTime();
      ticks.end = Date.now();
      toast(
        `Roundtrip time: ${
          ticks.end - ticks.start
        }ms`
      );
    }
  );

  on(
    domNode,
    "invoice-to-inventory",
    async () => {
      await importInvoicesToGeneralLedger();
      const invoices =
        await invoiceModel.getItems();
      invoices.forEach((invoice) => {
        invoice.items.forEach(
          async (item) => {
            await inventoryModel.upsertItem(
              {
                id: item.item,
                code: item.item,
                price: item.price,
              }
            );
          }
        );
      });
      toast(
        "inventory updated with invoice line items"
      );
    }
  );

  on(
    domNode,
    "invoice-to-gl",
    async () => {
      if (
        !confirm(
          "import invoices into general ledger?"
        )
      )
        return;
      await importInvoicesToGeneralLedger();
    }
  );

  on(
    domNode,
    "gl-to-list-of-accounts",
    async () => {
      starterAccounts.forEach(
        async (account) =>
          await accountModel.upsertItem(
            {
              id: account,
              code: account,
            }
          )
      );
      const ledgers =
        await loadAllLedgers();
      ledgers.forEach(async (l) =>
        l.items.forEach(
          async (item) =>
            await accountModel.upsertItem(
              {
                id: item.account,
                code: item.account,
              }
            )
        )
      );
      toast("accounts generated");
    }
  );
  setMode();
}

function prompt(
  label: string,
  cb: (input: string) => void
) {
  const input =
    document.createElement("input");
  input.placeholder = label;
  document.body.appendChild(input);
  input.onchange = () => {
    cb(input.value.trim());
    input.remove();
  };
}
