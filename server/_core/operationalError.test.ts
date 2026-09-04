import { describe, expect, it } from "vitest";
import { sanitizeOperationalError } from "./operationalError";

describe("operational error sanitization", () => {
  it("redacts URI credentials and common secret parameters", () => {
    const summary = sanitizeOperationalError(
      new Error(
        "mysql://admin:secret@db.example/sky?password=hidden&access_token=abc123"
      )
    );

    expect(summary).not.toContain("secret");
    expect(summary).not.toContain("hidden");
    expect(summary).not.toContain("abc123");
    expect(summary).toContain("[redacted]");
  });

  it("redacts bearer and JWT-shaped values", () => {
    const summary = sanitizeOperationalError(
      "Authorization: Bearer top.secret-token " +
        "token=eyJabc.def.ghi"
    );

    expect(summary).not.toContain("top.secret-token");
    expect(summary).not.toContain("eyJabc.def.ghi");
    expect(summary).toContain("[redacted]");
  });

  it("flattens and bounds the summary", () => {
    const summary = sanitizeOperationalError(
      "first\nsecond\t" + "x".repeat(500),
      80
    );

    expect(summary).not.toMatch(/[\r\n\t]/);
    expect(summary.length).toBeLessThanOrEqual(80);
  });

  it("rejects incoherent output bounds", () => {
    expect(() =>
      sanitizeOperationalError("boom", 12)
    ).toThrow(/maxLength/);
  });
});
