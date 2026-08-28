import { describe, expect, it } from "vitest";
import { createEventPublishedContract, normalizeEvent, selectEvents } from "./index";

describe("SkyEvents", () => {
  it("normalizes event identifiers and instants", () => {
    expect(normalizeEvent({ id: " e-1 ", type: " user.created ", occurredAt: "2026-08-28T02:00:00Z" })).toEqual({
      id: "e-1",
      type: "user.created",
      occurredAt: "2026-08-28T02:00:00.000Z",
    });
  });

  it("filters and sorts deterministically", () => {
    const events = [
      { id: "b", type: "task.updated", actorId: "u1", occurredAt: "2026-08-28T02:02:00Z" },
      { id: "a", type: "task.updated", actorId: "u1", occurredAt: "2026-08-28T02:01:00Z" },
      { id: "c", type: "task.updated", actorId: "u2", occurredAt: "2026-08-28T02:00:00Z" },
    ];

    expect(selectEvents(events, { actorId: "u1" }).map((event) => event.id)).toEqual(["a", "b"]);
  });

  it("emits a versioned provider-neutral integration contract", () => {
    const contract = createEventPublishedContract({ id: "evt-1", type: "sky.test", occurredAt: "2026-08-28T02:00:00Z" });
    expect(contract.type).toBe("sky.events.published.v1");
    expect(contract.event.id).toBe("evt-1");
  });
});
