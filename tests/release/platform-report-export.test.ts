import { describe, expect, it } from "vitest";
import { buildPlatformReportCsv, platformReportFilename } from "@/lib/platformReport";

describe("platform report export", () => {
  it("quotes values and escapes embedded quotes", () => {
    expect(buildPlatformReportCsv([["Metric", "Value"], ["Learner, active", "She said \"ready\""]])).toBe(
      '"Metric","Value"\n"Learner, active","She said ""ready"""',
    );
  });

  it("creates safe, scoped filenames", () => {
    expect(platformReportFilename("this month", "中文 / beta")).toBe(
      "skycoin4444-platform-report-this-month-beta.csv",
    );
    expect(platformReportFilename("week", null)).toBe(
      "skycoin4444-platform-report-week-all-languages.csv",
    );
  });
});
