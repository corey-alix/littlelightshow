import { StorageModel } from "./StorageModel";

const TABLE_NAME = "accesscontrol";

export enum Permission {
  none = 0,
  read = 1,
  update = 2,
  create = 4,
  delete = 8,
  full = 15,
}

export interface AccessControl {
  id?: string;
  code: string;
  permission: Permission;
  role: string;
}

/**
 * Inform the UX about user restrictions to enhance the experience
 * without needing server-side rendering
 */
export class AccessControlModel extends StorageModel<AccessControl> {}

export const accessControlStore =
  new AccessControlModel({
    tableName: TABLE_NAME,
    offline: true,
  });
