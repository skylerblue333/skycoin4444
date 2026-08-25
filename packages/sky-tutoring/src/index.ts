export type TutoringStatus = "scheduled" | "active" | "completed" | "cancelled";

export interface TutoringSessionInput {
  id: string;
  learnerId: string;
  subject: string;
  scheduledAt: string;
  durationMinutes: number;
}

export interface TutoringSession extends TutoringSessionInput {
  status: TutoringStatus;
}

function boundedText(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 200) {
    throw new TypeError(`${field} must be non-empty and at most 200 characters`);
  }
}

export function createTutoringSession(input: TutoringSessionInput): TutoringSession {
  boundedText(input.id, "id");
  boundedText(input.learnerId, "learnerId");
  boundedText(input.subject, "subject");
  if (!Number.isFinite(Date.parse(input.scheduledAt))) throw new TypeError("scheduledAt must be a valid timestamp");
  if (!Number.isSafeInteger(input.durationMinutes) || input.durationMinutes < 10 || input.durationMinutes > 240) {
    throw new RangeError("durationMinutes must be an integer from 10 to 240");
  }
  return { ...input, status: "scheduled" };
}

export function startSession(session: TutoringSession): TutoringSession {
  if (session.status !== "scheduled") throw new Error("only scheduled sessions can start");
  return { ...session, status: "active" };
}

export function completeSession(session: TutoringSession): TutoringSession {
  if (session.status !== "active") throw new Error("only active sessions can complete");
  return { ...session, status: "completed" };
}

export function cancelSession(session: TutoringSession): TutoringSession {
  if (session.status === "completed") throw new Error("completed sessions cannot be cancelled");
  return { ...session, status: "cancelled" };
}

export function toClassroomEvent(session: TutoringSession) {
  boundedText(session.id, "id");
  return {
    contract: "skytutoring.session.v1" as const,
    sessionId: session.id,
    learnerId: session.learnerId,
    subject: session.subject,
    status: session.status,
  };
}
