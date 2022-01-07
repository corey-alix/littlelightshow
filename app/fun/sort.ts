declare global {
  interface Array<T> {
    sortBy(
      o: Partial<
        Record<
          keyof T,
          keyof typeof sortOps
        >
      >
    ): Array<T>;
  }
}

const sortOps = {
  number: (a: number, b: number) =>
    (a || 0) - (b || 0),
  "-number": (a: number, b: number) =>
    -((a || 0) - (b || 0)),
  gl: (a: number, b: number) =>
    a >= 0 ? a - b : b - a,
  "abs(number)": (
    a: number,
    b: number
  ) =>
    Math.abs(a || 0) - Math.abs(b || 0),
  "-abs(number)": (
    a: number,
    b: number
  ) =>
    -(
      Math.abs(a || 0) -
      Math.abs(b || 0)
    ),
  string: (a: string, b: string) =>
    (a || "").localeCompare(b || ""),
  date: (a: Date, b: Date) =>
    (a || 0).valueOf() -
    (b || 0).valueOf(),
  noop: () => 0,
};

Array.prototype.sortBy = function <T>(
  sortBy: Partial<
    Record<
      keyof T,
      keyof typeof sortOps
    >
  >
) {
  return sort(this, sortBy);
};

export function sort<T>(
  items: Array<T>,
  sortBy: Partial<
    Record<
      keyof T,
      keyof typeof sortOps
    >
  >
) {
  const keys = Object.keys(sortBy);
  return [...items].sort((a, b) => {
    let result = 0;
    keys.some(
      (k) =>
        !!(result = sortOps[sortBy[k]](
          a[k],
          b[k]
        ))
    );
    return result;
  });
}
