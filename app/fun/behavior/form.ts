import {
  formatAsCurrency,
  formatTrim,
  formatUppercase,
  selectOnFocus,
} from "./input";

export function extendNumericInputBehaviors(
  form: HTMLElement
) {
  const numberInput = Array.from(
    form.querySelectorAll(
      "input[type=number]"
    )
  ) as Array<HTMLInputElement>;
  numberInput.forEach(selectOnFocus);

  const currencyInput =
    numberInput.filter((i) =>
      i.classList.contains("currency")
    );
  currencyInput.forEach(
    formatAsCurrency
  );
}

export function extendTextInputBehaviors(
  form: HTMLElement
) {
  const textInput = Array.from(
    form.querySelectorAll(
      "input[type=text]"
    )
  ) as Array<HTMLInputElement>;
  textInput.forEach(selectOnFocus);

  textInput
    .filter((i) =>
      i.classList.contains("trim")
    )
    .forEach(formatTrim);

  textInput
    .filter((i) =>
      i.classList.contains("uppercase")
    )
    .forEach(formatUppercase);
}
