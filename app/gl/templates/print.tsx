import { dom } from "../../dom.js";
import { ledgers as loadAllLedgers } from "../../services/gl.js";
import { printDetail } from "./printDetail";
import { create as printSummary } from "./printSummary";
import { primaryContact } from "../../globals.js";
import {
  asDateString,
  asTimeString,
} from "../../fun/asDateString.js";

export async function create(
  id?: string
) {
  let ledgers = await loadAllLedgers();
  if (id) {
    ledgers = ledgers.filter(
      (l) => l.id === id
    );
  }
  if (!ledgers.length)
    throw "ledger not found";
  document.body.innerHTML = "";
  document.body.appendChild(
    createBanner()
  );

  document.body.appendChild(
    <div>
      <div class="vspacer-2"></div>
      <div class="section-title">
        Account Summary
      </div>
    </div>
  );

  document.body.appendChild(
    printSummary(ledgers)
  );

  document.body.appendChild(
    <div class="vspacer-2"></div>
  );

  document.body.appendChild(
    printDetail(ledgers)
  );
}

function createBanner() {
  return (
    <div class="grid-6">
      <address class="col-1-5">
        {primaryContact.fullName}
      </address>
      <div class="col-6 align-right">
        {`General Ledger for ${primaryContact.companyName}`}
      </div>
      <address class="col-1-5">
        {primaryContact.addressLine1}
      </address>
      <div class="align-right col-6">
        {`Printed on ${asDateString()} @ ${asTimeString()}`}
      </div>
      <address class="col-1-5">
        {primaryContact.addressLine2}
      </address>
    </div>
  );
}
