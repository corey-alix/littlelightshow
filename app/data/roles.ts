import { Permission } from "../services/accesscontrol";

type roles =
  | "admin"
  | "batch-size"
  | "cache-age"
  | "fauna-api"
  | "inventory"
  | "invoice"
  | "ledger"
  | "map"
  | "maptiler-api"
  | "primary-contact"
  | "role"
  | "taxrate"
  | "todo"
  | "ux-theme"
  | "work-offline";

type AccessControlItems = Record<
  string,
  AccessControlRole
>;

type AccessControlRole = Record<
  roles,
  Permission
>;

function combine(
  ...roles: Partial<AccessControlRole>[]
) {
  const result = <AccessControlRole>{};
  roles.forEach((r1) =>
    Object.keys(r1).forEach(
      (k) =>
        (result[k] =
          (result[k] || 0) | r1[k])
    )
  );
  return result;
}

const r = Permission.read;
const u = Permission.update;
const ru =
  Permission.read + Permission.update;

const cru =
  Permission.read +
  Permission.create +
  Permission.update;

const crud =
  Permission.read +
  Permission.delete +
  Permission.create +
  Permission.update;

const none: AccessControlRole = {
  admin: 0,
  inventory: 0,
  invoice: 0,
  ledger: 0,
  map: 0,
  role: 0,
  taxrate: 0,
  todo: 0,
  "batch-size": 0,
  "cache-age": 0,
  "fauna-api": 0,
  "maptiler-api": 0,
  "primary-contact": 0,
  "ux-theme": 0,
  "work-offline": 0,
};

const user = combine(none, {
  map: r,
  "ux-theme": ru,
});

const clerk = combine(user, {
  inventory: r,
  invoice: r,
  ledger: cru,
  taxrate: ru,
  "work-offline": ru,
  todo: cru,
});

const zipTieTech = combine(user, {
  inventory: cru,
  invoice: cru,
  map: ru,
  taxrate: r,
  "primary-contact": ru,
  "ux-theme": ru,
  "work-offline": ru,
});

const admin = combine(user, {
  admin: ru,
  inventory: crud,
  invoice: crud,
  ledger: crud,
  map: crud,
  role: crud,
  taxrate: crud,
  "batch-size": crud,
  "cache-age": crud,
  "fauna-api": crud,
  "maptiler-api": crud,
  "primary-contact": crud,
  "ux-theme": crud,
  "work-offline": crud,
});

export const roles: AccessControlItems =
  {
    X: zipTieTech,
    Y: clerk,
    Z: admin,
  };
