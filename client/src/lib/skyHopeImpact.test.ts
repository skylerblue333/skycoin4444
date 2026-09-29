import { describe, expect, it } from "vitest";
import {
  createSkyHopeCampaignPlan,
  createVolunteerCapacityPlan,
  normalizeSkyHopeCampaignDraft,
  scoreImpactReadiness,
} from "./skyHopeImpact";

const draft = {
  title: "Weekend learning access",
  mission: "Coordinate volunteer-led digital learning sessions for families who request support.",
  beneficiaryScope: "Participating families in one local community",
  targetOutcome: "Completed learning sessions with participant feedback",
  targetCount: 40,
  durationDays: 60,
};

describe("SkyHope impact planning", () => {
  it("creates deterministic bounded campaign milestones", () => {
    const plan = createSkyHopeCampaignPlan(draft);
    expect(plan.provenance).toBe("deterministic-local-plan");
    expect(plan.milestones.map(item => item.targetDay)).toEqual([6, 15, 30, 60]);
    expect(plan.milestones.at(-1)?.label).toMatch(/Closeout/);
  });

  it("rejects empty, invalid, or implausibly large campaign inputs", () => {
    expect(() => createSkyHopeCampaignPlan({ ...draft, title: " " })).toThrow();
    expect(() => createSkyHopeCampaignPlan({ ...draft, targetCount: 0 })).toThrow();
    expect(() => createSkyHopeCampaignPlan({ ...draft, durationDays: 366 })).toThrow();
  });

  it("normalizes only valid device-local drafts", () => {
    expect(normalizeSkyHopeCampaignDraft(draft)).toEqual(draft);
    expect(normalizeSkyHopeCampaignDraft({ ...draft, targetCount: "bad" })).toBeNull();
    expect(normalizeSkyHopeCampaignDraft(null)).toBeNull();
  });

  it("scores impact evidence readiness without inventing outcomes", () => {
    expect(
      scoreImpactReadiness({
        needDefined: true,
        baselineCaptured: true,
        consentPlanned: false,
        metricDefined: true,
        updateCadenceDefined: false,
        privacyReviewed: true,
      })
    ).toEqual({
      score: 67,
      readyCount: 4,
      totalCount: 6,
      missing: [
        "Consent for sensitive stories/data is planned",
        "Update/reporting cadence is defined",
      ],
    });
  });

  it("calculates bounded volunteer capacity only", () => {
    expect(
      createVolunteerCapacityPlan({
        volunteerCount: 12,
        hoursPerVolunteerPerWeek: 2.5,
        weeks: 8,
      })
    ).toMatchObject({
      totalCapacityHours: 240,
      provenance: "deterministic-local-plan",
    });
    expect(() =>
      createVolunteerCapacityPlan({
        volunteerCount: 10,
        hoursPerVolunteerPerWeek: 0,
        weeks: 4,
      })
    ).toThrow();
  });
});
