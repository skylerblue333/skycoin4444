export const SKY_COMMENT_CHANGED_EVENT = "sky.comment.changed.v1" as const;

export type CommentStatus = "active" | "deleted";

export interface CommentRecord {
  id: string;
  subjectId: string;
  actorId: string;
  body: string;
  parentId?: string;
  status: CommentStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentChangedEvent {
  type: typeof SKY_COMMENT_CHANGED_EVENT;
  commentId: string;
  subjectId: string;
  actorId: string;
  status: CommentStatus;
  version: number;
}

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_BODY_LENGTH = 4000;

function assertId(value: string, field: string): void {
  if (!ID_RE.test(value)) throw new Error(`${field} is invalid`);
}

function assertIsoInstant(value: string, field: string): void {
  const parsed = new Date(value);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} must be a UTC ISO instant`);
  }
  if (parsed.toISOString() !== value.replace(/\.000Z$/, "Z")) {
    const canonical = parsed.toISOString();
    if (canonical !== value) throw new Error(`${field} must represent a real UTC instant`);
  }
}

function normalizeBody(body: string): string {
  const normalized = body.replace(/\r\n?/g, "\n").trim();
  if (normalized.length === 0) throw new Error("body must not be empty");
  if (normalized.length > MAX_BODY_LENGTH) throw new Error(`body exceeds ${MAX_BODY_LENGTH} characters`);
  return normalized;
}

export function createComment(input: {
  id: string;
  subjectId: string;
  actorId: string;
  body: string;
  parentId?: string;
  at: string;
}): { comment: CommentRecord; event: CommentChangedEvent } {
  assertId(input.id, "id");
  assertId(input.subjectId, "subjectId");
  assertId(input.actorId, "actorId");
  if (input.parentId !== undefined) {
    assertId(input.parentId, "parentId");
    if (input.parentId === input.id) throw new Error("comment cannot parent itself");
  }
  assertIsoInstant(input.at, "at");
  const comment: CommentRecord = {
    id: input.id,
    subjectId: input.subjectId,
    actorId: input.actorId,
    body: normalizeBody(input.body),
    ...(input.parentId ? { parentId: input.parentId } : {}),
    status: "active",
    version: 1,
    createdAt: input.at,
    updatedAt: input.at,
  };
  return { comment, event: toEvent(comment) };
}

export function editComment(comment: CommentRecord, body: string, at: string): { comment: CommentRecord; event: CommentChangedEvent } {
  if (comment.status !== "active") throw new Error("deleted comments cannot be edited");
  assertIsoInstant(at, "at");
  if (Date.parse(at) < Date.parse(comment.updatedAt)) throw new Error("at cannot precede updatedAt");
  const next = { ...comment, body: normalizeBody(body), version: comment.version + 1, updatedAt: at };
  return { comment: next, event: toEvent(next) };
}

export function deleteComment(comment: CommentRecord, actorId: string, at: string): { comment: CommentRecord; event: CommentChangedEvent } {
  assertId(actorId, "actorId");
  if (actorId !== comment.actorId) throw new Error("only the comment actor may delete through this domain core");
  if (comment.status === "deleted") throw new Error("comment is already deleted");
  assertIsoInstant(at, "at");
  if (Date.parse(at) < Date.parse(comment.updatedAt)) throw new Error("at cannot precede updatedAt");
  const next: CommentRecord = { ...comment, body: "", status: "deleted", version: comment.version + 1, updatedAt: at };
  return { comment: next, event: toEvent(next) };
}

export function toEvent(comment: CommentRecord): CommentChangedEvent {
  return {
    type: SKY_COMMENT_CHANGED_EVENT,
    commentId: comment.id,
    subjectId: comment.subjectId,
    actorId: comment.actorId,
    status: comment.status,
    version: comment.version,
  };
}
