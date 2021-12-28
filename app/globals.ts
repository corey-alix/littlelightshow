import faunadb from "faunadb";
export const TAXRATE =
  0.01 *
  (getGlobalState<number>("TAX_RATE") ||
    6.0);
export const BATCH_SIZE =
  getGlobalState<number>(
    "BATCH_SIZE"
  ) || 10;

export const isDebug =
  location.href.includes("localhost") ||
  location.search.includes("debug");

export const isOffline = () =>
  true ===
  getGlobalState<boolean>(
    "work_offline"
  );

export const primaryContact =
  getGlobalState<string>(
    "primaryContact"
  ) || {
    companyName: "Little Light Show",
    fullName: "Nathan Alix",
    addressLine1: "4 Andrea Lane",
    addressLine2:
      "Greenville, SC 29615",
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

let globalState: Record<string, any>;

function forceGlobalState() {
  return (globalState =
    globalState ||
    JSON.parse(
      localStorage.getItem(
        "__GLOBAL_STATE__"
      ) || "{}"
    ));
}

export function setGlobalState(
  key: string,
  value: any
) {
  const state = forceGlobalState();
  const [head, ...tail] =
    key.split(".");
  if (!tail.length) {
    state[key] = value;
  } else {
    let o = (state[head] =
      state[head] || {});
    tail.forEach(
      (k) => (o[k] = o[k] || {})
    );
    o[tail[tail.length - 1]] = value;
  }
  localStorage.setItem(
    "__GLOBAL_STATE__",
    JSON.stringify(state)
  );
}

export function getGlobalState<T>(
  key: string
): T | null {
  const state = forceGlobalState();
  const [head, ...tail] =
    key.split(".");
  if (!tail.length)
    return state[head] as T;

  let value = state[head];
  if (
    !!value &&
    typeof value !== "object"
  )
    throw `key does not define an object: ${head}`;
  tail.every(
    (k) =>
      typeof value === "object" &&
      (value = value[k]) &&
      true
  );
  return value;
}
