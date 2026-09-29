import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");

describe("HopeAI Impact draft-storage boundary", () => {
  it("bounds and normalizes saved campaign drafts before browser persistence", () => {
    expect(charity).toContain("const MAX_SAVED_DRAFT_CHARS = 4_096");
    expect(charity).toContain("normalizeSkyHopeCampaignDraft(JSON.parse(raw))");
    expect(charity).toContain("window.localStorage.removeItem(SKYHOPE_DRAFT_KEY)");
    expect(charity).toContain("const validatedPlan = createSkyHopeCampaignPlan(draft)");
    expect(charity).toContain("const normalizedDraft = draftFromPlan(validatedPlan)");
    expect(charity).toContain("if (serialized.length > MAX_SAVED_DRAFT_CHARS)");
    expect(charity).toContain("Validated draft saved on this device.");
  });

  it("keeps UI input limits aligned with the validated local planning boundary", () => {
    expect(charity).toContain("maxLength={120}");
    expect(charity).toContain("maxLength={600}");
    expect(charity.match(/maxLength=\{240\}/g)?.length).toBeGreaterThanOrEqual(2);
    expect(charity).toContain("Validate + save on this device");
  });
});
