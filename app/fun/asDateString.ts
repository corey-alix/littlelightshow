const localTimeOffsetInMinutes =
  new Date().getTimezoneOffset();

const localTimeOffsetInTicks =
  localTimeOffsetInMinutes * 60 * 1000;

function asLocalDate(date: Date) {
  return new Date(
    date.valueOf() -
      localTimeOffsetInTicks
  );
}

export function asDateString(
  date = new Date()
) {
  return asLocalDate(date)
    .toISOString()
    .split("T")[0];
}

export function asTimeString(
  date = new Date()
) {
  return asLocalDate(date)
    .toISOString()
    .split("T")[1]
    .substring(0, 5);
}
