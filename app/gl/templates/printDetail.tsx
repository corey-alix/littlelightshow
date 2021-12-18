import { dom } from "../../dom.js";
import { moveChildren } from "../../fun/dom.js";
import { Ledger } from "../../services/gl.js";
import { asDateString } from "../../fun/asDateString";
import { noZero } from "../../fun/isZero";
import { sort } from "../../fun/sort";

export function printDetail(ledgers: (Ledger & { id: any })[]) {
  ledgers = sort(ledgers, {
    date: "date",
    id: "number",
  }).reverse(); // clone and sort
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
    ledger.items.sortBy({ account: "string", amount: "gl" }).forEach((item) => {
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
