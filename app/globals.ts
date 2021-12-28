import faunadb from "faunadb";
import { getGlobalState } from "./fun/globalState";

class GlobalModel {
  public readonly CURRENT_USER =
    localStorage.getItem("user");

  public readonly TAXRATE =
    0.01 *
    (getGlobalState<number>(
      "TAX_RATE"
    ) || 6.0);

  public readonly BATCH_SIZE =
    getGlobalState<number>(
      "BATCH_SIZE"
    ) || 10;

  public readonly primaryContact =
    Object.seal(
      getGlobalState<{
        companyName: string;
        fullName: string;
        addressLine1: string;
        addressLine2: string;
      }>("primaryContact") || {
        companyName:
          "Little Light Show",
        fullName: "Nathan Alix",
        addressLine1: "4 Andrea Lane",
        addressLine2:
          "Greenville, SC 29615",
      }
    );
}

export const globals =
  new GlobalModel();

export const isDebug =
  location.href.includes("localhost") ||
  location.search.includes("debug");

export const isOffline = () =>
  true ===
  getGlobalState<boolean>(
    "work_offline"
  );

const accessKeys = {
  FAUNADB_SERVER_SECRET: "",
  FAUNADB_ADMIN_SECRET: "",
  FAUNADB_DOMAIN: "db.us.fauna.com",
};

accessKeys.FAUNADB_SERVER_SECRET =
  localStorage.getItem(
    "FAUNADB_SERVER_SECRET"
  ) as string;
accessKeys.FAUNADB_ADMIN_SECRET =
  localStorage.getItem(
    "FAUNADB_ADMIN_SECRET"
  ) as string;

if (!accessKeys.FAUNADB_SERVER_SECRET) {
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

export function createClient() {
  return new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET,
    domain,
  });
}
