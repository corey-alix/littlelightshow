import { StorageModel } from "./StorageModel";

const INVENTORY_TABLE = "inventory";

interface Inventory {
  id?: string;
  code: string;
  price: number;
  taxrate: number;
}

export const inventoryModel =
  new StorageModel<Inventory>({
    tableName: INVENTORY_TABLE,
    maxAge: Number.MAX_SAFE_INTEGER,
    offline: true,
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
