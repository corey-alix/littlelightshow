import { dom } from "../../dom.js";
import {
  asCurrency,
  asQuantity,
} from "../../fun/asCurrency.js";
import { asNumber } from "../../fun/asNumber.js";
import { moveChildrenBefore } from "../../fun/dom.js";
import { noZero } from "../../fun/isZero.js";
import { sum } from "../../fun/sum.js";
import { routes } from "../../router.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItems: Inventory[]
): HTMLElement {
  const inventoryItem =
    inventoryItems.map((item) => {
      return (
        <div>
          <div class="col-1-4">
            <a
              href={routes.inventory(
                item.id!
              )}
            >
              {item.code}
            </a>
          </div>
          <div class="col-5 quantity">
            {asQuantity(item.quantity)}
          </div>
          <div class="col-6 currency">
            {asCurrency(item.price)}
          </div>
          <div class="col-7 currency">
            {noZero(
              asCurrency(
                item.price *
                  item.quantity
              )
            )}
          </div>
          <div class="col-8 taxrate">
            {asTaxRate(item.taxrate)}
          </div>
          <div class="col-1-last text smaller">
            {item.description || ""}
          </div>
        </div>
      );
    });

  const totalValue = sum(
    inventoryItems.map(
      (i) =>
        (i.quantity || 0) *
        (i.price || 0)
    )
  );

  const report = (
    <div class="grid-6">
      <div class="col-1-4 line">
        Item Code
      </div>
      <div class="col-5 line quantity">
        Qty
      </div>
      <div class="col-6 line currency">
        Price
      </div>
      <div class="col-7 line value">
        Value
      </div>
      <div class="col-8 line taxrate">
        Tax Rate
      </div>
      <div class="placeholder lineitems"></div>
      <div class="line col-1-last"></div>
      <div class="col-c-2">
        Total Value
      </div>
      <div class="col-a currency">
        {asCurrency(totalValue)}
      </div>
    </div>
  ) as HTMLElement;

  const lineItemTarget =
    report.querySelector(
      ".lineitems.placeholder"
    )!;
  inventoryItem.forEach((i) =>
    moveChildrenBefore(
      i,
      lineItemTarget
    )
  );
  return report;
}

function asTaxRate(v: number) {
  return v ? v.toFixed(2) : "0";
}
