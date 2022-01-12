import { roles } from "../data/roles.js";

import { getGlobalState } from "../fun/globalState";
import {
  AccessControl,
  accessControlStore,
  Permission,
} from "../services/accesscontrol";
import { reportError } from "../ux/toasterWriter.js";

const USER_ROLE =
  getGlobalState<string>("USER_ROLE") ||
  "V";

const defaults = roles[USER_ROLE];

export async function can(
  code: string
) {
  const accessControlItems =
    await accessControlStore.getItems();

  return code
    .split("|")
    .map((v) => v.trim())
    .filter((v) => !!v)
    .some((code) =>
      canDo(code, accessControlItems)
    );
}

function canDo(
  code: string,
  accessControlItems: AccessControl[]
) {
  const [noun, verb] = code
    .split(":")
    .reverse();

  //if (noun === "diagnostics") debugger;

  let permission = Permission.full;
  switch (verb) {
    case "any":
      break;
    case "create":
      permission = Permission.create;
      break;
    case "delete":
      permission = Permission.delete;
      break;
    case "full":
      permission = Permission.full;
      break;
    case "none":
      permission = Permission.none;
      break;
    case "read":
      permission = Permission.read;
      break;
    case "update":
      permission = Permission.update;
      break;
  }

  let effectivePermission =
    defaults && defaults[noun];

  if (
    typeof effectivePermission !==
    "number"
  ) {
    const item =
      accessControlItems.find(
        (i) =>
          i.code === noun &&
          i.role === USER_ROLE
      );
    if (!!item) {
      effectivePermission =
        item.permission;
    } else {
      accessControlStore
        .upsertItem({
          role: USER_ROLE,
          code: noun,
          permission: Permission.none,
        })
        .catch((ex) => reportError(ex));
      return false;
    }
  }

  if (!verb || verb === "any")
    return (
      effectivePermission >
      Permission.none
    );
  return (
    permission ==
    (effectivePermission & permission)
  );
}
