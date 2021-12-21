import { CONTEXT } from "./globals.js";
import { validate } from "./services/validateAccessToken.js";
import { routes } from "./router.js";

export async function identify() {
  if (!localStorage.getItem("user")) {
    location.href = routes.identity({
      target: location.href,
      context: CONTEXT,
    });
    return false;
  }

  try {
    await validate();
  } catch (ex) {
    localStorage.setItem(
      "FAUNADB_SERVER_SECRET",
      ""
    );
    routes.home();
    return false;
  }

  return true;
}
