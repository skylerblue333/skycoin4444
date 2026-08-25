import { describe, expect, it } from "vitest";
import { evaluateCases, toIntegrationReport } from "./index";

describe("SkyEvaluation", () => {
  it("scores deterministic exact-match cases with weights", () => {
    const result = evaluateCases([
      { id: "a", expected: "yes", actual: " yes ", weight: 2 },
      { id: "b", expected: "no", actual: "maybe", weight: 1 },
    ]);
    expect(result).toEqual({ total: 2, passed: 1, weightedScore: 2 / 3, failures: ["b"] });
    expect(toIntegrationReport("suite-1", result).contract).toBe("skyevaluation.v1");
  });

  it("rejects duplicate ids", () => {
    expect(() => evaluateCases([
      { id: "dup", expected: "x", actual: "x" },
      { id: "dup", expected: "y", actual: "y" },
    ])).toThrow(/duplicate/);
  });

  it("rejects invalid weights and empty suites", () => {
    expect(() => evaluateCases([])).toThrow(RangeError);
    expect(() => evaluateCases([{ id: "x", expected: "x", actual: "x", weight: 0 }])).toThrow(RangeError);
  });
});
