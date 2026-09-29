import { describe, expect, it } from "vitest";
import { deriveLoginMethod } from "./loginMethod";

describe("deriveLoginMethod", () => {
  it("preserves an explicit provider login method", () => {
    expect(
      deriveLoginMethod(["REGISTERED_PLATFORM_GOOGLE"], "email")
    ).toBe("email");
  });

  it.each([
    ["REGISTERED_PLATFORM_EMAIL", "email"],
    ["REGISTERED_PLATFORM_GOOGLE", "google"],
    ["REGISTERED_PLATFORM_APPLE", "apple"],
    ["REGISTERED_PLATFORM_MICROSOFT", "microsoft"],
    ["REGISTERED_PLATFORM_AZURE", "microsoft"],
    ["REGISTERED_PLATFORM_GITHUB", "github"],
  ])("maps %s to %s", (platform, expected) => {
    expect(deriveLoginMethod([platform], null)).toBe(expected);
  });

  it("falls back deterministically to the first string platform", () => {
    expect(
      deriveLoginMethod([42, null, "CUSTOM_PROVIDER", "OTHER_PROVIDER"], null)
    ).toBe("custom_provider");
  });

  it("returns null for missing or malformed platform data", () => {
    expect(deriveLoginMethod(undefined, null)).toBeNull();
    expect(deriveLoginMethod("REGISTERED_PLATFORM_EMAIL", null)).toBeNull();
    expect(deriveLoginMethod([42, null, false], null)).toBeNull();
  });
});
