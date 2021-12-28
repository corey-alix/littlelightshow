import { setMode } from "./fun/setMode";
import { globals } from "./globals";
const { primaryContact } = globals;
import {
  getGlobalState,
  setGlobalState,
} from "./fun/globalState";
import { identify } from "./identify";

export async function init() {
  setMode();
  setInitialState({
    TAX_RATE: 6,
    CACHE_MAX_AGE: 600,
    BATCH_SIZE: 64,
    work_offline: true,
  });
  setInitialState({ primaryContact });
  await identify();
}

function setInitialState(
  data: Record<string, any>
) {
  Object.keys(data).forEach((key) => {
    const value =
      getGlobalState(key) || null;
    if (null == value)
      setGlobalState(key, data[key]);
  });
}
