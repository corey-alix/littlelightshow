import "../fun/sort.js"; // includes sortBy Array extension
import { create as createLedgerForm } from "./templates/glgrid.js";
import { create as printLedger } from "./templates/print.js";
import { create as printAccount } from "./templates/by-account.js";
import { getItem as loadLedger } from "../services/gl.js";
import { identify } from "../identify.js";
import { setMode } from "../fun/setMode.js";
import { removeCssRestrictors } from "../fun/detect.js";
import { reportError } from "../ux/Toaster.js";
import { execute } from "../fql/gl-by-account.js";

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

    if (queryParams.has("print")) {
      const printId =
        queryParams.get("print")!;
      const target = domNode;
      switch (printId) {
        case "all": {
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
      return;
    }

    if (queryParams.has("account")) {
      const account =
        queryParams.get("account")!;
      const report = await printAccount(
        account
      );
      domNode.appendChild(report);
      return;
    }

    {
      const ledger = createLedgerForm();
      domNode.appendChild(ledger);
    }
  } catch (ex) {
    reportError(ex);
  }
}
