import { describe, expect, it } from "vitest";
import {
  createIdentityRecord,
  deriveIdentityId,
  isSkyIdentityId,
  matchesSubject,
  normalizeNamespace,
  normalizeSubject,
} from "./index";

describe("SkyIdentity domain core", () => {
  it("derives stable IDs for the same canonical subject", () => {
    const first = deriveIdentityId({
      namespace: "SkySchool",
      subject: "student:42",
    });
    const second = deriveIdentityId({
      namespace: "skyschool",
      subject: "student:42",
    });
    expect(first).toBe(second);
    expect(isSkyIdentityId(first)).toBe(true);
  });

  it("separates namespaces", () => {
    expect(
      deriveIdentityId({ namespace: "skyschool", subject: "42" })
    ).not.toBe(deriveIdentityId({ namespace: "skyhope", subject: "42" }));
  });

  it("normalizes safe input and rejects malformed input", () => {
    expect(normalizeNamespace(" SkySchool ")).toBe("skyschool");
    expect(normalizeSubject(" user@example.com ")).toBe("user@example.com");
    expect(() => normalizeNamespace("x")).toThrow();
    expect(() => normalizeSubject("contains spaces")).toThrow();
    expect(() => normalizeSubject("<script>")).toThrow();
  });

  it("creates a truthful local record with canonical timestamp", () => {
    const record = createIdentityRecord({
      namespace: "skycommunity",
      subject: "member/123",
      displayName: "  Example Member  ",
      createdAt: "2026-08-25T09:00:00-05:00",
    });
    expect(record.displayName).toBe("Example Member");
    expect(record.createdAt).toBe("2026-08-25T14:00:00.000Z");
    expect(
      matchesSubject(record, {
        namespace: "skycommunity",
        subject: "member/123",
      })
    ).toBe(true);
  });

  it("rejects invalid timestamps and excessive display names", () => {
    expect(() =>
      createIdentityRecord({
        namespace: "skychat",
        subject: "1",
        createdAt: "not-a-date",
      })
    ).toThrow();
    expect(() =>
      createIdentityRecord({
        namespace: "skychat",
        subject: "1",
        createdAt: "2026-08-25T00:00:00Z",
        displayName: "x".repeat(121),
      })
    ).toThrow();
  });
});
