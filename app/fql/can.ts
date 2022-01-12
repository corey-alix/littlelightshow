import { roles } from "../data/roles.js";

import { getGlobalState } from "../fun/globalState";
import {
  accessControlStore,
  Permission,
} from "../services/accesscontrol";
import { reportError } from "../ux/toasterWriter";

const USER_ROLE =
  getGlobalState<keyof typeof roles>(
    "USER_ROLE"
  ) || "public";

const defaults = roles[USER_ROLE];

export async function can(
  code: string
) {
  const accessControlItems =
    await accessControlStore.getItems();

  const [noun, verb] = code
    .split(":")
    .reverse();

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

  const item = accessControlItems.find(
    (i) =>
      i.code === noun &&
      i.role === USER_ROLE
  );

  if (!!item) {
    if (!verb || verb === "any")
      return (
        item.permission >
        Permission.none
      );
    return (
      permission ==
      (item.permission & permission)
    );
  }
  try {
    let effectivePermission =
      defaults && defaults[noun];

    if (
      typeof effectivePermission !==
      "number"
    )
      effectivePermission = permission;

    await accessControlStore.upsertItem(
      {
        code: noun,
        permission: effectivePermission,
        role: USER_ROLE,
      }
    );
    return can(code);
  } catch (ex) {
    reportError(ex);
    return false;
  }
}
