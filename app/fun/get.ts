export function isDefined(value: any) {
  return typeof value !== "undefined";
}

export function get(
  formDom: HTMLFormElement,
  key: string
) {
  if (!isDefined(formDom[key]))
    throw `form element not found: ${key}`;
  return formDom[key].value;
}
export function set(
  formDom: HTMLFormElement,
  values: object
) {
  const keys = Object.keys(values);
  keys.forEach((key) => {
    if (!isDefined(formDom[key]))
      throw `form element not found: ${key}`;
    formDom[key].value = values[key];
  });
}
