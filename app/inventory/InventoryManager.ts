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

export function forceDatalist() {
  let dataList = document.querySelector(
    `#inventory_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList = document.createElement("datalist");
  dataList.id = "inventory_list";
  Object.entries(inventoryManager.inventory).forEach(([key, value]) => {
    const option = document.createElement("option");
    option.value = key;
    dataList.appendChild(option);
  });
  document.body.appendChild(dataList);
  return dataList;
}
