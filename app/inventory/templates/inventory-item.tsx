import { dom } from "../../dom.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItem: Inventory
): HTMLFormElement {
  if (!inventoryItem)
    return <form>Item not found</form>;
  return (
    <form class="grid-6">
      <div class="col-1-4 line">
        Item Code
      </div>
      <div class="col-5 line currency">
        Price
      </div>
      <div class="col-last line taxrate">
        Tax Rate
      </div>
      <input
        class="col-1-4 trim text"
        name="code"
        type="text"
        value={inventoryItem.code}
      />
      <input
        class="col-5 currency"
        name="price"
        type="number"
        value={inventoryItem.price}
      />
      <input
        class="col-last taxrate"
        name="taxrate"
        type="number"
        value={inventoryItem.taxrate}
      />
      <div class="col-1-last line">
        Description
      </div>
      <input
        class="col-1-last text trim"
        name="description"
        type="text"
        value={
          inventoryItem.description ||
          inventoryItem.code
        }
      />
      <button
        class="bold button col-1"
        data-event="submit"
      >
        Save
      </button>
      <button
        class="bold button col-6"
        data-event="delete"
      >
        Delete
      </button>
    </form>
  );
}
