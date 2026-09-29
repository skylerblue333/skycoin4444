import fs from "node:fs";
import { describe, expect, it } from "vitest";

const donation = fs.readFileSync(
  "client/src/pages/DonationProcessing.tsx",
  "utf8"
);
const fundraiser = fs.readFileSync(
  "client/src/pages/FundraiserTools.tsx",
  "utf8"
);

describe("SkyHope private HopeAI handoff and local draft boundary", () => {
  it("keeps user-authored SkyHope details out of HopeAI query strings", () => {
    expect(donation).toContain("HOPEAI_PRIVATE_HANDOFF_PROMPT");
    expect(donation).toContain("const privateReviewBrief");
    expect(donation).toContain(
      "navigator.clipboard.writeText(privateReviewBrief)"
    );
    expect(donation).toContain(
      "encodeURIComponent(HOPEAI_PRIVATE_HANDOFF_PROMPT)"
    );
    expect(donation).not.toMatch(/encodeURIComponent\(privateReviewBrief\)/);

    expect(fundraiser).toContain("HOPEAI_PRIVATE_HANDOFF_PROMPT");
    expect(fundraiser).toContain(
      "encodeURIComponent(HOPEAI_PRIVATE_HANDOFF_PROMPT)"
    );
    expect(fundraiser).toContain("navigator.clipboard.writeText(organizerBrief)");
    expect(fundraiser).not.toMatch(/encodeURIComponent\(organizerBrief\)/);
  });

  it("validates and bounds fundraiser drafts before browser persistence", () => {
    expect(fundraiser).toContain("MAX_SAVED_DRAFT_CHARS = 4_096");
    expect(fundraiser).toContain(
      "const validatedPlan = createSkyHopeCampaignPlan(draft)"
    );
    expect(fundraiser).toContain(
      "const normalizedDraft = draftFromPlan(validatedPlan)"
    );
    expect(fundraiser).toContain(
      "window.localStorage.setItem(SKYHOPE_DRAFT_KEY, serialized)"
    );
    expect(fundraiser).toContain(
      "window.localStorage.removeItem(SKYHOPE_DRAFT_KEY)"
    );
    expect(fundraiser).toMatch(/maxLength=\{120\}/);
    expect(fundraiser).toMatch(/maxLength=\{600\}/);
    expect(fundraiser).toMatch(/maxLength=\{240\}/);
  });

  it("documents the browser-storage and beneficiary privacy boundary in the UI", () => {
    expect(fundraiser).toMatch(/not encrypted\s+beneficiary records/);
    expect(fundraiser).toMatch(/Do not enter names, precise addresses/);
    expect(fundraiser).toMatch(/keeps organizer-brief\s+details out of the HopeAI URL/);

    expect(donation).toMatch(/details are kept out of\s+the HopeAI URL/);
    expect(donation).toMatch(/Avoid names, contact details, account numbers/);
  });
});
