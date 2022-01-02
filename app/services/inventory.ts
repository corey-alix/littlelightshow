import { StorageModel } from "./StorageModel";

const INVENTORY_TABLE = "inventory";

export interface Inventory {
  id?: string;
  code: string;
  price: number;
  taxrate: number;
}

export class InventoryModel extends StorageModel<Inventory> {
  async upgradeTo104(): Promise<void> {
    // clear temporary id values
    const deleteTheseItems = this.cache
      .get()
      .filter(
        (i) => i.id && i.id === i.code
      )
      .map((i) => i.id!);
    deleteTheseItems.forEach((id) =>
      this.cache.deleteLineItem(id)
    );
  }
}

export const inventoryModel =
  new InventoryModel({
    tableName: INVENTORY_TABLE,
    offline: false,
  });

export async function forceDatalist() {
  let dataList = document.querySelector(
    `#inventory_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList =
    document.createElement("datalist");
  dataList.id = "inventory_list";
  const items =
    await inventoryModel.getItems();
  items.forEach((item) => {
    const option =
      document.createElement("option");
    option.value = item.code;
    dataList.appendChild(option);
  });
  document.body.appendChild(dataList);
  return dataList;
}
