import { dom } from "../../dom.js";
import { moveChildren } from "../../fun/dom.js";
import { Ledger } from "../../services/gl.js";
import { noZero } from "../../fun/isZero";

export function create(
  ledgers: Ledger[]
) {
  const totals: Record<
    string,
    { debit: number; credit: number }
  > = {};
  ledgers.forEach((l) => {
    l.items
      .sortBy({ account: "string" })
      .forEach((item) => {
        totals[item.account] = totals[
          item.account
        ] || { debit: 0, credit: 0 };
        if (item.amount < 0) {
          totals[item.account].credit -=
            item.amount;
        } else {
          totals[item.account].debit +=
            item.amount;
        }
      });
  });

  let grandTotal = 0;
  const reportItems = Object.keys(
    totals
  )
    .sort()
    .map((account) => {
      const total = totals[account];
      grandTotal +=
        total.debit - total.credit;
      return (
        <div>
          <div class="col-1-4">
            {account}
          </div>
          <div class="currency col-5">
            {noZero(
              total.debit.toFixed(2)
            )}
          </div>
          <div class="currency col-6">
            {noZero(
              total.credit.toFixed(2)
            )}
          </div>
        </div>
      );
    });
  const report = (
    <div class="grid-6 col-1-6">
      <div class="col-1-4 line">
        Account
      </div>
      <div class="col-5 line currency">
        Debit
      </div>
      <div class="col-6 line currency">
        Credit
      </div>
    </div>
  );
  reportItems.forEach((item) =>
    moveChildren(item, report)
  );
  moveChildren(
    <div>
      <div class="col-1-6 line"></div>
      <div class="col-1-6 vspacer-1"></div>
      <div class="col-1-4">
        Imbalance
      </div>
      <div class="currency col-6 bold">
        {grandTotal.toFixed(2)}
      </div>
    </div>,
    report
  );
  return report;
}
