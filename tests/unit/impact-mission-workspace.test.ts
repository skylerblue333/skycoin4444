import { describe, expect, it } from "vitest";
import {
  buildImpactWorkspacePath,
  createImpactHopePrompt,
  createImpactSocialDraft,
} from "../../client/src/lib/impactMissionWorkspace";

describe("impact mission workspace", () => {
  it("orders the five major product paths consistently", () => {
    expect(
      buildImpactWorkspacePath([
        "charity",
        "gaming",
        "social",
        "education",
        "hopeai",
      ]).map(item => item.route),
    ).toEqual([
      "/hope-a-i",
      "/sky-school",
      "/activity-feed",
      "/gaming-for-charity",
      "/charity",
    ]);
  });

  it("creates a HopeAI planning prompt that preserves truth boundaries", () => {
    const prompt = createImpactHopePrompt({
      title: "Digital safety night",
      cause: "education",
      goal: "Teach one short lesson and recruit five volunteers.",
      selectedAreas: ["hopeai", "education", "social", "charity"],
    });

    expect(prompt).toMatch(/evidence checklist/i);
    expect(prompt).toMatch(/Do not claim that a donation/);
    expect(prompt).toMatch(/beneficiary, provider, legal, or safety check/);
  });

  it("creates a social draft without claiming verified outcomes", () => {
    expect(
      createImpactSocialDraft({
        title: "Neighborhood learning drive",
        cause: "community",
        update: "We completed our planning session and are inviting volunteers.",
      }),
    ).toMatch(/distinguish planned actions from completed external outcomes/);
  });
});
