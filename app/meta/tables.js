export const tables = {
  lls_customers: {
    telephone: { primary: true, type: "string" },
    fullName: "Alice",
    address: {
      street: "87856 Mendota Court",
      city: "Washington",
      state: "DC",
      zipCode: "20220",
    },
  },
  lls_products: {
    code: { primary: true, type: "string" },
    description: "100CT White Mini",
  },
};
