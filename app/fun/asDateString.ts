export function asDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}
