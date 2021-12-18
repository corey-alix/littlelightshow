import { CONTEXT } from "./globals.js";
import { validate } from "./services/validateAccessToken.js";
import { routes } from "./router.js";

export async function identify() {
  try {
    await validate();
  } catch (ex) {
    localStorage.setItem("FAUNADB_SERVER_SECRET", "");
    routes.home();
    return false;
  }

  if (!localStorage.getItem("user")) {
    routes.identity({ target: location.href, context: CONTEXT });
    return false;
  }
  return true;
}
