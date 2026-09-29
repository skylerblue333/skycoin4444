import { describe, expect, it } from "vitest";
import {
  resolveExpectedReleaseSha,
  validateHostedLoadReleaseIdentity,
  validateHostedLoadReleaseSamples,
} from "./hosted-load-release.mjs";

const SHA_A = "b08c12df28ba821558d1f629498e8a827307700b";
const SHA_B = "3fab38a437f286897f0fb094510e6eeb96521d9f";

describe("hosted load release identity", () => {
  it("treats an empty expected SHA as deployment-agnostic", () => {
    expect(resolveExpectedReleaseSha(undefined)).toBeNull();
    expect(resolveExpectedReleaseSha("   ")).toBeNull();

    expect(validateHostedLoadReleaseIdentity(SHA_A, null)).toEqual({
      releaseSha: SHA_A,
      expectedReleaseSha: null,
      exactReleaseMatchVerified: false,
    });
  });

  it("requires a full expected Git SHA", () => {
    expect(() => resolveExpectedReleaseSha("b08c12d")).toThrow(
      "full 40-character Git commit SHA",
    );
    expect(() => resolveExpectedReleaseSha("z".repeat(40))).toThrow(
      "full 40-character Git commit SHA",
    );
  });

  it("requires readiness to expose a full Git SHA", () => {
    expect(() =>
      validateHostedLoadReleaseIdentity("b08c12d", null),
    ).toThrow("full 40-character Railway release SHA");
    expect(() =>
      validateHostedLoadReleaseIdentity(undefined, null),
    ).toThrow("full 40-character Railway release SHA");
  });

  it("accepts an exact release match case-insensitively", () => {
    expect(
      validateHostedLoadReleaseIdentity(
        SHA_A.toUpperCase(),
        resolveExpectedReleaseSha(SHA_A),
      ),
    ).toEqual({
      releaseSha: SHA_A,
      expectedReleaseSha: SHA_A,
      exactReleaseMatchVerified: true,
    });
  });

  it("fails closed when healthy load evidence comes from a stale release", () => {
    expect(() =>
      validateHostedLoadReleaseIdentity(
        SHA_B,
        resolveExpectedReleaseSha(SHA_A),
      ),
    ).toThrow(
      `Hosted load release identity mismatch: expected ${SHA_A}, received ${SHA_B}`,
    );
  });

  it("pins every readiness sample to one release throughout the run", () => {
    expect(
      validateHostedLoadReleaseSamples([SHA_A, SHA_A, SHA_A], SHA_A),
    ).toEqual({
      releaseSha: SHA_A,
      sampleCount: 3,
    });

    expect(() =>
      validateHostedLoadReleaseSamples([SHA_A, SHA_B, SHA_A], SHA_A),
    ).toThrow(
      `Hosted load release identity mismatch: expected ${SHA_A}, received ${SHA_B}`,
    );
  });
});
