import faunadb from "faunadb";
import { getGlobalState } from "./fun/globalState";

class GlobalModel {
  #accessKeys = {
    FAUNADB_SERVER_SECRET:
      localStorage.getItem(
        "FAUNADB_SERVER_SECRET"
      ) as string,
    FAUNADB_DOMAIN: "db.us.fauna.com",
    MAPTILERKEY: localStorage.getItem(
      "MAPTILER_SERVER_SECRET"
    ) as string,
  };

  public readonly MAPTILERKEY =
    this.#accessKeys.MAPTILERKEY;

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
    ) || 1000;

  public readonly primaryContact =
    getGlobalState<{
      companyName: string;
      fullName: string;
      addressLine1: string;
      addressLine2: string;
      telephone: string;
    }>("primaryContact") || {
      companyName: "Little Light Show",
      fullName: "Nathan Alix",
      addressLine1: "4 Andrea Lane",
      addressLine2:
        "Greenville, SC 29615",
      telephone: "",
    };

  constructor() {
    if (
      !this.#accessKeys
        .FAUNADB_SERVER_SECRET
    ) {
      const secret =
        prompt(
          "Provide the FAUNADB_SERVER_SECRET"
        ) || "";
      this.#accessKeys.FAUNADB_SERVER_SECRET =
        secret;
      localStorage.setItem(
        "FAUNADB_SERVER_SECRET",
        secret
      );
    }
  }

  createClient() {
    return new faunadb.Client({
      secret:
        this.#accessKeys
          .FAUNADB_SERVER_SECRET,
      domain:
        this.#accessKeys.FAUNADB_DOMAIN,
    });
  }
}

export const globals =
  new GlobalModel();

export const createClient = () =>
  globals.createClient();

export const isDebug =
  location.href.includes("localhost") ||
  location.search.includes("debug");

export const isOffline = () =>
  true ===
  getGlobalState<boolean>(
    "work_offline"
  );

function isNetlifyBuildContext() {
  return (
    0 <=
    location.href.indexOf("netlify")
  );
}

export const CONTEXT =
  isNetlifyBuildContext()
    ? "NETLIFY"
    : "dev";
