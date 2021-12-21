import faunadb from "faunadb";
export const TAXRATE = 0.06;

export const isDebug =
  location.href.includes("localhost");

export const isOffline = false;

export const primaryContact = {
  companyName: "Little Light Show",
  fullName: "Nathan Alix",
  addressLine1: "4 Andrea Lane",
  addressLine2: "Greenville, SC 29615",
};

const accessKeys = {
  FAUNADB_SERVER_SECRET: "",
  FAUNADB_ADMIN_SECRET: "",
  FAUNADB_DOMAIN: "db.us.fauna.com",
};

if (globalThis.process?.env) {
  accessKeys.FAUNADB_SERVER_SECRET =
    process.env
      .FAUNADB_SERVER_SECRET as string;
  accessKeys.FAUNADB_ADMIN_SECRET =
    process.env
      .FAUNADB_ADMIN_SECRET as string;
} else if (localStorage) {
  accessKeys.FAUNADB_SERVER_SECRET =
    localStorage.getItem(
      "FAUNADB_SERVER_SECRET"
    ) as string;
  accessKeys.FAUNADB_ADMIN_SECRET =
    localStorage.getItem(
      "FAUNADB_ADMIN_SECRET"
    ) as string;

  if (
    !accessKeys.FAUNADB_SERVER_SECRET
  ) {
    const secret =
      prompt(
        "Provide the FAUNADB_SERVER_SECRET"
      ) || "";
    accessKeys.FAUNADB_SERVER_SECRET =
      secret;
    localStorage.setItem(
      "FAUNADB_SERVER_SECRET",
      secret
    );
  }

  if (!accessKeys.FAUNADB_SERVER_SECRET)
    console.error(
      "set FAUNADB_SERVER_SECRET in local storage"
    );
  if (!accessKeys.FAUNADB_ADMIN_SECRET)
    console.error(
      "set FAUNADB_ADMIN_SECRET in local storage"
    );
}

function isNetlifyBuildContext() {
  return (
    0 <=
    location.href.indexOf("netlify")
  );
}

export const domain =
  accessKeys.FAUNADB_DOMAIN;
export const FAUNADB_SERVER_SECRET =
  accessKeys.FAUNADB_SERVER_SECRET;
export const FAUNADB_ADMIN_SECRET =
  accessKeys.FAUNADB_ADMIN_SECRET;
export const CONTEXT =
  isNetlifyBuildContext()
    ? "NETLIFY"
    : "dev";
export const CURRENT_USER =
  localStorage.getItem("user");

export function createClient() {
  return new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET,
    domain,
  });
}
