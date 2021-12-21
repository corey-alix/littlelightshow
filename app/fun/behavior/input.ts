import { on } from "../on.js";

export function selectOnFocus(
  element:
    | HTMLInputElement
    | HTMLTextAreaElement
) {
  on(element, "focus", () =>
    element.select()
  );
}

export function formatAsCurrency(
  input: HTMLInputElement
) {
  input.step = "0.01";
  input.addEventListener(
    "change",
    () => {
      const textValue = input.value;
      const numericValue =
        input.valueAsNumber?.toFixed(2);
      if (textValue != numericValue) {
        input.value = numericValue;
      }
    }
  );
}

export function getValueAsNumber(
  input: HTMLInputElement
) {
  if (!input.value) return 0;
  return input.valueAsNumber;
}
