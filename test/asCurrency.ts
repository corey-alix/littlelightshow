import { assert } from "chai";

import {
  asCurrency,
  asQuantity,
} from "../app/fun/asCurrency.js";

describe("asCurrency tests", () => {
  it("asCurrency tests", () => {
    assert.equal(
      asCurrency(1.234),
      "1.23"
    );
    assert.equal(asCurrency(0), "0.00");
  });

  it("asQuantity tests", () => {
    assert.equal(
      asQuantity(1.234),
      "1"
    );
    assert.equal(
      asQuantity(1.9),
      "2",
      "round to nearest integer"
    );
    assert.equal(
      asQuantity(1.9, 1),
      "1.9",
      "round to nearest integer"
    );
  });
});
