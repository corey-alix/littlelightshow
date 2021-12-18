import { dom } from "../../dom.js";
import { moveChildren, moveChildrenBefore } from "../../fun/dom.js";
import {
  Ledger,
  LedgerItem,
  save as saveLedger,
  ledgers as loadAllLedgers,
} from "../../services/gl.js";
import { asCurrency } from "../../fun/asCurrency";
import { asDateString } from "../../fun/asDateString";
import { sum } from "../../fun/sum";
import { asNumber } from "../../fun/asNumber";
import { setCurrency } from "../../fun/setCurrency";
import { hookupTriggers } from "../../fun/hookupTriggers";
import { routes } from "../../router.js";

function isZero(value: string) {
  if (value === "0.00") return true;
  if (value === "-0.00") return true;
  return false;
}

function noZero(value: string) {
  return isZero(value) ? "" : value;
}

function asModel(form: HTMLFormElement) {
  const result: Ledger & { id: string } = {
    id: "",
    items: [],
    date: new Date().valueOf(),
  };
  const data = new FormData(form);
  result.id = (data.get("id") as string) || "";
  const batchDate = data.get("date") as string;
  result.date = new Date(batchDate).valueOf();

  result.description = (data.get("description") as string) || "";

  let currentItem: LedgerItem;
  for (let [key, value] of data.entries()) {
    switch (key) {
      case "account":
        currentItem = {} as any;
        result.items.push(currentItem);
        currentItem!.account = value as string;
        break;
      case "debit":
        currentItem!.amount =
          (currentItem!.amount || 0) + parseFloat((value as string) || "0");
        break;
      case "credit":
        currentItem!.amount =
          (currentItem!.amount || 0) - parseFloat((value as string) || "0");
        break;
      case "comment":
        currentItem!.comment = value as string;
        break;
    }
  }
  return result;
}

function hookupHandlers(domNode: HTMLFormElement) {
  const lineItems = domNode.querySelector("#end-of-line-items") as HTMLElement;
  const summaryArea = domNode.querySelector("#summary-area") as HTMLElement;

  const [totalCredits, totalDebits, totalError] = [
    "total_credit",
    "total_debit",
    "total_error",
  ].map((name) => domNode.querySelector(`[name=${name}]`) as HTMLInputElement);

  domNode.addEventListener("change", () => {
    const debits = Array.from(domNode.querySelectorAll("[name=debit]")).map(
      asNumber
    );
    const credits = Array.from(domNode.querySelectorAll("[name=credit]")).map(
      asNumber
    );

    const debitTotal = sum(debits);
    const creditTotal = sum(credits);

    setCurrency(totalDebits, debitTotal);
    setCurrency(totalCredits, creditTotal);
    setCurrency(totalError, debitTotal - creditTotal);
    const ledger = asModel(domNode);
    const summaryReport = printSummary([ledger]);
    summaryArea.innerText = "";
    summaryArea.appendChild(summaryReport);
  });

  domNode.addEventListener("print-all", async () => {
    location.href = routes.allLedgers();
    await printAll();
  });

  domNode.addEventListener("print", async () => {
    if (!domNode.reportValidity()) return;
    if (0 !== asNumber(domNode["total_error"])) {
      alert("Total error must be zero");
      return;
    }
    const model = asModel(domNode);
    await saveLedger(model);

    location.href = routes.printLedger(model.id);
  });

  domNode.addEventListener("print-detail", async () => {
    const ledgers = await loadAllLedgers();
    const report: HTMLElement = printDetail(ledgers);
    document.body.innerHTML = "";
    document.body.appendChild(report);
  });

  domNode.addEventListener("print-summary", async () => {
    const ledgers = await loadAllLedgers();
    const report = printSummary(ledgers);
    document.body.innerHTML = "";
    document.body.appendChild(report);
  });

  domNode.addEventListener("clear", async () => {
    location.href = routes.createLedger();
  });

  domNode.addEventListener("submit", async () => {
    if (!domNode.reportValidity()) return;
    if (0 !== asNumber(domNode["total_error"])) {
      alert("Total error must be zero");
      return;
    }
    const model = asModel(domNode);
    await saveLedger(model);
    location.reload();
  });

  domNode.addEventListener("add-row", () => {
    const row = createRow();
    const focus = row.querySelector("[name=account]") as HTMLElement;
    moveChildrenBefore(row, lineItems);
    focus.focus();
  });
}

