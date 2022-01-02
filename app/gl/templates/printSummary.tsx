import type { Ledger } from "../../services/gl.js";
import { dom } from "../../dom.js";
import { moveChildren } from "../../fun/dom.js";
import { noZero } from "../../fun/isZero";
import { routes } from "../../router.js";

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

  const grandTotal = {
    debit: 0,
    credit: 0,
  };
  const reportItems = Object.keys(
    totals
  )
    .sort()
    .map((account) => {
      const total = totals[account];
      grandTotal.debit += total.debit;
      grandTotal.credit += total.credit;
      return (
        <div>
          <div class="col-1-4">
            <a
              href={routes.gl.byAccount(
                account
              )}
            >
              {account}
            </a>
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
          <div class="currency col-7">
            {noZero(
              (
                total.debit -
                total.credit
              ).toFixed(2)
            )}
          </div>
        </div>
      );
    });
  const report = (
    <div class="grid-6 col-1-last">
      <div class="col-1-4 line">
        Account
      </div>
      <div class="col-5 line currency">
        Debit (+)
      </div>
      <div class="col-6 line currency">
        Credit (-)
      </div>
      <div class="col-7 line currency">
        Balance
      </div>
    </div>
  );
  reportItems.forEach((item) =>
    moveChildren(item, report)
  );
  moveChildren(
    <div>
      <div class="col-1-last line"></div>
      <div class="col-1-3">Totals</div>
      <div class="currency col-c">
        {grandTotal.debit.toFixed(2)}
      </div>
      <div class="currency col-b">
        {grandTotal.credit.toFixed(2)}
      </div>
      <div class="currency col-a bold">
        {(
          grandTotal.debit -
          grandTotal.credit
        ).toFixed(2)}
      </div>
    </div>,
    report
  );
  return report;
}
