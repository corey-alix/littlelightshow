import { create as createLedgerForm } from "./templates/glgrid.js";
import { create as printLedger } from "./templates/print";
export { identify } from "../identify.js";
import {
  getItems as loadLedgers,
  getItem as loadLedger,
} from "../services/gl.js";
import "../fun/sort.js"; // includes sortBy Array extension
import { identify } from "../identify.js";
import { setMode } from "../fun/setMode.js";
import { removeCssRestrictors } from "../fun/detect.js";
import { toast } from "../ux/Toaster.js";

export async function init(
  domNode: HTMLElement
) {
  try {
    await identify();
    setMode();
    removeCssRestrictors();
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
      const ledger = await loadLedger(
        id
      );
      if (!ledger)
        throw `cannot find ledger: ${id}`;
      domNode.appendChild(
        createLedgerForm(ledger)
      );
    } else {
      const ledger = createLedgerForm();
      domNode.appendChild(ledger);
    }
  } catch (ex) {
    toast(ex + "");
  }
}
