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
  const doit = () => {
    const textValue = input.value;
    const numericValue =
      input.valueAsNumber?.toFixed(2);
    if (textValue != numericValue) {
      input.value = numericValue;
    }
  };

  input.step = "0.01";
  input.addEventListener(
    "change",
    doit
  );
  doit();
}

export function formatUppercase(
  input: HTMLInputElement
) {
  addFormatter(() => {
    const textValue = (
      input.value || ""
    ).toUpperCase();
    if (textValue != input.value) {
      input.value = textValue;
    }
  }, input);
}

function addFormatter(
  change: () => void,
  input: HTMLInputElement
) {
  change();

  input.addEventListener(
    "change",
    change
  );
}

export function formatTrim(
  input: HTMLInputElement
) {
  addFormatter(() => {
    const textValue = (
      input.value || ""
    ).trim();
    if (textValue != input.value) {
      input.value = textValue;
    }
  }, input);
}

export function getValueAsNumber(
  input: HTMLInputElement
) {
  if (!input.value) return 0;
  return input.valueAsNumber;
}
