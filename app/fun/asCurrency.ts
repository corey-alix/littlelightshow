export function asCurrency(
  value: number
) {
  return (value || 0).toFixed(2);
}

export function asQuantity(
  value: number
) {
  if (typeof value === "string")
    return value;
  return (value || 0).toFixed(0);
}
