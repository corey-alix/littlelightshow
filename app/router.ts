import { isUndefined } from "./fun/isUndefined";

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
  createInventory: () =>
    `/app/inventory/index.html`,
  inventory: (id: string) =>
    `/app/inventory/index.html?id=${id}`,
  allInventoryItems: () =>
    `/app/inventory/index.html?id=all`,
  allLedgers: () =>
    `/app/gl/index.html?print=all`,
  printLedger: (id: string) =>
    `/app/gl/index.html?print=${id}`,
  createLedger: () =>
    "/app/gl/index.html",
  editLedger: (id: string) =>
    `/app/gl/index.html?id=${id}`,
  dashboard: () => "/app/index.html",
  admin: () => "/app/admin/index.html",
  createTodo: () =>
    "/app/todo/index.html",
  todo: (id: string) =>
    `/app/todo/index.html?id=${id}`,
  maptiler: () =>
    `/app/ux/maptiler/maptiler.html`,
  gl: {
    byAccount: (id: string) =>
      `/app/gl/index.html?account=${id}`,
  },
  test: () =>
    `/test/browser/index.html`,
};
