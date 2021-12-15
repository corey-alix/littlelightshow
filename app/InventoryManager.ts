class InventoryManager {
  inventory = JSON.parse(localStorage.getItem("inventory") || "{}") as Record<
    string,
    { code: string; price: number }
  >;

  getInventoryItemByCode(code: string) {
    return this.inventory[code];
  }

  persistInventoryItem(inventoryItem: { code: string; price: number }) {
    this.inventory[inventoryItem.code] = inventoryItem;
  }

  persistInventoryItems() {
    localStorage.setItem("inventory", JSON.stringify(this.inventory));
  }
}

export const inventoryManager = new InventoryManager();
