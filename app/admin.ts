import "./fun/sort.js";

import { identify } from "./identify.js";
import { hookupTriggers } from "./fun/hookupTriggers.js";

import { importInvoicesToGeneralLedger } from "./services/admin.js";

export async function init() {
  await identify();
  const domNode = document.body;
  hookupTriggers(domNode);
  domNode.addEventListener("invoice-to-gl", async () => {
    if (!confirm("import invoices into general ledger?")) return;
    debugger;
    await importInvoicesToGeneralLedger();
  });
}
