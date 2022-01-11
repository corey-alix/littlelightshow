import { assert } from "chai";

import {
  isNull,
  isUndefined,
} from "../app/fun/isUndefined.js";

import {
  isZero,
  noZero,
} from "../app/fun/isZero.js";

describe("isZero tests", () => {
  it("isZero tests", () => {
    assert.isTrue(
      isZero("-0"),
      "-0 is zero"
    );
    assert.isTrue(isZero("0"), "0");
    assert.isTrue(isZero("0.0"), "0.0");
    assert.isTrue(
      !isZero("0.0001"),
      "almost zero but not quite"
    );
    assert.isTrue(
      !isZero(""),
      "empty string is not zero"
    );
    assert.isTrue(
      !isZero(<any>null),
      "null is not zero"
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
