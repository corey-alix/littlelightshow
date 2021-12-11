export async function query() {
  try {
    const portfolio = await fetch("/.netlify/functions/portfolio", {
      method: "POST",
      body: JSON.stringify({}),
    });

    if (!portfolio.ok) throw `${portfolio.status}: ${portfolio.statusText}`;
    return await portfolio.json();
  } catch (ex) {
    console.error(ex);
    return { error: ex };
  }
}
