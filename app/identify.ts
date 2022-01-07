import {
  CONTEXT,
  isOffline,
} from "./globals.js";
import { validate } from "./services/validateAccessToken.js";
import { routes } from "./router.js";
import { reportError } from "./ux/toasterWriter";
import { gotoUrl } from "./fun/gotoUrl";

export async function identify() {
  if (isOffline()) return false;
  if (!localStorage.getItem("user")) {
    gotoUrl(
      routes.identity({
        target: location.href,
        context: CONTEXT,
      })
    );
    return false;
  }
  return true;

  try {
    await validate();
  } catch (ex) {
    reportError(ex);
    return false;
  }

  return true;
}
