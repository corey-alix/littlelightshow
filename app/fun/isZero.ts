export function isZero(
  value: string | number
) {
  const numericValue =
    typeof value === "number"
      ? value
      : parseFloat(value);
  if (isNaN(numericValue)) return false;
  if (numericValue > 1e-7) return false;
  if (numericValue < -1e-7)
    return false;
  return true;
}

export function noZero(value: string) {
  return isZero(value) ? "" : value;
}
