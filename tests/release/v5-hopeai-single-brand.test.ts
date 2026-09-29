import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const donation = fs.readFileSync("client/src/pages/DonationProcessing.tsx", "utf8");
const fundraiser = fs.readFileSync("client/src/pages/FundraiserTools.tsx", "utf8");

describe("HopeAI single-brand contract", () => {
  it("presents charity and impact as HopeAI capabilities, not a separate SkyHope product", () => {
    expect(charity).toContain("HopeAI · Impact");
    expect(charity).toContain("HopeAI includes an Impact workspace");
    expect(charity).not.toContain(">SkyHope<");
    expect(charity).not.toContain("SkyHope now focuses");

    expect(donation).toContain("HopeAI Impact donation-intent review");
    expect(donation).toContain("Back to HopeAI Impact");
    expect(donation).not.toContain("Back to SkyHope");

    expect(fundraiser).toContain("HopeAI · Impact tools");
    expect(fundraiser).toContain("HopeAI Impact organizer brief");
    expect(fundraiser).toContain("Back to HopeAI Impact");
    expect(fundraiser).not.toContain("SkyHope fundraiser tools");
    expect(fundraiser).not.toContain("Back to SkyHope");
  });

  it("keeps legacy internal compatibility identifiers while retiring the public product name", () => {
    expect(charity).toContain("SKYHOPE_DRAFT_KEY");
    expect(charity).toContain("createSkyHopeCampaignPlan");
    expect(donation).toContain("source=skyhope");
    expect(fundraiser).toContain("source=skyhope");
  });
});
