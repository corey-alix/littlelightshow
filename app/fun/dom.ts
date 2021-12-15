export function moveChildren(items: HTMLElement, report: HTMLElement) {
  while (items.firstChild) report.appendChild(items.firstChild);
}
