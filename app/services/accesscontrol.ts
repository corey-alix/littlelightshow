import { StorageModel } from "./StorageModel";

const TABLE_NAME = "accesscontrol";

export enum Permission {
  none = 0,
  canRead = 1,
  canUpdate = 2,
  canCreate = 4,
  canDelete = 8,
  full = 15,
}

export interface AccessControl {
  id?: string;
  code: string;
  permission: Permission;
}

/**
 * Inform the UX about user restrictions to enhance the experience
 * without needing server-side rendering
 */
export class AccessControlModel extends StorageModel<AccessControl> {}

export const accessControlStore =
  new AccessControlModel({
    tableName: TABLE_NAME,
    offline: false,
  });
