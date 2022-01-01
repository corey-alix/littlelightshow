import { setMode } from "./fun/setMode";
import { globals } from "./globals";
const { primaryContact } = globals;
import {
  getGlobalState,
  setGlobalState,
} from "./fun/globalState";
import { identify } from "./identify";
import { extendNumericInputBehaviors } from "./fun/behavior/form";
import { hookupTriggers } from "./fun/hookupTriggers";
import { injectLabels } from "./ux/injectLabels";

export async function init() {
  const domNode = document.body;
  setInitialState({
    TAX_RATE: 6,
    CACHE_MAX_AGE: 600,
    BATCH_SIZE: 64,
    work_offline: true,
  });
  setInitialState({ primaryContact });

  await identify();
  injectLabels(domNode);
  extendNumericInputBehaviors(domNode);
  hookupTriggers(domNode);
  setMode();
}

function setInitialState(
  data: Record<string, any>
) {
  Object.keys(data).forEach((key) => {
    const value = getGlobalState(key);
    if (isUndefined(value)) {
      setGlobalState(key, data[key]);
    }
  });
}

function isUndefined(value: any) {
  return typeof value === "undefined";
}
