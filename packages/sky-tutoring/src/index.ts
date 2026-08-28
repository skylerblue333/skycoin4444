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

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function boundedText(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 200) {
    throw new TypeError(`${field} must be non-empty and at most 200 characters`);
  }
}

function strictTimestamp(value: string): void {
  if (typeof value !== "string" || !ISO_UTC.test(value)) throw new TypeError("scheduledAt must be an ISO-8601 UTC timestamp");
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 19) !== value.slice(0, 19)) {
    throw new TypeError("scheduledAt must be a valid calendar timestamp");
  }
}

function validateSession(session: TutoringSession): void {
  boundedText(session.id, "id");
  boundedText(session.learnerId, "learnerId");
  boundedText(session.subject, "subject");
  strictTimestamp(session.scheduledAt);
  if (!Number.isSafeInteger(session.durationMinutes) || session.durationMinutes < 10 || session.durationMinutes > 240) {
    throw new RangeError("durationMinutes must be an integer from 10 to 240");
  }
  if (!["scheduled", "active", "completed", "cancelled"].includes(session.status)) throw new TypeError("unsupported tutoring status");
}

export function createTutoringSession(input: TutoringSessionInput): TutoringSession {
  const session: TutoringSession = { ...input, status: "scheduled" };
  validateSession(session);
  return session;
}

export function startSession(session: TutoringSession): TutoringSession {
  validateSession(session);
  if (session.status !== "scheduled") throw new Error("only scheduled sessions can start");
  return { ...session, status: "active" };
}

export function completeSession(session: TutoringSession): TutoringSession {
  validateSession(session);
  if (session.status !== "active") throw new Error("only active sessions can complete");
  return { ...session, status: "completed" };
}

export function cancelSession(session: TutoringSession): TutoringSession {
  validateSession(session);
  if (session.status === "completed") throw new Error("completed sessions cannot be cancelled");
  return { ...session, status: "cancelled" };
}

export function toClassroomEvent(session: TutoringSession) {
  validateSession(session);
  return {
    contract: "skytutoring.session.v1" as const,
    sessionId: session.id,
    learnerId: session.learnerId,
    subject: session.subject,
    status: session.status,
  };
}
