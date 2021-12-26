export function distinct<T>(
  items: Array<T>
) {
  return [
    ...new Set(items),
  ] as Array<T>;
}
