import { selectOnFocus } from "./select-on-focus";

export function selectNumericInputOnFocus(
  form: HTMLElement
) {
  const items = Array.from(
    form.querySelectorAll(
      "input[type=number]"
    )
  ) as Array<HTMLInputElement>;
  items.forEach(selectOnFocus);
}
