import "./fun/sort.js";

import { identify } from "./identify.js";
import { hookupTriggers } from "./fun/hookupTriggers.js";

import { importInvoicesToGeneralLedger } from "./services/admin.js";
import {
  LedgerItem,
  ledgers as loadAllLedgers,
} from "./services/gl.js";
import {
  save as saveAccounts,
  load as loadAccounts,
} from "./gl/AccountManager.js";

// not sure what to start with
type AccountHierarchy = Record<
  string,
  {
    code?: string;
    accounts?: AccountHierarchy;
  }
>;

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
  await identify();
  const domNode = document.body;
  hookupTriggers(domNode);
  domNode.addEventListener(
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

  domNode.addEventListener(
    "gl-to-list-of-accounts",
    async () => {
      const accounts = loadAccounts();
      starterAccounts.forEach(
        (account) =>
          addAccount(accounts, account)
      );
      const ledgers =
        await loadAllLedgers();
      ledgers.forEach((l) =>
        l.items.forEach((item) => {
          addAccount(
            accounts,
            item.account
          );
        })
      );
      saveAccounts(accounts);
    }
  );
}
function addAccount(
  accounts: any,
  item: string
) {
  if (!accounts[item]) {
    accounts[item] = {
      code: item,
    };
  }
}
