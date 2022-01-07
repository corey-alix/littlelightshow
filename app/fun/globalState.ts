let globalState: Record<string, any>;
function forceGlobalState() {
  return (globalState =
    globalState ||
    JSON.parse(
      localStorage.getItem(
        "__GLOBAL_STATE__"
      ) || "{}"
    ));
}

export function setGlobalState(
  key: string,
  value: any
) {
  const state = forceGlobalState();
  const [head, ...tail] =
    key.split(".");
  if (!tail.length) {
    state[key] = value;
  } else {
    let o = (state[head] =
      state[head] || {});
    tail.forEach(
      (k) => (o[k] = o[k] || {})
    );
    o[tail[tail.length - 1]] = value;
  }
  localStorage.setItem(
    "__GLOBAL_STATE__",
    JSON.stringify(state)
  );
}

export function getGlobalState<T>(
  key: string
): T | null {
  const state = forceGlobalState();
  const [head, ...tail] =
    key.split(".");
  if (!tail.length)
    return state[head] as T;

  let value = state[head];
  if (
    !!value &&
    typeof value !== "object"
  )
    throw `key does not define an object: ${head}`;
  tail.every(
    (k) =>
      typeof value === "object" &&
      (value = value[k]) &&
      true
  );
  return value;
}
