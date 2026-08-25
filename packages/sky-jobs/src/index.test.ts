import { describe, expect, it } from "vitest";
import { canTransitionJob, matchCandidate, validateJobPosting } from "./index";

describe("SkyJobs", () => {
  const job = { id: "j1", title: "Engineer", organizationId: "o1", location: "Remote", skills: ["TypeScript", "API"], status: "open" as const };
  it("normalizes postings", () => expect(validateJobPosting(job).skills).toEqual(["api", "typescript"]));
  it("matches candidates deterministically", () => expect(matchCandidate(job, { id: "c1", skills: ["api"], preferredLocation: "Remote" })).toEqual({ score: 0.6, matchedSkills: ["api"] }));
  it("enforces basic lifecycle transitions", () => { expect(canTransitionJob("draft", "open")).toBe(true); expect(canTransitionJob("closed", "open")).toBe(false); });
});
