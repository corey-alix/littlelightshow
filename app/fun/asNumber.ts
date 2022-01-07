export function asNumber(node: Element) {
  return (node as HTMLInputElement).valueAsNumber || 0;
}
