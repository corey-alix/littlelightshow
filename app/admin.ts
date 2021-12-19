import "./fun/sort.js";

import { identify } from "./identify.js";
import { hookupTriggers } from "./fun/hookupTriggers.js";

import { importInvoicesToGeneralLedger } from "./services/admin.js";
import { ledgers as loadAllLedgers } from "./services/gl.js";
import { accountManager } from "./gl/AccountManager.js";

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
      debugger;
      const ledgers =
        await loadAllLedgers();
      const accounts =
        accountManager.accounts;
      ledgers.forEach((l) =>
        l.items.forEach((item) => {
          if (!accounts[item.account]) {
            accounts[item.account] = {
              code: item.account,
            };
          }
        })
      );
      accountManager.save();
    }
  );
}
