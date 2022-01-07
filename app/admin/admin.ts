import { init as systemInit } from "../index.js";

import {
  importInvoicesToGeneralLedger,
  removeDuplicateInventoryItems,
} from "../services/admin.js";
import {
  getItems as loadAllLedgers,
  ledgerModel,
} from "../services/gl.js";
import { accountModel } from "../services/accounts.js";
import { on } from "../fun/on.js";
import {
  modes,
  setMode,
} from "../fun/setMode.js";
import { invoiceModel } from "../services/invoices.js";
import {
  reportError,
  toast,
} from "../ux/Toaster.js";
import { inventoryModel } from "../services/inventory.js";
import { getDatabaseTime } from "../services/getDatabaseTime.js";
import { setGlobalState } from "../fun/globalState.js";
import { FaunaException } from "./FaunaException";
import {
  forceUpdatestampIndex,
  forceUpdatestampTable,
} from "../services/forceUpdatestampTable.js";

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

export async function init() {
  await systemInit();
  const domNode = document.body;

  on(domNode, "font_mode:yes", () => {
    setGlobalState("textier", true);
    setMode();
  });

  on(domNode, "font_mode:no", () => {
    setGlobalState("textier", false);
    setMode();
  });

  Object.keys(modes).forEach((mode) =>
    on(domNode, mode, () => {
      setMode(modes[mode]);
      toast(`theme changed to ${mode}`);
    })
  );

  const tableNames = [
    "general_ledger",
    "invoices",
    "inventory",
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
    "clean-invoice-data",
    async () => {
      const invoices =
        await invoiceModel.getItems();
      const toDelete =
        [] as Array<string>;
      invoices.forEach((invoice) => {
        if (!invoice.clientname) {
          toDelete.push(invoice.id!);
        }
      });
      toDelete.forEach((id) =>
        invoiceModel.removeItem(id)
      );
    }
  );

  on(
    domNode,
    "clean-inventory-data",
    async () => {
      removeDuplicateInventoryItems();
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
    "synchronize-inventory-data",
    async () => {
      try {
        await inventoryModel.synchronize();
        toast(
          "inventory sync completed"
        );
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

  on(
    domNode,
    "set-fauna-api-key",
    () => {
      prompt(
        "Enter Fauna API Key",
        (secret) => {
          if (!secret) return;
          localStorage.setItem(
            "FAUNADB_SERVER_SECRET",
            secret
          );
        }
      );
    }
  );

  on(
    domNode,
    "set-maptiler-api-key",
    () => {
      prompt(
        "Enter MapTiler API Key",
        (secret) => {
          if (!secret) return;
          localStorage.setItem(
            "MAPTILER_SERVER_SECRET",
            secret
          );
        }
      );
    }
  );

  // f0zkb15NK1sqOcE72HCf
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
    "invoice-to-gl",
    async () => {
      if (
        !confirm(
          "import invoices into general ledger?"
        )
      )
        return;
      try {
        await importInvoicesToGeneralLedger();
        toast("Import complete");
      } catch (ex) {
        reportError(ex);
      }
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
