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
    switch (printId) {
      case "all":
        await printLedger();
        break;
      default:
        await printLedger(printId);
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
