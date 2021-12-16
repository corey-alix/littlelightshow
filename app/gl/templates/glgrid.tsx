import { dom } from "../../dom.js";
import { moveChildren, moveChildrenBefore } from "../../fun/dom.js";
import {
  Ledger,
  LedgerItem,
  save as saveLedger,
  ledgers as loadAllLedgers,
} from "../../services/gl.js";

function asModel(form: HTMLFormElement) {
  const result: Ledger = { items: [] };
  const data = new FormData(form);
  const batchDate = data.get("date") as string;
  result.description = (data.get("description") as string) || "";

  let currentItem: LedgerItem;
  for (let [key, value] of data.entries()) {
    switch (key) {
      case "account":
        currentItem = {} as any;
        result.items.push(currentItem);
        currentItem.date = new Date(batchDate).valueOf();
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

function currentDay(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function setCurrency(input: HTMLInputElement, value: number) {
  if (!input) throw "no input found";
  input.value = (value || 0).toFixed(2);
}

function sum(values: Array<number>) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0);
}

function asNumber(node: Element) {
  return (node as HTMLInputElement).valueAsNumber || 0;
}

function hookupTriggers(domNode: HTMLElement) {
  domNode.querySelectorAll("[data-event]").forEach((eventItem) => {
    eventItem.addEventListener("click", () => {
      const eventName = (eventItem as HTMLInputElement).dataset["event"];
      if (!eventName) throw "item must define a data-event";
      domNode.dispatchEvent(new Event(eventName));
    });
  });
}

function hookupHandlers(domNode: HTMLFormElement) {
  const lineItems = domNode.querySelector("#end-of-line-items") as HTMLElement;

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
  });

  domNode.addEventListener("print-all", async () => {
    const ledgers = await loadAllLedgers();
    const report1 = printDetail(ledgers);
    const report2 = printSummary(ledgers);
    document.body.innerHTML = "<h1>Little Light Show General Ledger</h1>";
    document.body.appendChild(report1);
    document.body.appendChild(<div class="vspacer-2"></div>);
    document.body.appendChild(report2);
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

  domNode.addEventListener("submit", async () => {
    if (!domNode.reportValidity()) return;
    if (0 !== asNumber(domNode["total_error"]))
      alert("Total error must be zero");
    const model = asModel(domNode);
    await saveLedger(model);
    location.reload();
  });

  domNode.addEventListener("add-row", () => {
    const tr: HTMLElement = (
      <div>
        <input
          class="col-1"
          name="account"
          required
          type="text"
          placeholder="account"
          list="listOfAccounts"
        />
        <input
          name="debit"
          class="currency col-2"
          type="number"
          step="0.01"
          placeholder="debit"
        />
        <input
          name="credit"
          class="currency col-3"
          type="number"
          step="0.01"
          placeholder="credit"
        />
        <input
          name="comment"
          class="text col-4-3"
          type="text"
          placeholder="comment"
        />
      </div>
    );

    const focus = tr.querySelector("[name=account]") as HTMLElement;
    moveChildrenBefore(tr, lineItems);
    focus.focus();
  });
}

function printDetail(ledgers: (Ledger & { id: any })[]) {
  const report: HTMLElement = (
    <div class="grid-6">
      <div class="col-1 date">Date</div>
      <div class="col-2 text">Account</div>
      <div class="col-3 currency">Debit</div>
      <div class="col-4 currency">Credit</div>
      <div class="col-5-2 text">Comment</div>
      <div class="line col-1-6"></div>
    </div>
  );
  const totals = [0, 0];
  const items = ledgers
    .map((l) => l.items)
    .flat(1)
    .sort((a, b) => a.date - b.date);

  items.forEach((item) => {
    const amount = item.amount;
    const debit = amount >= 0 && amount;
    const credit = amount < 0 && -amount;
    totals[0] += debit || 0;
    totals[1] += credit || 0;
    const lineitem = (
      <div>
        <div class="col-1 date">{currentDay(new Date(item.date))}</div>
        <div class="col-2 text">{item.account}</div>
        <div class="col-3 currency">{debit && debit.toFixed(2)}</div>
        <div class="col-4 currency">{credit && credit.toFixed(2)}</div>
        <div class="col-5-2 text">{item.comment}</div>
      </div>
    );
    moveChildren(lineitem, report);
  });
  moveChildren(
    <div>
      <div class="line col-1-6"></div>
      <div class="col-3 currency">{totals[0].toFixed(2)}</div>
      <div class="col-4 currency">{totals[1].toFixed(2)}</div>
      <div class="col-6 currency">{(totals[0] - totals[1]).toFixed(2)}</div>
    </div>,
    report
  );
  return report;
}

function printSummary(ledgers: (Ledger & { id: any })[]) {
  const totals: Record<string, number> = {};
  ledgers.forEach((l) => {
    l.items.forEach((item) => {
      console.log(item);
      totals[item.account] = (totals[item.account] || 0) + item.amount;
    });
  });

  let grandTotal = 0;
  const reportItems = Object.keys(totals)
    .sort()
    .map((account) => {
      const total = totals[account];
      grandTotal += total;
      return (
        <div>
          <div class="col-1-3">{account}</div>
          <div class="currency col-4-3">{total.toFixed(2)}</div>
        </div>
      );
    });
  const report = (
    <div class="grid-6 col-1-6">
      <div class="col-1-5 line">Account</div>
      <div class="currency col-6 line bold">{grandTotal.toFixed(2)}</div>
    </div>
  );
  reportItems.forEach((item) => moveChildren(item, report));
  return report;
}

export function createGeneralLedgerGrid() {
  const ledger: HTMLFormElement = (
    <form class="grid-6">
      <datalist id="listOfAccounts">
        <option>AP</option>
        <option>AR</option>
        <option>CASH</option>
        <option>MOM/DAD</option>
        <option>INVENTORY</option>
      </datalist>
      <div class="date col-1">Date</div>
      <label class="col-2-5">Batch Summary</label>
      <input
        class="col-1"
        name="date"
        required
        type="date"
        placeholder="date"
        value={currentDay()}
      />
      <textarea
        name="description"
        class="col-2-5"
        placeholder="Describe the context for these entries"
      ></textarea>
      <div class="vspacer col-1-6"></div>
      <div class="text col-1">Account</div>
      <div class="currency col-2">Debit (+)</div>
      <div class="currency col-3">Credit (-)</div>
      <div class="text col-4-3">Comment</div>
      <div class="line col-1-6"></div>
      <div class="vspacer"></div>
      <div id="end-of-line-items" class="vspacer col-1-6"></div>

      <button class="button col-1" type="button" data-event="add-row">
        Add Row
      </button>

      <div class="vspacer-1 col-1-6"></div>
      <button class="button col-1" type="button" data-event="submit">
        Save
      </button>
      <div class="currency col-2-2">Total Debit</div>
      <input
        readonly
        type="number"
        class="currency col-4-3"
        name="total_debit"
        value="0.00"
      />
      <button class="button col-1" type="button" data-event="print-summary">
        Print Summary
      </button>
      <div class="currency col-2-2">Total Credit</div>
      <input
        type="number"
        readonly
        class="currency col-4-3"
        name="total_credit"
        value="0.00"
      />
      <button class="button col-1" type="button" data-event="print-all">
        Print Details
      </button>
      <div class="currency col-2-2">Imbalance</div>
      <input
        readonly
        type="number"
        class="currency col-4-3"
        name="total_error"
        value="0.00"
      />
    </form>
  );
  hookupTriggers(ledger);
  hookupHandlers(ledger);
  ledger.dispatchEvent(new Event("add-row"));
  return ledger;
}
