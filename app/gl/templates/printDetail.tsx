import { dom } from "../../dom.js";
import { moveChildren } from "../../fun/dom.js";
import { Ledger } from "../../services/gl.js";
import { asDateString } from "../../fun/asDateString";
import { noZero } from "../../fun/isZero";
import { asCurrency } from "../../fun/asCurrency.js";

export function create(
  ledgers: Ledger[]
) {
  ledgers = ledgers
    .sortBy({
      date: "date",
      id: "number",
    })
    .reverse(); // clone and sort
  const report: HTMLElement = (
    <div class="grid-6">
      <div class="col-1-4 text">
        Account
      </div>
      <div class="col-5 currency">
        Debit
      </div>
      <div class="col-6-last currency">
        Credit
      </div>
      <div class="line col-1-last"></div>
    </div>
  );
  const totals = {
    debit: 0,
    credit: 0,
  };
  let priorDate: string = "";

  ledgers.forEach((ledger) => {
    ledger.items
      .sortBy({
        account: "string",
        amount: "gl",
      })
      .forEach((item) => {
        const amount = item.amount;
        const debit =
          amount >= 0 && amount;
        const credit =
          amount < 0 && -amount;
        totals.debit += debit || 0;
        totals.credit += credit || 0;
        let currentDate = asDateString(
          new Date(
            ledger.date || item["date"]
          )
        );
        const lineitem = (
          <div>
            {currentDate !=
              priorDate && (
              <div class="col-1-last date section-title">{`${(priorDate =
                currentDate)}`}</div>
            )}
            <div class="col-1-4 text">
              {item.account}
            </div>
            <div class="col-5 currency">
              {debit &&
                debit.toFixed(2)}
            </div>
            <div class="col-6-last currency">
              {credit &&
                credit.toFixed(2)}
            </div>
            <div class="col-1-6 text">
              <a
                href={`/app/gl/index.html?id=${ledger.id}`}
              >
                {item.comment ||
                  "no comment"}
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
      <div class="line col-1-last"></div>
      <div class="col-5 currency">
        {totals.debit.toFixed(2)}
      </div>
      <div class="col-6-last currency">
        {totals.credit.toFixed(2)}
      </div>
      <div class="col-4-2 align-right">
        {!!noZero(
          asCurrency(
            totals.debit - totals.credit
          )
        )
          ? "Imbalance"
          : ""}
      </div>
      <div class="col-6-last currency">
        {noZero(
          asCurrency(
            totals.debit - totals.credit
          )
        )}
      </div>
    </div>,
    report
  );
  return report;
}
