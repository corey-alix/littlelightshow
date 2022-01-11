import "../fun/sort.js"; // includes sortBy Array extension
import { create as createLedgerForm } from "./templates/glgrid.js";
import { create as printLedger } from "./templates/print.js";
import { create as printAccount } from "./templates/by-account.js";
import { getItem as loadLedger } from "../services/gl.js";
import { reportError } from "../ux/toasterWriter";
import { init as systemInit } from "../index.js";
import { getQueryParameter } from "../fun/getQueryParameter.js";
import { stripAccessControlItems } from "../fun/hookupTriggers.js";

export async function init(
  domNode: HTMLElement
) {
  try {
    await systemInit();

    window.addEventListener(
      "beforeprint",
      () => {
        document.body.classList.add(
          "print"
        );
      }
    );

    const printId =
      getQueryParameter("print");
    if (!!printId) {
      const target = domNode;
      switch (printId) {
        case "all": {
          const ledger =
            await printLedger();
          stripAccessControlItems(
            ledger
          );
          target.appendChild(ledger);
          break;
        }
        default: {
          target.innerHTML = "";
          const ledger =
            await printLedger(printId);
          stripAccessControlItems(
            ledger
          );
          target.appendChild(ledger);
        }
      }
      return;
    }

    const id = getQueryParameter("id");
    if (!!id) {
      const ledger = await loadLedger(
        id
      );
      if (!ledger)
        throw `cannot find ledger: ${id}`;

      const form =
        createLedgerForm(ledger);

      stripAccessControlItems(form);
      domNode.appendChild(form);
      return;
    }

    const account =
      getQueryParameter("account");
    if (!!account) {
      const report = await printAccount(
        account
      );
      stripAccessControlItems(report);
      domNode.appendChild(report);
      return;
    }

    {
      const ledger = createLedgerForm();
      stripAccessControlItems(ledger);
      domNode.appendChild(ledger);
    }
  } catch (ex) {
    reportError(ex);
  }
}
