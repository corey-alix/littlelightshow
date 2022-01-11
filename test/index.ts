import { assert } from "chai";

import "./asCurrency.js";
import "./asDateString.js";
// import { asNumber } from "../app/fun/asNumber.js";
// import {removeCssRestrictors} from  "../app/fun/detect"
import { distinct } from "../app/fun/distinct.js";
import {
  isNull,
  isUndefined,
} from "../app/fun/isUndefined.js";

describe("distinct tests", () => {
  it("distinct tests", () => {
    assert.sameOrderedMembers(
      distinct([2, 3, 1, 1, 3, 2]),
      [2, 3, 1]
    );
  });
});

describe("isUndefined tests", () => {
  it("isNull tests", () => {
    assert.equal(
      isNull(globalThis["__%"]),
      false
    );
    assert.equal(isNull(null), true);
    assert.equal(isUndefined(0), false);
    assert.equal(isNull(false), false);
    assert.equal(
      (<any>isNull)(),
      false
    );
  });
  it("isUndefined tests", () => {
    assert.equal(
      isUndefined(globalThis["__%"]),
      true
    );
    assert.equal(
      isUndefined(null),
      false
    );
    assert.equal(isUndefined(0), false);
    assert.equal(
      isUndefined(false),
      false
    );
    assert.equal(
      (<any>isUndefined)(),
      true
    );
  });
});
