import { Permission } from "../services/accesscontrol";

type AccessId =
  | "admin"
  | "batchsize"
  | "cacheage"
  | "diagnostics"
  | "faunaapi"
  | "inventory"
  | "invoice"
  | "ledger"
  | "map"
  | "maptilerapi"
  | "primarycontact"
  | "role"
  | "taxrate"
  | "todo"
  | "uxtheme"
  | "workoffline";

type AccessControlItems = Record<
  string,
  AccessControlRole
>;

type AccessControlRole = Record<
  AccessId,
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
const cu =
  Permission.create + Permission.update;
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

const empty: AccessControlRole = {
  admin: 0,
  batchsize: 0,
  cacheage: 0,
  diagnostics: 0,
  faunaapi: 0,
  inventory: 0,
  invoice: 0,
  ledger: 0,
  map: 0,
  maptilerapi: 0,
  primarycontact: 0,
  role: 0,
  taxrate: 0,
  todo: 0,
  uxtheme: 0,
  workoffline: 0,
};

const user = combine(empty, {
  admin: r,
  diagnostics: r,
  faunaapi: cu,
  maptilerapi: cu,
  role: cru,
  uxtheme: ru,
});

const clerk = combine(user, {
  admin: r,
  inventory: r,
  invoice: r,
  ledger: cru,
  taxrate: ru,
  todo: cru,
  workoffline: ru,
});

const zipTieTech = combine(user, {
  admin: r,
  inventory: cru,
  invoice: cru,
  map: ru,
  primarycontact: ru,
  taxrate: r,
  uxtheme: ru,
  workoffline: ru,
});

const full: AccessControlRole = {
  admin: crud,
  batchsize: crud,
  cacheage: crud,
  diagnostics: crud,
  faunaapi: crud,
  inventory: crud,
  invoice: crud,
  ledger: crud,
  map: crud,
  maptilerapi: crud,
  primarycontact: crud,
  role: crud,
  taxrate: crud,
  todo: crud,
  uxtheme: crud,
  workoffline: crud,
};

export const roles: AccessControlItems =
  {
    V: empty,
    W: user,
    X: zipTieTech,
    Y: clerk,
    Z: full,
  };
