export function sum(values: Array<number>) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0);
}
