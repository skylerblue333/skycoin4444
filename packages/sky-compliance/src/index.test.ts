import { describe, expect, it } from "vitest";
import { summarizeControls } from "./index";

describe("SkyCompliance", () => {
  it("summarizes explicit control states", () => {
    expect(
      summarizeControls([
        { controlId: "AC-1", status: "pass", evidenceRefs: ["artifact:1"] },
        { controlId: "AC-2", status: "fail", evidenceRefs: [] },
        { controlId: "AC-3", status: "not-applicable", evidenceRefs: [] },
      ])
    ).toEqual({ total: 3, passing: 1, failing: 1, notApplicable: 1 });
  });

  it("rejects duplicate controls", () => {
    expect(() =>
      summarizeControls([
        { controlId: "AC-1", status: "pass", evidenceRefs: [] },
        { controlId: "AC-1", status: "pass", evidenceRefs: [] },
      ])
    ).toThrow("duplicate controlId");
  });

  it("rejects invalid evidence references", () => {
    expect(() =>
      summarizeControls([{ controlId: "AC-1", status: "pass", evidenceRefs: ["bad ref"] }])
    ).toThrow("invalid evidenceRef");
  });
});
