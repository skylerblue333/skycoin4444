import { describe, expect, it } from "vitest";
import {
  isMysqlDuplicateEntry,
  isMysqlDuplicateEntryFor,
} from "./dbErrors";

describe("MySQL duplicate classification", () => {
  it("recognizes mysql2 duplicate codes", () => {
    expect(isMysqlDuplicateEntry({ code: "ER_DUP_ENTRY" })).toBe(true);
    expect(isMysqlDuplicateEntry({ errno: 1062 })).toBe(true);
  });

  it("recognizes duplicate errors wrapped by another database error", () => {
    expect(
      isMysqlDuplicateEntry({
        message: "query failed",
        cause: { code: "ER_DUP_ENTRY", errno: 1062 },
      })
    ).toBe(true);
  });

  it("can require the intended unique constraint", () => {
    const error = {
      message: "query failed",
      cause: {
        code: "ER_DUP_ENTRY",
        errno: 1062,
        message:
          "Duplicate entry 'post-user' for key 'likes.likes_post_user_unique'",
      },
    };

    expect(
      isMysqlDuplicateEntryFor(error, "likes_post_user_unique")
    ).toBe(true);
    expect(
      isMysqlDuplicateEntryFor(error, "follows_follower_following_unique")
    ).toBe(false);
  });

  it("does not misclassify unrelated failures", () => {
    expect(isMysqlDuplicateEntry(new Error("connection reset"))).toBe(false);
    expect(isMysqlDuplicateEntry(null)).toBe(false);
    expect(
      isMysqlDuplicateEntryFor(
        { code: "ER_DUP_ENTRY", message: "Duplicate entry" },
        "likes_post_user_unique"
      )
    ).toBe(false);
  });

  it("does not loop forever on cyclic cause chains", () => {
    const error: { cause?: unknown } = {};
    error.cause = error;
    expect(isMysqlDuplicateEntry(error)).toBe(false);
    expect(
      isMysqlDuplicateEntryFor(error, "likes_post_user_unique")
    ).toBe(false);
  });
});
