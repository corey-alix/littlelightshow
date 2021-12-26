import { dom } from "../../dom.js";
import { moveChildrenBefore } from "../../fun/dom.js";
import {
  Ledger,
  LedgerItem,
  removeItem as deleteLedger,
  upsertItem as saveLedger,
  getItems as loadAllLedgers,
} from "../../services/gl.js";
import { asCurrency } from "../../fun/asCurrency";
import { asDateString } from "../../fun/asDateString";
import { sum } from "../../fun/sum";
import { asNumber } from "../../fun/asNumber";
import { setCurrency } from "../../fun/setCurrency";
import { hookupTriggers } from "../../fun/hookupTriggers";
import { routes } from "../../router.js";
import {
  on,
  trigger,
} from "../../fun/on.js";
import { create as printDetail } from "./printDetail";
import { create as printSummary } from "./printSummary";
import { isZero } from "../../fun/isZero";
import { forceDatalist } from "../../services/accounts.js";
import { extendNumericInputBehaviors } from "../../fun/behavior/form.js";
import { toast } from "../../ux/Toaster.js";

function asModel(
  form: HTMLFormElement
) {
  const result: Ledger & {
    id: string;
  } = {
    id: "",
    items: [],
    date: new Date().valueOf(),
  };
  const data = new FormData(form);
  result.id =
    (data.get("id") as string) || "";
  const batchDate = data.get(
    "date"
  ) as string;
  result.date = new Date(
    batchDate
  ).valueOf();

  result.description =
    (data.get(
      "description"
    ) as string) || "";

  let currentItem: LedgerItem;
  for (let [
    key,
    value,
  ] of data.entries()) {
    switch (key) {
      case "account":
        currentItem = {} as any;
        result.items.push(currentItem);
        currentItem!.account =
          value as string;
        break;
      case "debit":
        currentItem!.amount =
          (currentItem!.amount || 0) +
          parseFloat(
            (value as string) || "0"
          );
        break;
      case "credit":
        currentItem!.amount =
          (currentItem!.amount || 0) -
          parseFloat(
            (value as string) || "0"
          );
        break;
      case "comment":
        currentItem!.comment =
          value as string;
        break;
    }
  }

  // remove trivial items
  result.items = result.items
    .filter(
      (i) =>
        !isZero(i.amount.toFixed(2)) ||
        !!i.comment
    )
    .sortBy({ account: "string" });
  return result;
}

function hookupHandlers(
  domNode: HTMLFormElement
) {
  const lineItems =
    domNode.querySelector(
      "#end-of-line-items"
    ) as HTMLElement;
  const summaryArea =
    domNode.querySelector(
      "#summary-area"
    ) as HTMLElement;

  const [
    totalCredits,
    totalDebits,
    totalError,
  ] = [
    "total_credit",
    "total_debit",
    "total_error",
  ].map(
    (name) =>
      domNode.querySelector(
        `[name=${name}]`
      ) as HTMLInputElement
  );

  on(domNode, "change", () => {
    const debits = Array.from(
      domNode.querySelectorAll(
        "[name=debit]"
      )
    ).map(asNumber);
    const credits = Array.from(
      domNode.querySelectorAll(
        "[name=credit]"
      )
    ).map(asNumber);

    const debitTotal = sum(debits);
    const creditTotal = sum(credits);

    setCurrency(
      totalDebits,
      debitTotal
    );
    setCurrency(
      totalCredits,
      creditTotal
    );
    setCurrency(
      totalError,
      debitTotal - creditTotal
    );
    const ledger = asModel(domNode);
    const summaryReport = printSummary([
      ledger,
    ]);
    summaryArea.innerText = "";
    summaryArea.appendChild(
      summaryReport
    );
  });

  on(domNode, "print-all", async () => {
    location.href = routes.allLedgers();
  });

  on(domNode, "print", async () => {
    if (!domNode.reportValidity())
      return;
    if (
      0 !==
      asNumber(domNode["total_error"])
    ) {
      alert("Total error must be zero");
      return;
    }
    const model = asModel(domNode);
    await saveLedger(model);

    location.href = routes.printLedger(
      model.id
    );
  });

  on(
    domNode,
    "print-detail",
    async () => {
      const ledgers =
        await loadAllLedgers();
      const report: HTMLElement =
        printDetail(ledgers);
      document.body.innerHTML = "";
      document.body.appendChild(report);
    }
  );

  on(
    domNode,
    "print-summary",
    async () => {
      const ledgers =
        await loadAllLedgers();
      const report =
        printSummary(ledgers);
      document.body.innerHTML = "";
      document.body.appendChild(report);
    }
  );

  on(domNode, "clear", async () => {
    location.href =
      routes.createLedger();
  });

  on(domNode, "delete", async () => {
    const id = (
      domNode[
        "id"
      ] as any as HTMLInputElement
    ).value;
    await deleteLedger(id);
    location.href = routes.allLedgers();
  });

  on(domNode, "submit", async () => {
    if (!domNode.reportValidity())
      return;
    if (
      0 !==
      asNumber(domNode["total_error"])
    ) {
      alert("Total error must be zero");
      return;
    }
    const model = asModel(domNode);
    await saveLedger(model);
    toast(`saved ${model.id}`);
    location.href = routes.editLedger(
      model.id
    );
  });

  on(domNode, "add-row", () => {
    const row = createRow();
    extendNumericInputBehaviors(row);
    const focus = row.querySelector(
      "[name=account]"
    ) as HTMLElement;
    moveChildrenBefore(row, lineItems);
    focus.focus();
  });
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
        placeholder="debit"
      />
      <input
        name="credit"
        class="currency col-5-last"
        type="number"
        placeholder="credit"
      />
      <input
        name="comment"
        class="text col-1-last"
        type="text"
        placeholder="comment"
      />
      <div class="vspacer-1 col-1-last"></div>
    </form>
  );
}

