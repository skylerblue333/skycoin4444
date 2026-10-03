import { describe, expect, it } from "vitest";
import { assertOAuthProviderIdentity } from "./oauthIdentity";

describe("OAuth provider identity binding", () => {
  it("accepts only the exact identity already bound to the signed session", () => {
    expect(
      assertOAuthProviderIdentity("user-123", "user-123")
    ).toBe("user-123");
  });

  it("rejects provider identity substitution", () => {
    expect(() =>
      assertOAuthProviderIdentity("user-123", "user-456")
    ).toThrow("does not match signed session");
  });

  it("rejects missing or unbounded identities", () => {
    expect(() =>
      assertOAuthProviderIdentity("user-123", "")
    ).toThrow("does not match signed session");

    expect(() =>
      assertOAuthProviderIdentity("", "user-123")
    ).toThrow("Signed session identity is invalid");

    expect(() =>
      assertOAuthProviderIdentity("user-123", "x".repeat(513))
    ).toThrow("does not match signed session");
  });
});
