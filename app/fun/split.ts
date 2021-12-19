export function split<T>(
  items: Array<T>,
  test: (item: T) => boolean
) {
  const result = [[], []] as [
    Array<T>,
    Array<T>
  ];
  items.forEach((i) =>
    result[test(i) ? 0 : 1].push(i)
  );
  return result;
}
