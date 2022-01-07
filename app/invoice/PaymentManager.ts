const TABLE_NAME = "mops";

class Manager<
  T extends { id: string }
> {
  data = JSON.parse(
    localStorage.getItem(TABLE_NAME) ||
      "{}"
  ) as Record<string, T>;

  getItemByCode(code: string) {
    return this.data[code];
  }

  persistItem(item: T) {
    this.data[item.id] = item;
  }

  persistItems() {
    localStorage.setItem(
      TABLE_NAME,
      JSON.stringify(this.data)
    );
  }
}

export const manager = new Manager();
manager.persistItem({ id: "CASH" });
manager.persistItem({ id: "CHECK" });
manager.persistItems();

export function forceDatalist() {
  let dataList = document.querySelector(
    `#${TABLE_NAME}_list`
  ) as HTMLDataListElement;
  if (dataList) return dataList;
  dataList =
    document.createElement("datalist");
  dataList.id = `${TABLE_NAME}_list`;
  Object.entries(manager.data).forEach(
    ([key, value]) => {
      const option =
        document.createElement(
          "option"
        );
      option.value = key;
      dataList.appendChild(option);
    }
  );
  document.body.appendChild(dataList);
  return dataList;
}
