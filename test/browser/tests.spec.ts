function sleep(ms: number) {
  return new Promise<void>(
    (good, bad) => {
      setTimeout(() => good(), ms);
    }
  );
}

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

import { extendTextInputBehaviors } from "../../app/fun/behavior/form";

describe("tests fun/behavior/form", () => {
  it("tests extendTextInputBehaviors", async () => {
    const element = dom("form");
    const input = dom("input", {
      type: "text",
      class: "trim uppercase",
    }) as HTMLInputElement;
    document.body.appendChild(element);
    element.appendChild(input);
    input.value = " input value ";
    extendTextInputBehaviors(element);
    assert.equal(
      input.value,
      "INPUT VALUE"
    );

    await sleep(100);
    input.focus();

    assert.equal(
      input.selectionStart,
      0,
      "start"
    );

    assert.equal(
      input.selectionEnd,
      11,
      "end"
    );

    element.remove();
  });
});

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

import {
  formatAsCurrency,
  formatTrim,
  formatUppercase,
  getValueAsNumber,
  selectOnFocus,
} from "../../app/fun/behavior/input";

describe("tests fun/behavior/input", () => {
  it("tests formatAsCurrency", () => {
    const input = dom("input", {
      type: "number",
    }) as HTMLInputElement;
    input.value = "1";
    formatAsCurrency(input);
    assert.equal(input.value, "1.00");
    input.valueAsNumber = 1.234;
    trigger(input, "change");
    assert.equal(input.value, "1.23");
  });

  it("tests formatTrim", () => {
    const input = dom("input", {
      type: "text",
    }) as HTMLInputElement;
    input.value = " one ";
    formatTrim(input);
    assert.equal(input.value, "one");
  });

  it("tests formatUppercase", () => {
    const input = dom("input", {
      type: "text",
    }) as HTMLInputElement;
    input.value = "one";
    formatUppercase(input);
    assert.equal(input.value, "ONE");
  });

  it("tests getValueAsNumber", () => {
    const input = dom("input", {
      type: "number",
    }) as HTMLInputElement;
    input.value = "1.25";
    const value =
      getValueAsNumber(input);
    assert.equal(value, 1.25);
  });

  it("tests selectOnFocus", async () => {
    const input = dom("input", {
      type: "text",
    }) as HTMLInputElement;
    document.body.appendChild(input);
    input.value = "X";
    selectOnFocus(input);
    input.focus();
    await sleep(10);
    assert.equal(input.selectionEnd, 1);
    input.remove();
  });
});
