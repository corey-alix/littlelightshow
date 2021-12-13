class InventoryManager {
  inventory = JSON.parse(localStorage.getItem("inventory") || "{}") as Record<
    string,
    { code: string; price: number }
  >;

  getInventoryItemByCode(code: string) {
    if (this.inventory[code]) {
      return this.inventory[code].price;
    }
    return 0;
  }

  persistInventoryItem(inventoryItem: { code: string; price: number }) {
    this.inventory[inventoryItem.code] = inventoryItem;
  }

  persistInventoryItems() {
    localStorage.setItem("inventory", JSON.stringify(this.inventory));
  }
}

export const inventoryManager = new InventoryManager();
