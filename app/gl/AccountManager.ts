export function save(
  accounts: Record<
    string,
    { code: string }
  >
) {
  localStorage.setItem(
    "accounts",
    JSON.stringify(accounts)
  );
}

export function load() {
  return JSON.parse(
    localStorage.getItem("accounts") ||
      "{}"
  );
}

export function forceDatalist() {
  let dataList = document.querySelector(
    `#inventory_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList =
    document.createElement("datalist");
  dataList.id = "listOfAccounts";
  Object.entries(load())
    .sort()
    .forEach(([key, value]) => {
      const option =
        document.createElement(
          "option"
        );
      option.value = key;
      dataList.appendChild(option);
    });
  document.body.appendChild(dataList);
  return dataList;
}
