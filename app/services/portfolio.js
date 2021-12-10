export async function query() {
  const portfolio = await fetch("/.netlify/functions/portfolio", {
    method: "POST",
    body: JSON.stringify({}),
  });

  return portfolio;
}
