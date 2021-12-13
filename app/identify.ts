import { CONTEXT } from "./globals.js";

export function identify() {
  if (!localStorage.getItem("user")) {
    location.href = `identity.html?target=${location.href}&context=${CONTEXT}`;
    return false;
  }
  return true;
}
