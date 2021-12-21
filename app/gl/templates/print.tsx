import { dom } from "../../dom.js";
import {
  Ledger,
  ledgers as loadAllLedgers,
  get as loadLedger,
} from "../../services/gl.js";
import { printDetail } from "./printDetail";
import { create as printSummary } from "./printSummary";
import { primaryContact } from "../../globals.js";
import {
  asDateString,
  asTimeString,
} from "../../fun/asDateString.js";
import { moveChildren } from "../../fun/dom.js";

export async function create(
  target: HTMLElement,
  id?: string
) {
  let ledgers: Array<Ledger>;
  if (id) {
    const ledger = await loadLedger(id);
    if (!ledger)
      throw `ledger not found: ${id}`;
    ledgers = [ledger];
  } else {
    ledgers = await loadAllLedgers();
  }
  target.appendChild(createBanner());

  target.appendChild(
    <div>
      <div class="vspacer-2"></div>
      <div class="section-title">
        Account Summary
      </div>
    </div>
  );

  if (ledgers.length) {
    target.appendChild(
      printSummary(ledgers)
    );

    target.appendChild(
      <div class="vspacer-2"></div>
    );

    target.appendChild(
      printDetail(ledgers)
    );
  } else {
    moveChildren(
      <div>
        <div class="center">
          No ledgers have been defined
        </div>
      </div>,
      target
    );
  }
}

function createBanner() {
  return (
    <div class="grid-6">
      <div class="col-1-6 centered">
        {`General Ledger for ${primaryContact.companyName}`}
      </div>
      <div class="line col-1-6"></div>
      <div class="col-1-3">
        <address class="col-1-5">
          {primaryContact.fullName}
        </address>
        <address class="col-1-5">
          {primaryContact.addressLine1}
        </address>
        <address class="col-1-5">
          {primaryContact.addressLine2}
        </address>
      </div>
      <div class="col-4-3">
        <div class="align-right col-6">
          {`Printed on ${asDateString()} @ ${asTimeString()}`}
        </div>
      </div>
    </div>
  );
}
