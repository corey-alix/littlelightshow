export const routes = {
  home: () => "/index.html",
  identity: ({ context, target }) =>
    `/app/identity.html?target=${target}&context=${context}`,
  createInvoice: () =>
    `/app/invoice/invoice.html`,
  invoice: (id: string) =>
    `/app/invoice/invoice.html?id=${id}`,
  allInvoices: () =>
    `/app/invoice/invoices.html`,
  allLedgers: () =>
    `/app/gl/index.html?print=all`,
  printLedger: (id: string) =>
    `/app/gl/index.html?print=${id}`,
  createLedger: () =>
    "/app/gl/index.html",
  dashboard: () => "/app/index.html",
};
