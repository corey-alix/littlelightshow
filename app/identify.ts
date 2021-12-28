import { CONTEXT } from "./globals.js";
import { validate } from "./services/validateAccessToken.js";
import { routes } from "./router.js";
import { reportError } from "./ux/Toaster.js";

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
    reportError(ex);
    return false;
  }

  return true;
}
