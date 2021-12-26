export function moveChildren(
  items: HTMLElement,
  report: HTMLElement
) {
  while (items.firstChild)
    report.appendChild(
      items.firstChild
    );
}

export function moveChildrenBefore(
  items: HTMLElement,
  report: HTMLElement
) {
  while (items.firstChild)
    report.before(items.firstChild);
}

export function moveChildrenAfter(
  items: Element,
  report: Element
) {
  let head = report;
  while (items.firstChild) {
    const firstChild = items.firstChild;
    head.after(firstChild);
    head = firstChild as HTMLElement;
  }
}
