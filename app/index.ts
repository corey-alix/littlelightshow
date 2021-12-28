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

const defaults = {
  TAX_RATE: 6,
  CACHE_MAX_AGE: 600,
  BATCH_SIZE: 64,
};

function setInitialState() {
  Object.keys(defaults).forEach(
    (key) => {
      const value =
        getGlobalState(key)?.value ||
        null;
      if (null == value)
        setGlobalState(
          key,
          defaults[key]
        );
    }
  );
}
