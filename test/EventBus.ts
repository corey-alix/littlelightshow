import { assert } from "chai";
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
