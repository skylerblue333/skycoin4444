import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { v3Journeys } from "../../client/src/lib/v3Journeys";

const palette = fs.readFileSync(
  "client/src/components/V3CommandPalette.tsx",
  "utf8"
);
const navigator = fs.readFileSync(
  "client/src/components/V3JourneyNavigator.tsx",
  "utf8"
);

describe("V3 deep journey release contract", () => {
  it("keeps all seven strategic products in the guided journey layer", () => {
    expect(v3Journeys).toHaveLength(7);
    expect(v3Journeys.map(journey => journey.id)).toEqual([
      "social",
      "gaming",
      "live",
      "commerce",
      "learning",
      "ai",
      "web3",
    ]);
    for (const journey of v3Journeys) {
      expect(journey.stages).toHaveLength(6);
    }
  });

  it("is reachable globally without replacing registry search", () => {
    expect(palette).toMatch(/V3JourneyNavigator/);
    expect(palette).toMatch(/Registry-backed discovery/);
    expect(navigator).toMatch(/Shift\+J/);
    expect(navigator).toMatch(/Finish loops, not screens/);
  });

  it("uses local progress and never presents completion as production certification", () => {
    expect(navigator).toMatch(/V3_JOURNEY_PROGRESS_KEY/);
    expect(navigator).toMatch(/local testing checklist/);
    expect(navigator).toMatch(/not usage analytics or production certification/);
    expect(navigator).toMatch(/Check stages only after the stated evidence exists/);
  });

  it("preserves explicit high-risk boundaries", () => {
    const combined = v3Journeys.map(journey => journey.boundary).join("\n");
    expect(combined).toMatch(/No real-money wagering/);
    expect(combined).toMatch(/Small-room direct WebRTC only/);
    expect(combined).toMatch(/No real sellers/);
    expect(combined).toMatch(/No claim of accreditation/);
    expect(combined).toMatch(/No claim of unavailable model\/provider connectivity/);
    expect(combined).toMatch(/No wallet custody/);
  });
});
