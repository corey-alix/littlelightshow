import { Toaster } from "./Toaster";
import { logStore } from "../services/log.js";

const toaster = new Toaster();

export function toast(
  message: string,
  options?: { mode: string }
) {
  if (!options)
    options = { mode: "info" };
  console.info(message, options);
  toaster.toast({
    message,
    ...options,
  });
}

export function reportError(
  message: any
) {
  toast(message + "", {
    mode: "error",
  });
  logStore
    .upsertItem({ message })
    .catch((ex) => console.log(ex));
}
