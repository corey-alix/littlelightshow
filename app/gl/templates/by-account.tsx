import { dom } from "../../dom.js";
import { execute } from "../../fql/gl-by-account.js";
import { asCurrency } from "../../fun/asCurrency.js";
import { moveChildrenAfter } from "../../fun/dom.js";
import { routes } from "../../router.js";

export async function create(
  account: string
) {
  const items = await execute({
    account,
  });

  if (!items.length)
    return <div>No items found</div>;

  const rows = items.map((item) => (
    <div>
      <div class="currency col-1">
        {asCurrency(item.child.amount)}
      </div>
      <div class="col-2">
        {item.child.comment}
      </div>
      <div class="col-3-last">
        <a
          href={routes.editLedger(
            item.parent.id!
          )}
        >
          {item.parent.description ||
            "no comment"}
        </a>
      </div>
    </div>
  ));

  const result = (
    <div>
      <h1>{`Ledger Entries for ${account}`}</h1>
      <div class="grid-6">
        <div class="currency col-1">
          Amount
        </div>
        <div class="col-2-last">
          Comment
        </div>
        <div class="placeholder line-items" />
      </div>
    </div>
  ) as HTMLElement;

  const placeholder =
    result.querySelector(
      ".placeholder"
    )!;
  rows.forEach((item) =>
    moveChildrenAfter(item, placeholder)
  );

  return result;
}
