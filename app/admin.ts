import "./fun/sort.js";

import { identify } from "./identify.js";
import { hookupTriggers } from "./fun/hookupTriggers.js";

import { importInvoicesToGeneralLedger } from "./services/admin.js";
import { getItems as loadAllLedgers } from "./services/gl.js";
import {
  save as saveAccounts,
  load as loadAccounts,
} from "./gl/AccountManager.js";
import { on } from "./fun/on.js";
import { ServiceCache } from "./services/ServiceCache.js";
import {
  modes,
  setMode,
} from "./fun/setMode.js";

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

  Object.keys(modes).forEach((mode) =>
    on(domNode, mode, () => {
      setMode(modes[mode]);
    })
  );

  on(
    domNode,
    "clear-local-storage",
    () => {
      let cache = new ServiceCache(
        "invoices"
      );
      cache.clear();
      cache = new ServiceCache(
        "general_ledger"
      );
      cache.clear();
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
    () => {
      let cache = new ServiceCache(
        "invoices"
      );
      cache.renew();
      cache = new ServiceCache(
        "general_ledger"
      );
      cache.renew();
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
