export function getQueryParameter(
  name: string
) {
  const queryParams =
    new URLSearchParams(
      window.location.search
    );

  return queryParams.get(name);
}
