export const routes = {
  home: () => "/index.html",
  identity: ({ context, target }) =>
    `/app/identity.html?target=${target}&context=${context}`,
  createInvoice: () => `/app/invoice/invoice.html`,
  invoice: (id: string) => `/app/invoice/invoice.html?id=${id}`,
};
