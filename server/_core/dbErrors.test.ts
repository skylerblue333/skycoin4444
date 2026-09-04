import { describe, expect, it } from "vitest";
import { isMysqlDuplicateEntry } from "./dbErrors";

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

  it("does not misclassify unrelated failures", () => {
    expect(isMysqlDuplicateEntry(new Error("connection reset"))).toBe(false);
    expect(isMysqlDuplicateEntry(null)).toBe(false);
  });

  it("does not loop forever on cyclic cause chains", () => {
    const error: { cause?: unknown } = {};
    error.cause = error;
    expect(isMysqlDuplicateEntry(error)).toBe(false);
  });
});
