import { describe, expect, it } from "vitest";
import { createVisionJob, validateVisionResultEnvelope } from "./skyVision";

describe("SkyVision", () => {
  const job = createVisionJob({
    id: "vision:1",
    assetId: "asset:1",
    task: "detect",
    requestedAtMs: 100,
    maxResults: 5,
  });

  it("validates bounded vision job metadata", () => {
    expect(job).toEqual({
      id: "vision:1",
      assetId: "asset:1",
      task: "detect",
      requestedAtMs: 100,
      maxResults: 5,
    });
  });

  it("accepts matching caller-supplied result metadata", () => {
    expect(
      validateVisionResultEnvelope(
        {
          jobId: "vision:1",
          provider: "provider:local-test",
          completedAtMs: 120,
          resultCount: 2,
        },
        job
      )
    ).toEqual({
      jobId: "vision:1",
      provider: "provider:local-test",
      completedAtMs: 120,
      resultCount: 2,
    });
  });

  it("rejects result counts beyond job policy", () => {
    expect(() =>
      validateVisionResultEnvelope(
        {
          jobId: "vision:1",
          provider: "provider:local-test",
          completedAtMs: 120,
          resultCount: 6,
        },
        job
      )
    ).toThrow("resultCount exceeds the job policy");
  });

  it("rejects mismatched job IDs", () => {
    expect(() =>
      validateVisionResultEnvelope(
        {
          jobId: "vision:other",
          provider: "provider:local-test",
          completedAtMs: 120,
          resultCount: 1,
        },
        job
      )
    ).toThrow("vision result does not match job");
  });
});
