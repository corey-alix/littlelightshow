import { assert } from "chai";
import {
  asDateString,
  asTimeString,
} from "../app/fun/asDateString.js";

describe("asDateString tests", () => {
  it("asDateString tests", () => {
    assert.equal(
      asDateString(
        new Date(2000, 1, 1, 0, 0, 0)
      ),
      "2000-02-01"
    );
    assert.equal(
      asDateString(
        new Date(2000, 1, 1, 22)
      ),
      "2000-02-01"
    );
  });

  it("asTimeString tests", () => {
    assert.equal(
      asTimeString(
        new Date(
          new Date(
            2000,
            1,
            1,
            6,
            20,
            30
          ).valueOf()
        )
      ),
      "06:20"
    );
  });
});
