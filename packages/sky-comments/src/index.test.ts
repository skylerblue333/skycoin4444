import { describe, expect, it } from "vitest";
import { createComment, deleteComment, editComment, SKY_COMMENT_CHANGED_EVENT } from "./index";

const T0 = "2026-08-30T20:00:00.000Z";
const T1 = "2026-08-30T20:01:00.000Z";
const T2 = "2026-08-30T20:02:00.000Z";

describe("SkyComments", () => {
  it("creates normalized comments and emits the integration contract", () => {
    const result = createComment({ id: "c-1", subjectId: "post-1", actorId: "u-1", body: "  hello\r\nworld  ", at: T0 });
    expect(result.comment.body).toBe("hello\nworld");
    expect(result.comment.version).toBe(1);
    expect(result.event).toEqual({ type: SKY_COMMENT_CHANGED_EVENT, commentId: "c-1", subjectId: "post-1", actorId: "u-1", status: "active", version: 1 });
  });

  it("edits active comments with monotonic versions", () => {
    const created = createComment({ id: "c-2", subjectId: "post-1", actorId: "u-1", body: "first", at: T0 }).comment;
    const edited = editComment(created, "second", T1).comment;
    expect(edited.body).toBe("second");
    expect(edited.version).toBe(2);
    expect(edited.createdAt).toBe(T0);
    expect(edited.updatedAt).toBe(T1);
  });

  it("tombstones deleted content and rejects later edits", () => {
    const created = createComment({ id: "c-3", subjectId: "post-1", actorId: "u-1", body: "remove me", at: T0 }).comment;
    const deleted = deleteComment(created, "u-1", T1).comment;
    expect(deleted.status).toBe("deleted");
    expect(deleted.body).toBe("");
    expect(() => editComment(deleted, "nope", T2)).toThrow("deleted comments cannot be edited");
  });

  it("rejects unauthorized delete attempts and invalid chronology", () => {
    const created = createComment({ id: "c-4", subjectId: "post-1", actorId: "u-1", body: "body", at: T1 }).comment;
    expect(() => deleteComment(created, "u-2", T2)).toThrow("only the comment actor");
    expect(() => editComment(created, "past", T0)).toThrow("at cannot precede updatedAt");
  });

  it("rejects self-parenting, empty content, and impossible UTC dates", () => {
    expect(() => createComment({ id: "c-5", subjectId: "post-1", actorId: "u-1", parentId: "c-5", body: "x", at: T0 })).toThrow("cannot parent itself");
    expect(() => createComment({ id: "c-6", subjectId: "post-1", actorId: "u-1", body: "   ", at: T0 })).toThrow("body must not be empty");
    expect(() => createComment({ id: "c-7", subjectId: "post-1", actorId: "u-1", body: "x", at: "2026-02-31T20:00:00.000Z" })).toThrow("real UTC instant");
  });
});
