import {
  asCurrency,
  asQuantity,
} from "../app/fun/asCurrency.js";
import { assert } from "chai";

describe("asCurrency tests", () => {
  it("asCurrency tests", () => {
    assert.equal(
      asCurrency(1.234),
      "1.23"
    );
  });
});
