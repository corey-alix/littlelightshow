import { StorageModel } from "./StorageModel.js";

const ACCOUNT_TABLE = "accounts";

interface Account {
  id?: string;
  code: string;
}

export const accountModel =
  new StorageModel<Account>({
    tableName: ACCOUNT_TABLE,
    maxAge: Number.MAX_SAFE_INTEGER,
    offline: true,
  });

export async function forceDatalist() {
  let dataList = document.querySelector(
    `#listOfAccounts`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList =
    document.createElement("datalist");
  dataList.id = "listOfAccounts";
  const items =
    await accountModel.getItems();

  items
    .sortBy({ code: "string" })
    .forEach((item) => {
      const option =
        document.createElement(
          "option"
        );
      option.value = item.code;
      dataList.appendChild(option);
    });
  document.body.appendChild(dataList);
  return dataList;
}
