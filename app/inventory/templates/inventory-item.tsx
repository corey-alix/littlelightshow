import { dom } from "../../dom.js";
import {
  asCurrency,
  asQuantity,
} from "../../fun/asCurrency.js";
import { noZero } from "../../fun/isZero.js";
import { globals } from "../../globals.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItem: Inventory
): HTMLFormElement {
  if (!inventoryItem)
    return <form>Item not found</form>;
  return (
    <form class="grid-6">
      <h1 class="centered col-1-last">
        {`Inventory form for ${globals.primaryContact.companyName}`}
      </h1>
      <div class="col-1-a line">
        Description
      </div>
      <input
        class="col-1-a text trim"
        name="description"
        placeholder="Long description"
        type="text"
        value={
          inventoryItem.description ||
          inventoryItem.code
        }
      />
      <div class="col-1-c line">
        Item Code
      </div>
      <div class="col-b line quantity">
        Qty
      </div>
      <div class="col-a line currency">
        Price
      </div>
      <input
        class="col-1-c trim text uppercase"
        name="code"
        type="text"
        placeholder="Short code"
        value={inventoryItem.code}
      />
      <input
        class="col-b quantity"
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={inventoryItem.quantity}
      />
      <input
        class="col-a currency"
        name="price"
        type="number"
        placeholder="Retail"
        value={noZero(
          asCurrency(
            inventoryItem.price
          )
        )}
      />
      <div class="col-a line taxrate">
        Tax Rate
      </div>
      <input
        class="col-a taxrate"
        name="taxrate"
        type="number"
        placeholder="taxrate"
        value={inventoryItem.taxrate}
      />
      <button
        class="bold button col-1"
        data-event="submit"
      >
        Save
      </button>
      <button
        class="button col-b"
        data-event="clear"
      >
        Clear
      </button>
      <button
        class="button col-a"
        data-event="delete"
      >
        Delete
      </button>
    </form>
  );
}
