import { dom } from "../../dom.js";
import { Inventory } from "../../services/inventory.js";

export function create(
  inventoryItem: Inventory
): HTMLFormElement {
  if (!inventoryItem)
    return <form>Item not found</form>;
  return (
    <form class="grid-6">
      <div class="col-1-c line">
        Item Code
      </div>
      <div class="col-b line currency">
        Price
      </div>
      <div class="col-a line taxrate">
        Tax Rate
      </div>
      <input
        class="col-1-c trim text"
        name="code"
        type="text"
        value={inventoryItem.code}
      />
      <input
        class="col-b currency"
        name="price"
        type="number"
        value={inventoryItem.price}
      />
      <input
        class="col-a taxrate"
        name="taxrate"
        type="number"
        value={inventoryItem.taxrate}
      />
      <div class="col-1-a line">
        Description
      </div>
      <input
        class="col-1-a text trim"
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
        class="button col-a"
        data-event="delete"
      >
        Delete
      </button>
    </form>
  );
}
