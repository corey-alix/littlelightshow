import { isDefined } from "../fun/get";
import {
  accessControlStore,
  Permission,
} from "../services/accesscontrol";
import { reportError } from "../ux/toasterWriter";

export async function can(
  code: string
) {
  const accessControlItems =
    await accessControlStore.getItems();

  const item = accessControlItems.find(
    (i) => i.code === code
  );

  if (!!item) {
    if (!isDefined(item.permission)) {
      debugger;
      item.permission = Permission.full;
      try {
        await accessControlStore.upsertItem(
          { ...item }
        );

        return true;
      } catch (ex) {
        reportError(ex);
        return false;
      }
    }
    return (
      item.permission > Permission.none
    );
  }
  try {
    await accessControlStore.upsertItem(
      {
        code: code,
        permission: Permission.full,
      }
    );
    return true;
  } catch (ex) {
    reportError(ex);
    return false;
  }
}
