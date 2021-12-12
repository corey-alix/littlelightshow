const accessKeys = {
  FAUNADB_SERVER_SECRET: "",
  FAUNADB_ADMIN_SECRET: "",
  FAUNADB_DOMAIN: "db.us.fauna.com",
};
if (globalThis.process?.env) {
  accessKeys.FAUNADB_SERVER_SECRET = process.env
    .FAUNADB_SERVER_SECRET as string;
  accessKeys.FAUNADB_ADMIN_SECRET = process.env.FAUNADB_ADMIN_SECRET as string;
} else if (localStorage) {
  accessKeys.FAUNADB_SERVER_SECRET = localStorage.getItem(
    "FAUNADB_SERVER_SECRET"
  ) as string;
  accessKeys.FAUNADB_ADMIN_SECRET = localStorage.getItem(
    "FAUNADB_ADMIN_SECRET"
  ) as string;

  if (!accessKeys.FAUNADB_SERVER_SECRET)
    throw "set FAUNADB_SERVER_SECRET in local storage";
  if (!accessKeys.FAUNADB_ADMIN_SECRET)
    throw "set FAUNADB_ADMIN_SECRET in local storage";
}

function isNetlifyBuildContext() {
  return !!globalThis.process?.env.DEPLOY_PRIME_URL;
}

export const domain = accessKeys.FAUNADB_DOMAIN;
export const FAUNADB_SERVER_SECRET = accessKeys.FAUNADB_SERVER_SECRET;
export const FAUNADB_ADMIN_SECRET = accessKeys.FAUNADB_ADMIN_SECRET;
export const CONTEXT = isNetlifyBuildContext() ? "NETLIFY" : "dev";
