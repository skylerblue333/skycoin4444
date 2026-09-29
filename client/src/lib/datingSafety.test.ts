import { describe, expect, it } from "vitest";
import {
  buildDateSafetySummary,
  dateSafetyPlanReadiness,
  detectDatingSafetySignals,
} from "./datingSafety";

describe("dating safety helpers", () => {
  it("flags high-risk language without claiming a person is fraudulent", () => {
    expect(
      detectDatingSafetySignals(
        "Send crypto right now and give me your recovery phrase. Keep this secret."
      ).map(item => item.signal)
    ).toEqual([
      "money_or_crypto",
      "credentials_or_secrets",
      "secrecy_or_isolation",
      "threats_or_pressure",
    ]);
  });

  it("does not flag ordinary conversation", () => {
    expect(
      detectDatingSafetySignals(
        "Would you like to meet for coffee Saturday afternoon?"
      )
    ).toEqual([]);
  });

  it("scores a complete local date-safety plan", () => {
    expect(
      dateSafetyPlanReadiness({
        publicPlace: "Busy coffee shop",
        transportation: "Drive myself",
        checkInPlan: "Text a friend at 8pm",
        startTime: "18:30",
        endTime: "20:30",
        exitPlan: "Leave independently if uncomfortable",
      })
    ).toEqual({ percent: 100, missing: [] });
  });

  it("builds a shareable summary without inventing details", () => {
    const summary = buildDateSafetySummary({
      publicPlace: "Library cafe",
      transportation: "",
      checkInPlan: "Call a friend",
      startTime: "17:00",
      endTime: "",
      exitPlan: "Use my own ride",
    });
    expect(summary).toContain("Public meeting place: Library cafe");
    expect(summary).toContain("Transportation: not set");
    expect(summary).toContain("End/check-out time: not set");
  });
});
