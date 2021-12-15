import { createGeneralLedgerGrid } from "./templates/glgrid.js";
export { identify } from "../identify.js";

export function init(domNode: HTMLElement) {
  const ledger = createGeneralLedgerGrid();
  domNode.appendChild(ledger);
}
