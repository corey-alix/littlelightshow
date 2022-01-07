export function setFormValue(
  formDom: HTMLFormElement,
  name: string,
  value: string
) {
  const input = formDom[
    name
  ] as HTMLInputElement;
  if (!input)
    throw `input not found: ${name}`;

  input.value = value;
}
export function getFormValue(
  formDom: HTMLFormElement,
  name: string
) {
  const input = formDom[
    name
  ] as HTMLInputElement;
  if (!input)
    throw `input not found: ${name}`;

  return input.value;
}
