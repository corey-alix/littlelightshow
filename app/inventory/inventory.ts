import { init as systemInit } from "../index.js";
import { inventoryModel } from "../services/inventory.js";
import { create as showInventoryItems } from "./templates/inventory.js";

export async function init(
  target = document.body
) {
  await systemInit();
  const inventoryItems =
    await inventoryModel.getItems();
  const report =
    await showInventoryItems(
      inventoryItems.sortBy({
        code: "string",
      })
    );
  target.appendChild(report);
}
