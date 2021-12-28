import { setMode } from "./fun/setMode";
import {
  getGlobalState,
  setGlobalState,
} from "./globals";

export function init() {
  setMode();
  setInitialState();
}

function setInitialState() {
  const taxRate =
    getGlobalState("TAX_RATE")?.value ||
    null;
  if (null == taxRate)
    setGlobalState("TAX_RATE", 6.0);
}