export function create(
  ledgerModel?: Ledger
) {
  forceDatalist();
  const ledger: HTMLFormElement = (
    <form class="grid-6">
      <input
        hidden
        name="id"
        value={ledgerModel?.id || ""}
      />
      <div class="date col-1">Date</div>
      <input
        class="col-2-last"
        name="date"
        required
        type="date"
        placeholder="date"
        value={
          ledgerModel?.date ||
          asDateString()
        }
      />
      <label class="col-1">
        Batch Summary
      </label>
      <textarea
        name="description"
        class="col-2-last comments"
        placeholder="Describe the context for these entries"
      ></textarea>
      <div class="vspacer col-1-last"></div>
      <div class="text col-1-2">
        Account
      </div>
      <div class="currency col-3-2">
        Debit (+)
      </div>
      <div class="currency col-5-last">
        Credit (-)
      </div>
      <div class="line col-1-last"></div>
      <div
        id="end-of-line-items"
        class="hidden"
      ></div>
      <button
        class="button col-1-2"
        type="button"
        data-event="add-row"
      >
        Add Row
      </button>
      <button
        class="button col-last-2"
        type="button"
        data-event="submit"
      >
        Save
      </button>
      <button
        class="button col-6 if-desktop"
        type="button"
        data-event="delete"
      >
        Delete
      </button>
      <div class="vspacer col-1-last"></div>
      <div class="currency col-2-2">
        Total Debit
      </div>
      <input
        readonly
        type="number"
        class="currency col-4-last"
        name="total_debit"
        value="0.00"
      />
      <div class="currency col-2-2">
        Total Credit
      </div>
      <input
        type="number"
        readonly
        class="currency col-4-last"
        name="total_credit"
        value="0.00"
      />
      <div class="currency col-2-2">
        Imbalance
      </div>
      <input
        readonly
        type="number"
        class="currency col-4-last"
        name="total_error"
        value="0.00"
      />
      <div class="col-1-last vspacer-1"></div>
      <div class="col-1-last flex">
        <button
          class="button col-1 if-desktop"
          type="button"
          data-event="print"
        >
          Print
        </button>
        <button
          class="button col-1 if-desktop"
          type="button"
          data-event="clear"
        >
          Clear
        </button>
        <button
          class="button col-1 if-desktop"
          type="button"
          data-event="print-all"
        >
          Show All
        </button>
      </div>
      <div class="vspacer-2 col-1-last if-desktop"></div>
      <div class="section-title col-1-last">
        Summary
      </div>
      <div class="vspacer-2 col-1-last"></div>
      <div
        id="summary-area"
        class="col-1-last"
      ></div>
      <div class="vspacer-2 col-1-last"></div>
    </form>
  );
  if (ledgerModel) {
    const lineItems =
      ledger.querySelector(
        "#end-of-line-items"
      ) as HTMLElement;
    ledger["date"].value = asDateString(
      new Date(
        ledgerModel.date || Date.now()
      )
    );
    ledger["description"].value =
      ledgerModel.description;
    ledgerModel.items.forEach(
      (item) => {
        const row = createRow();
        row["account"].value =
          item.account;
        if (item.amount < 0) {
          row["credit"].value =
            asCurrency(-item.amount);
        } else {
          row["debit"].value =
            asCurrency(item.amount);
        }
        row["comment"].value =
          item.comment;
        moveChildrenBefore(
          row,
          lineItems
        );
      }
    );
  }
  hookupTriggers(ledger);
  hookupHandlers(ledger);
  extendNumericInputBehaviors(ledger);
  if (!ledgerModel)
    trigger(ledger, "add-row");

  trigger(ledger, "change");
  return ledger;
}
