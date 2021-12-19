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
