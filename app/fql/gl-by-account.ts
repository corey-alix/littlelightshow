/**
 * Returns all GL ledgers that reference an account
 */

import { ledgerModel } from "../services/gl";

export async function execute(query: {
  account: string;
}) {
  const items =
    await ledgerModel.getItems();
  const lineItems = items
    .map((parent) =>
      parent.items.map((child) => ({
        parent,
        child,
      }))
    )
    .flat();
  return lineItems.filter(
    (item) =>
      item.child.account ===
      query.account
  );
}
