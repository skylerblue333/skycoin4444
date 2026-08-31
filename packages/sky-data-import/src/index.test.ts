import { describe, expect, it } from "vitest";
import { planImport } from "./index";

const checksum = "a".repeat(64);

describe("SkyDataImport", () => {
  it("creates bounded import plans", () => {
    expect(
      planImport({
        sourceId: "upload:1",
        dataset: "profile",
        format: "jsonl",
        recordCount: 100,
        checksum,
      }).requiresReview
    ).toBe(false);
  });

  it("flags large imports for review", () => {
    expect(
      planImport({
        sourceId: "upload:2",
        dataset: "profile",
        format: "csv",
        recordCount: 10_001,
        checksum,
      }).requiresReview
    ).toBe(true);
  });

  it("rejects malformed checksums", () => {
    expect(() =>
      planImport({
        sourceId: "upload:1",
        dataset: "profile",
        format: "csv",
        recordCount: 1,
        checksum: "bad",
      })
    ).toThrow("invalid checksum");
  });
});
