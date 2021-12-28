import { setMode } from "./fun/setMode";
import {
  getGlobalState,
  setGlobalState,
} from "./globals";
import { identify } from "./identify";

export async function init() {
  setMode();
  setInitialState();
  await identify();
}

function setInitialState() {
  const taxRate =
    getGlobalState("TAX_RATE")?.value ||
    null;
  if (null == taxRate)
    setGlobalState("TAX_RATE", 6.0);
}
