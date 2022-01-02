import { CONTEXT } from "./globals.js";
import { validate } from "./services/validateAccessToken.js";
import { routes } from "./router.js";
import { reportError } from "./ux/Toaster.js";
import { gotoUrl } from "./fun/gotoUrl";

export async function identify() {
  if (!localStorage.getItem("user")) {
    gotoUrl(
      routes.identity({
        target: location.href,
        context: CONTEXT,
      })
    );
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
