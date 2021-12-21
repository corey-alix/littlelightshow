export function asDateString(
  date = new Date()
) {
  return date
    .toISOString()
    .split("T")[0];
}

export function asTimeString(
  date = new Date()
) {
  return date
    .toISOString()
    .split("T")[1]
    .substring(0, 5);
}
