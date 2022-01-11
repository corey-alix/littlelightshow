import { assert } from "chai";

import "./asCurrency.js";
import "./asDateString.js";
import "./distinctTests.js";
import "./isUndefinedTests.js";

/**
 * Most "fun" methods are DOM related and cannot be tested in node
import { asNumber } from "../app/fun/asNumber.js";
import {removeCssRestrictors} from  "../app/fun/detect"
import {setCurrency} from "../app/fun/setCurrency"
import { extendNumericInputBehaviors, extendTextInputBehaviors } from "../app/fun/behavior/form";
import { removeCssRestrictors } from "../app/fun/detect";
 */

import { EventBus } from "../app/fun/EventBus";

describe("EventBus", () => {
  it("EventBus Tests", () => {
    const channel = new EventBus();
    let eventCounter = 0;
    channel.on(
      "topic-1",
      () => eventCounter++
    );
    channel.on(
      "topic-2",
      (data: { increment: number }) =>
        (eventCounter += data.increment)
    );
    channel.trigger("topic-1");
    channel.trigger("topic-2", {
      increment: 0.1,
    });
    assert.equal(eventCounter, 1.1);
  });
});
