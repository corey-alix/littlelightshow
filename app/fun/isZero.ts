export function isZero(value: string) {
  if (value === "0.00") return true;
  if (value === "-0.00") return true;
  return false;
}

export function noZero(value: string) {
  return isZero(value) ? "" : value;
}
