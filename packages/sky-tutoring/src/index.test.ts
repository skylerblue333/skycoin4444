import { describe, expect, it } from "vitest";
import { completeSession, createTutoringSession, startSession, toClassroomEvent } from "./index";

describe("SkyTutoring", () => {
  const input = { id: "s1", learnerId: "u1", subject: "algebra", scheduledAt: "2026-08-26T15:00:00Z", durationMinutes: 45 };

  it("enforces the scheduled-active-completed lifecycle", () => {
    const completed = completeSession(startSession(createTutoringSession(input)));
    expect(completed.status).toBe("completed");
    expect(toClassroomEvent(completed)).toMatchObject({ contract: "skytutoring.session.v1", sessionId: "s1", status: "completed" });
  });

  it("rejects invalid durations, impossible timestamps and invalid transitions", () => {
    expect(() => createTutoringSession({ ...input, durationMinutes: 5 })).toThrow(RangeError);
    expect(() => createTutoringSession({ ...input, scheduledAt: "2026-02-30T15:00:00Z" })).toThrow(TypeError);
    expect(() => completeSession(createTutoringSession(input))).toThrow();
  });

  it("revalidates mutable session data before transitions and events", () => {
    const session = createTutoringSession(input);
    session.learnerId = "";
    expect(() => startSession(session)).toThrow(TypeError);

    const valid = createTutoringSession(input);
    valid.durationMinutes = 0;
    expect(() => toClassroomEvent(valid)).toThrow(RangeError);
  });
});
