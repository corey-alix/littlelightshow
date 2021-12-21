import {
  formatAsCurrency,
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
