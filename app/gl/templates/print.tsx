import { dom } from "../../dom.js";
import {
  Ledger,
  getItems as loadAllLedgers,
  getItem as loadLedger,
} from "../../services/gl.js";
import { printDetail } from "./printDetail";
import { create as printSummary } from "./printSummary";
import { primaryContact } from "../../globals.js";
import {
  asDateString,
  asTimeString,
} from "../../fun/asDateString.js";
import { moveChildren } from "../../fun/dom.js";
import { on } from "../../fun/on.js";
import { routes } from "../../router.js";
import { hookupTriggers } from "../../fun/hookupTriggers";

export async function create(
  id?: string
) {
  const target = <div></div>;
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
      <div class="section-title if-desktop">
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
      <div class="grid-6">
        <div class="centered row-1-6">
          No ledgers have been defined
        </div>
        <div class="vspacer-2 row-1-6" />
        <button
          class="button row-1"
          data-event="create-ledger"
        >
          Create General Ledger
        </button>
      </div>,
      target
    );
  }

  on(target, "create-ledger", () => {
    location.href =
      routes.createLedger();
  });

  hookupTriggers(target);
  return target;
}

function createBanner() {
  return (
    <div class="grid-6">
      <div class="col-1-6 centered">
        {`General Ledger for ${primaryContact.companyName}`}
      </div>
      <div class="line col-1-6 if-desktop"></div>
      <div class="col-1-3 if-desktop">
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
      <div class="col-4-3 if-desktop">
        <div class="align-right col-6">
          {`Printed on ${asDateString()} @ ${asTimeString()}`}
        </div>
      </div>
    </div>
  );
}
