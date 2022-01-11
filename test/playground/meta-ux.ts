// describe inventory, invoice, gl as metadata
import { globals } from "../../app/globals.js";
import type { Inventory } from "../../app/services/inventory";

const DataType = {
  date: new Date(),
  number: 0,
  string: "",
};

/***
 * This describes the metadata for inventory as well as how a grid could be rendered
 * and defines computed fields.  It could potentially be used to generate solutions
 * for different frameworks but I'm not sure it's worth the trouble since we don't
 * need to define storage (fauna creates models)
 */
export const ux = [
  {
    type: "form",
    data: {
      title: `Inventory Items for ${globals.primaryContact.companyName}`,
      fields: [
        field({
          name: "id",
          visible: false,
          readonly: true,
        }),
        field({
          name: "code",
        }),
        field({
          name: "description",
        }),
        field({
          name: "quantity",
          type: "number",
        }),
        field({
          name: "price",
          type: "number",
        }),
        field({
          name: "taxrate",
          type: "number",
        }),
        field({
          name: "value",
          compute: (data: Inventory) =>
            data.quantity *
            data.price *
            (1 + data.taxrate),
        }),
      ],
      // can define grids based on available width...maybe three grids for
      // mobile, 2k, 4k, but it feels awkward
      grids: [
        {
          field: "code",
          columns: [0, 1, 2, 3],
        },
        {
          field: "quantity",
          columns: [4],
        },
        {
          field: "price",
          columns: [5],
        },
        {
          field: "value",
          columns: [6],
        },
        {
          field: "taxrate",
          columns: [7],
        },
      ],
    },
  },
];

interface FieldType {
  type: keyof typeof DataType;
  name: string;
  readonly: boolean;
  visible: boolean;
  compute: Function;
}

function field(
  options: {
    name: string;
  } & Partial<FieldType>
): FieldType {
  return extend<FieldType>(options, {
    type: "string",
    readonly: false,
    visible: true,
  });
}

function extend<T>(
  v1: Partial<T>,
  v2: Partial<T>
) {
  return <T>{ ...v1, ...v2 };
}
