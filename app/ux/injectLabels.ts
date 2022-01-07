import { dom } from "../dom.js";

export function injectLabels(
  domNode: HTMLElement
) {
  const inputsToWrap = Array.from(
    domNode.querySelectorAll(
      "input.auto-label"
    )
  ) as Array<HTMLInputElement>;

  inputsToWrap.forEach((input) => {
    const label = dom("label");
    label.className =
      "border padding rounded wrap " +
      input.className;
    label.innerText = input.placeholder;
    input.parentElement!.insertBefore(
      label,
      input
    );
    label.appendChild(input);
  });
}
