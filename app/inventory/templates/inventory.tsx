import { dom } from "../../dom.js";
import {
  asCurrency,
  asQuantity,
} from "../../fun/asCurrency.js";
import { asNumber } from "../../fun/asNumber.js";
import { moveChildrenBefore } from "../../fun/dom.js";
import { noZero } from "../../fun/isZero.js";
import { routes } from "../../router.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItems: Inventory[]
): HTMLElement {
  const report = (
    <div class="grid-6">
      <div class="col-1-3 line">
        Item Code
      </div>
      <div class="col-4 line quantity">
        Qty
      </div>
      <div class="col-5 line currency">
        Price
      </div>
      <div class="col-6 line value">
        Value
      </div>
      <div class="col-7 line taxrate">
        Tax Rate
      </div>
      <div class="placeholder lineitems"></div>
    </div>
  ) as HTMLElement;

  const lineItems = inventoryItems.map(
    (item) => {
      return (
        <div>
          <div class="col-1-3">
            <a
              href={routes.inventory(
                item.id!
              )}
            >
              {item.code}
            </a>
          </div>
          <div class="col-4 quantity">
            {asQuantity(item.quantity)}
          </div>
          <div class="col-5 currency">
            {asCurrency(item.price)}
          </div>
          <div class="col-6 currency">
            {noZero(
              asCurrency(
                item.price *
                  (item.quantity - 0)
              )
            )}
          </div>
          <div class="col-7 taxrate">
            {asTaxRate(item.taxrate)}
          </div>
          <div class="col-1-last text smaller">
            {item.description || ""}
          </div>
        </div>
      );
    }
  );

  const lineItemTarget =
    report.querySelector(
      ".lineitems.placeholder"
    )!;
  lineItems.forEach((i) =>
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
