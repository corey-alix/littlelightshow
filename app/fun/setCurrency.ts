export function setCurrency(input: HTMLInputElement, value: number) {
  if (!input) throw "no input found";
  input.value = (value || 0).toFixed(2);
}
