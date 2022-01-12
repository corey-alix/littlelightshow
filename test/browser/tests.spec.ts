import { assert } from "chai";
import {
  on,
  trigger,
} from "../../app/fun/on.js";
import { dom } from "../../app/dom.js";

import {
  moveChildren,
  moveChildrenAfter,
  moveChildrenBefore,
} from "../../app/fun/dom";

describe("tests on/trigger", () => {
  it("tests on/trigger", () => {
    const element = dom("div");
    let counter = 0;
    on(
      element,
      "topic-1",
      () => counter++
    );
    trigger(element, "topic-1");
    assert.equal(counter, 1);
  });
});

describe("tests moveChildren", () => {
  it("tests moveChildren", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    moveChildren(source, target);
    assert.equal(
      child.parentElement,
      target
    );
  });

  it("tests moveChildrenAfter", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    const placeholder = dom("div");
    target.appendChild(placeholder);
    moveChildrenAfter(
      source,
      placeholder
    );
    assert.equal(
      child.parentElement,
      target
    );
    assert.equal(
      placeholder.nextElementSibling,
      child
    );
  });

  it("tests moveChildrenBefore", () => {
    const source = dom("div");
    const target = dom("div");
    const child = dom("div");
    source.appendChild(child);
    const placeholder = dom("div");
    target.appendChild(placeholder);
    moveChildrenBefore(
      source,
      placeholder
    );
    assert.equal(
      child.parentElement,
      target
    );
    assert.equal(
      placeholder.previousElementSibling,
      child
    );
  });
});
