import {
  createGeneralLedgerGrid,
  print,
  printAll,
} from "./templates/glgrid.js";
export { identify } from "../identify.js";
import { ledgers as loadLedgers } from "../services/gl.js";

export async function init(domNode: HTMLElement) {
  const queryParams = new URLSearchParams(window.location.search);
  const printId = queryParams.get("print");
  if (printId) {
    switch (printId) {
      case "all":
        await printAll();
        break;
      default:
        await print(printId);
    }
    return;
  }
  if (queryParams.has("id")) {
    const id = queryParams.get("id")!;
    const ledgers = await loadLedgers();
    const ledger = ledgers.find((l) => l.id === id);
    if (!ledger) throw `cannot find ledger: ${id}`;
    domNode.appendChild(createGeneralLedgerGrid(ledger));
  } else {
    const ledger = createGeneralLedgerGrid();
    domNode.appendChild(ledger);
  }
}
