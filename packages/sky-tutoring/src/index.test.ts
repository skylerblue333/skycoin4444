import { describe, expect, it } from "vitest";
import { completeSession, createTutoringSession, startSession, toClassroomEvent } from "./index";

describe("SkyTutoring", () => {
  const input = { id: "s1", learnerId: "u1", subject: "algebra", scheduledAt: "2026-08-26T15:00:00Z", durationMinutes: 45 };

  it("enforces the scheduled-active-completed lifecycle", () => {
    const scheduled = createTutoringSession(input);
    const active = startSession(scheduled);
    const completed = completeSession(active);
    expect(completed.status).toBe("completed");
    expect(toClassroomEvent(completed)).toEqual({
      contract: "skytutoring.session.v1",
      sessionId: "s1",
      learnerId: "u1",
      subject: "algebra",
      status: "completed",
    });
  });

  it("rejects invalid durations and invalid transitions", () => {
    expect(() => createTutoringSession({ ...input, durationMinutes: 5 })).toThrow(RangeError);
    expect(() => completeSession(createTutoringSession(input))).toThrow();
  });
});