export async function printAll() {
  const ledgers = await loadAllLedgers();
  ledgers.sort((a, b) => a.date - b.date).reverse();
  const report2 = printDetail(ledgers);
  const report1 = printSummary(ledgers);
  document.body.innerHTML = "<h1>Little Light Show General Ledger</h1>";
  document.body.appendChild(report1);
  document.body.appendChild(<div class="vspacer-2"></div>);
  document.body.appendChild(report2);
}

export async function print(id: string) {
  const ledgers = await loadAllLedgers();
  const ledger = ledgers.find((l) => l.id === id);
  if (!ledger) throw "ledger not found";
  const report2 = printDetail([ledger]);
  const report1 = printSummary([ledger]);
  document.body.innerHTML = "";
  document.body.innerHTML = "<h1>Little Light Show General Ledger</h1>";
  document.body.appendChild(report1);
  document.body.appendChild(<div class="vspacer-2"></div>);
  document.body.appendChild(report2);
}

function createRow(): HTMLElement {
  return (
    <form>
      <input
        class="col-1-2"
        name="account"
        required
        type="text"
        placeholder="account"
        list="listOfAccounts"
      />
      <input
        name="debit"
        class="currency col-3-2"
        type="number"
        step="0.01"
        placeholder="debit"
      />
      <input
        name="credit"
        class="currency col-5-2"
        type="number"
        step="0.01"
        placeholder="credit"
      />
      <input
        name="comment"
        class="text col-1-6"
        type="text"
        placeholder="comment"
      />
    </form>
  );
}

function printDetail(ledgers: (Ledger & { id: any })[]) {
  const report: HTMLElement = (
    <div class="grid-6">
      <div class="col-1-4 text">Account</div>
      <div class="col-5 currency">Debit</div>
      <div class="col-6 currency">Credit</div>
      <div class="line col-1-6"></div>
    </div>
  );
  const totals = [0, 0];
  let priorDate: string = "";

  ledgers.forEach((ledger) => {
    ledger.items.forEach((item) => {
      const amount = item.amount;
      const debit = amount >= 0 && amount;
      const credit = amount < 0 && -amount;
      totals[0] += debit || 0;
      totals[1] += credit || 0;
      let currentDate = asDateString(new Date(ledger.date || item["date"]));
      const lineitem = (
        <div>
          {currentDate != priorDate && (
            <div class="col-1-6 date section-title">{`${(priorDate =
              currentDate)}`}</div>
          )}
          <div class="col-1-4 text">{item.account}</div>
          <div class="col-5 currency">{debit && debit.toFixed(2)}</div>
          <div class="col-6 currency">{credit && credit.toFixed(2)}</div>
          <div class="col-1-6 text">
            <a href={`/app/gl/index.html?id=${ledger.id}`}>
              {item.comment || "no comment"}
            </a>
          </div>
          <div class="vspacer-2"></div>
        </div>
      );
      moveChildren(lineitem, report);
    });
  });
  moveChildren(
    <div>
      <div class="line col-1-6"></div>
      <div class="col-5 currency">{totals[0].toFixed(2)}</div>
      <div class="col-6 currency">{totals[1].toFixed(2)}</div>
      <div class="col-6 currency">
        {noZero((totals[0] - totals[1]).toFixed(2))}
      </div>
    </div>,
    report
  );
  return report;
}

