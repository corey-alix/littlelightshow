class AccountManager {
  accounts: Record<
    string,
    { code: string }
  > = {};

  save() {
    localStorage.setItem(
      "accounts",
      JSON.stringify(this.accounts)
    );
  }

  reload() {
    this.accounts = JSON.parse(
      localStorage.getItem(
        "accounts"
      ) || "{}"
    );
  }
}

export const accountManager =
  new AccountManager();

accountManager.reload();

export function forceDatalist() {
  let dataList = document.querySelector(
    `#inventory_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList =
    document.createElement("datalist");
  dataList.id = "listOfAccounts";
  Object.entries(
    accountManager.accounts
  ).forEach(([key, value]) => {
    const option =
      document.createElement("option");
    option.value = key;
    dataList.appendChild(option);
  });
  document.body.appendChild(dataList);
  return dataList;
}
