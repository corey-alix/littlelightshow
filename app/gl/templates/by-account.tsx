import { dom } from "../../dom.js";
import { execute } from "../../fql/gl-by-account.js";
import { asCurrency } from "../../fun/asCurrency.js";
import { moveChildrenBefore } from "../../fun/dom.js";
import { noZero } from "../../fun/isZero.js";
import { routes } from "../../router.js";

export async function create(
  account: string
) {
  const items = await execute({
    account,
  });

  if (!items.length)
    return <div>No items found</div>;

  let runningBalance = 0;
  const rows = items.map((item) => {
    runningBalance += item.child.amount;
    return (
      <div>
        <div class="currency col-1">
          {asCurrency(
            item.child.amount
          )}
        </div>
        <div class="col-2">
          {item.child.comment}
        </div>
        <div class="col-3-4">
          <a
            href={routes.editLedger(
              item.parent.id!
            )}
          >
            {item.parent.description ||
              "no comment"}
          </a>
        </div>
        <div class="currency col-7">
          {noZero(
            asCurrency(runningBalance)
          )}
        </div>
      </div>
    );
  });

  const result = (
    <div>
      <h1>{`Ledger Entries for ${account}`}</h1>
      <div class="grid-6">
        <div class="currency col-1">
          Amount
        </div>
        <div class="col-2-5">
          Comment
        </div>
        <div class="col-7">Balance</div>
        <div class="placeholder line-items" />
      </div>
    </div>
  ) as HTMLElement;

  const placeholder =
    result.querySelector(
      ".placeholder"
    )!;
  rows.forEach((item) =>
    moveChildrenBefore(
      item,
      placeholder
    )
  );

  return result;
}
