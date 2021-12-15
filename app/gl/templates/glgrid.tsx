import { dom } from "../../dom.js";
import { Ledger, LedgerItem, save as saveLedger } from "../../services/gl.js";

function asModel(form: HTMLFormElement) {
  const result: Ledger = { items: [] };
  const data = new FormData(form);
  let currentItem: LedgerItem;
  for (let [key, value] of data.entries()) {
    switch (key) {
      case "date":
        currentItem = {} as any;
        result.items.push(currentItem);
        currentItem.date = new Date(value + "").valueOf();
        break;
      case "account":
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
    }
  }
  return result;
}

function currentDay() {
  const date = new Date();
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
  const tbody = domNode.querySelector("tbody") as HTMLElement;

  const [totalCredits, totalDebits, totalError] = [
    "total_credit",
    "total_debit",
    "total_error",
  ].map((name) => domNode.querySelector(`[name=${name}]`) as HTMLInputElement);

  domNode.addEventListener("change", () => {
    const debits = Array.from(tbody.querySelectorAll("[name=debit]")).map(
      asNumber
    );
    const credits = Array.from(tbody.querySelectorAll("[name=credit]")).map(
      asNumber
    );

    const debitTotal = sum(debits);
    const creditTotal = sum(credits);

    setCurrency(totalDebits, debitTotal);
    setCurrency(totalCredits, creditTotal);
    setCurrency(totalError, debitTotal - creditTotal);
  });

  domNode.addEventListener("submit", () => {
    if (!domNode.reportValidity()) return;
    if (0 !== asNumber(domNode["total_error"]))
      alert("Total error must be zero");
    const model = asModel(domNode);
    saveLedger(model);
  });

  domNode.addEventListener("add-row", () => {
    const tr: HTMLTableRowElement = (
      <tr>
        <td>
          <input
            name="date"
            required
            type="date"
            placeholder="date"
            value={currentDay()}
          />
        </td>
        <td>
          <input
            name="account"
            required
            type="text"
            placeholder="account"
            list="listOfAccounts"
          />
        </td>
        <td>
          <input
            name="debit"
            class="currency"
            type="number"
            placeholder="debit"
          />
        </td>
        <td>
          <input
            name="credit"
            class="currency"
            type="number"
            placeholder="credit"
          />
        </td>
      </tr>
    );

    tbody.appendChild(tr);
    (tr.querySelector("[name=account]") as HTMLElement).focus();
  });
}

export function createGeneralLedgerGrid() {
  const ledger: HTMLFormElement = (
    <form>
      <datalist id="listOfAccounts">
        <option>AP</option>
        <option>AR</option>
        <option>CASH</option>
        <option>MOM/DAD</option>
        <option>INVENTORY</option>
      </datalist>
      <table>
        <thead>
          <th class="date">Date</th>
          <th class="text">Account</th>
          <th class="currency">Debit (+)</th>
          <th class="currency">Credit (-)</th>
        </thead>
        <tfoot>
          <th></th>
          <th>
            <input
              readonly
              type="number"
              class="currency"
              name="total_error"
              value="0.00"
            />
          </th>
          <th>
            <input
              readonly
              type="number"
              class="currency"
              name="total_debit"
              value="0.00"
            />
          </th>
          <th>
            <input
              type="number"
              readonly
              class="currency"
              name="total_credit"
              value="0.00"
            />
          </th>
        </tfoot>
        <tbody></tbody>
      </table>
      <div class="vspacer-1"></div>
      <button class="button" type="button" data-event="add-row">
        Add Row
      </button>
      <button class="button" type="button" data-event="submit">
        Save
      </button>
    </form>
  );
  hookupTriggers(ledger);
  hookupHandlers(ledger);
  ledger.dispatchEvent(new Event("add-row"));
  return ledger;
}