function printSummary(ledgers: (Ledger & { id: any })[]) {
  const totals: Record<string, { debit: number; credit: number }> = {};
  ledgers.forEach((l) => {
    l.items.forEach((item) => {
      totals[item.account] = totals[item.account] || { debit: 0, credit: 0 };
      if (item.amount < 0) {
        totals[item.account].credit -= item.amount;
      } else {
        totals[item.account].debit += item.amount;
      }
    });
  });

  let grandTotal = 0;
  const reportItems = Object.keys(totals)
    .sort()
    .map((account) => {
      const total = totals[account];
      grandTotal += total.debit - total.credit;
      return (
        <div>
          <div class="col-1-4">{account}</div>
          <div class="currency col-5">{noZero(total.debit.toFixed(2))}</div>
          <div class="currency col-6">{noZero(total.credit.toFixed(2))}</div>
        </div>
      );
    });
  const report = (
    <div class="grid-6 col-1-6">
      <div class="col-1-4 line">Account</div>
      <div class="col-5 line currency">Debit</div>
      <div class="col-6 line currency">Credit</div>
    </div>
  );
  reportItems.forEach((item) => moveChildren(item, report));
  moveChildren(
    <div>
      <div class="col-1-6 line"></div>
      <div class="col-1-6 vspacer-2"></div>
      <div class="col-1-4">Imbalance</div>
      <div class="currency col-6 bold">{noZero(grandTotal.toFixed(2))}</div>
    </div>,
    report
  );
  return report;
}

export function createGeneralLedgerGrid(ledgerModel?: Ledger & { id: string }) {
  const ledger: HTMLFormElement = (
    <form class="grid-6">
      <input hidden name="id" value={ledgerModel?.id || ""} />
      <datalist id="listOfAccounts">
        <option>AP</option>
        <option>AR</option>
        <option>CASH</option>
        <option>MOM/DAD</option>
        <option>INVENTORY</option>
      </datalist>
      <div class="date col-1">Date</div>
      <input
        class="col-2-5"
        name="date"
        required
        type="date"
        placeholder="date"
        value={ledgerModel?.date || asDateString()}
      />
      <label class="col-1">Batch Summary</label>
      <textarea
        name="description"
        class="col-2-5 comments"
        placeholder="Describe the context for these entries"
      ></textarea>
      <div class="vspacer col-1-6"></div>
      <div class="text col-1-2">Account</div>
      <div class="currency col-3-2">Debit (+)</div>
      <div class="currency col-5-2">Credit (-)</div>
      <div class="line col-1-6"></div>
      <div class="vspacer"></div>
      <div id="end-of-line-items" class="vspacer-2 col-1-6"></div>
      <button class="button col-1" type="button" data-event="add-row">
        Add Row
      </button>
      <div class="vspacer-1 col-1-6"></div>
      <div class="currency col-2-2">Total Debit</div>
      <input
        readonly
        type="number"
        class="currency col-4-3"
        name="total_debit"
        value="0.00"
      />
      <div class="currency col-2-2">Total Credit</div>
      <input
        type="number"
        readonly
        class="currency col-4-3"
        name="total_credit"
        value="0.00"
      />
      <div class="currency col-2-2">Imbalance</div>
      <input
        readonly
        type="number"
        class="currency col-4-3"
        name="total_error"
        value="0.00"
      />
      <div class="col-1-6 flex">
        <button class="button col-1" type="button" data-event="submit">
          Save
        </button>
        <button class="button col-1" type="button" data-event="clear">
          Clear
        </button>
        <button class="button col-1" type="button" data-event="print">
          Save and Print
        </button>
        <button class="button col-1" type="button" data-event="print-all">
          Show All
        </button>
      </div>
      <div class="vspacer-2 col-1-6"></div>
      <div class="section-title col-1-6">Summary</div>
      <div class="vspacer-2 col-1-6"></div>
      <div id="summary-area" class="vspacer-2 col-1-6"></div>
    </form>
  );
  if (ledgerModel) {
    const lineItems = ledger.querySelector("#end-of-line-items") as HTMLElement;
    ledger["date"].value = asDateString(
      new Date(ledgerModel.date || ledgerModel.items[0]["date"])
    );
    ledger["description"].value = ledgerModel.description;
    ledgerModel.items.forEach((item) => {
      const row = createRow();
      row["account"].value = item.account;
      if (item.amount < 0) {
        row["credit"].value = asCurrency(-item.amount);
      } else {
        row["debit"].value = asCurrency(item.amount);
      }
      row["comment"].value = item.comment;
      moveChildrenBefore(row, lineItems);
    });
  } else {
    ledger.dispatchEvent(new Event("add-row"));
  }
  hookupTriggers(ledger);
  hookupHandlers(ledger);
  ledger.dispatchEvent(new Event("change"));
  return ledger;
}
