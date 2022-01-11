import { assert } from "chai";
import { distinct } from "../app/fun/distinct.js";

describe("distinct tests", () => {
  it("distinct tests", () => {
    assert.sameOrderedMembers(
      distinct([2, 3, 1, 1, 3, 2]),
      [2, 3, 1]
    );
  });
});
