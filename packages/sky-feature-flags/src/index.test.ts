import { describe, expect, it } from "vitest";
import { createFlagSnapshot, evaluateFlag } from "./index";

describe("SkyFeatureFlags", () => {
  it("returns subject overrides deterministically", () => {
    const flag = { key: "checkout.new_flow", defaultValue: false, overrides: { "user-1": true } };
    expect(evaluateFlag(flag, { subjectId: "user-1" })).toBe(true);
    expect(evaluateFlag(flag, { subjectId: "user-2" })).toBe(false);
  });

  it("creates a stable integration snapshot", () => {
    expect(createFlagSnapshot([
      { key: "a.flag", defaultValue: true },
      { key: "b.flag", defaultValue: "control" },
    ], { subjectId: "user-1" })).toEqual({
      contract: "skyfeatureflags.snapshot.v1",
      subjectId: "user-1",
      values: { "a.flag": true, "b.flag": "control" },
    });
  });

  it("rejects invalid and duplicate flag keys", () => {
    expect(() => evaluateFlag({ key: "Bad Key", defaultValue: true }, { subjectId: "user-1" })).toThrow(TypeError);
    expect(() => createFlagSnapshot([
      { key: "dup", defaultValue: true },
      { key: "dup", defaultValue: false },
    ], { subjectId: "user-1" })).toThrow(/duplicate/);
  });
});
