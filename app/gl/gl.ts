import { create as createLedgerForm } from "./templates/glgrid.js";
import { create as printLedger } from "./templates/print";
export { identify } from "../identify.js";
import {
  ledgers as loadLedgers,
  get as loadLedger,
} from "../services/gl.js";
import "../fun/sort.js"; // includes sortBy Array extension

export async function init(
  domNode: HTMLElement
) {
  const queryParams =
    new URLSearchParams(
      window.location.search
    );
  const printId =
    queryParams.get("print");
  if (printId) {
    const target = document.body;
    switch (printId) {
      case "all": {
        target.innerHTML = "";
        const ledger =
          await printLedger();
        target.appendChild(ledger);
        break;
      }
      default: {
        target.innerHTML = "";
        const ledger =
          await printLedger(printId);
        target.appendChild(ledger);
      }
    }
    return;
  }
  if (queryParams.has("id")) {
    const id = queryParams.get("id")!;
    const ledger = await loadLedger(id);
    if (!ledger)
      throw `cannot find ledger: ${id}`;
    domNode.appendChild(
      createLedgerForm(ledger)
    );
  } else {
    const ledger = createLedgerForm();
    domNode.appendChild(ledger);
  }
}
