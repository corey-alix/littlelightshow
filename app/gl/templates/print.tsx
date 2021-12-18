import { dom } from "../../dom.js";
import { ledgers as loadAllLedgers } from "../../services/gl.js";
import { printDetail } from "./printDetail";
import { create as printSummary } from "./printSummary";

export async function create(id?: string) {
  let ledgers = await loadAllLedgers();
  if (id) {
    ledgers = ledgers.filter((l) => l.id === id);
  }
  if (!ledgers.length) throw "ledger not found";
  const report2 = printDetail(ledgers);
  const report1 = printSummary(ledgers);
  document.body.innerHTML = "";
  document.body.innerHTML = "<h1>Little Light Show General Ledger</h1>";
  document.body.appendChild(report1);
  document.body.appendChild(<div class="vspacer-2"></div>);
  document.body.appendChild(report2);
}
