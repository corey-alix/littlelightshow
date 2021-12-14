import { CONTEXT } from "./globals.js";
import { validate } from "./services/validateAccessToken.js";

export async function identify() {
  try {
    await validate();
  } catch (ex) {
    localStorage.setItem("FAUNADB_SERVER_SECRET", "");
    console.log(ex);
    return false;
  }

  if (!localStorage.getItem("user")) {
    location.href = `identity.html?target=${location.href}&context=${CONTEXT}`;
    return false;
  }
  return true;
}
