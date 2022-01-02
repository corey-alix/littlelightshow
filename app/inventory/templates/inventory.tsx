import { dom } from "../../dom.js";
import { asCurrency } from "../../fun/asCurrency.js";
import { moveChildrenBefore } from "../../fun/dom.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItems: Inventory[]
): HTMLElement {
  const report = (
    <div class="grid-6">
      <div class="col-1 line">
        Item Code
      </div>
      <div class="col-2 line currency">
        Price
      </div>
      <div class="col-3 line taxrate">
        Tax Rate
      </div>
      <div class="placeholder lineitems"></div>
    </div>
  ) as HTMLElement;

  const lineItems = inventoryItems.map(
    (item) => {
      return (
        <div>
          <div class="col-1">
            {item.code}
          </div>
          <div class="col-2 currency">
            {asCurrency(item.price)}
          </div>
          <div class="col-3 taxrate">
            {asTaxRate(item.taxrate)}
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
