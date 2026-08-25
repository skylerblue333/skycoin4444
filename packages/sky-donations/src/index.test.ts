import { describe, expect, it } from "vitest";
import { cancelDonation, createDonation, markRecorded, toIntegrationEvent } from "./index";

const input = {
  id: "don-1",
  donorId: "user-1",
  campaignId: "camp-1",
  amountMinor: 2500,
  currency: "USD",
  createdAt: "2026-08-25T00:00:00Z",
};

describe("SkyDonations", () => {
  it("creates a deterministic pledged donation and records it", () => {
    const pledged = createDonation(input);
    expect(pledged.status).toBe("pledged");
    const recorded = markRecorded(pledged);
    expect(recorded.status).toBe("recorded");
    expect(toIntegrationEvent(recorded)).toEqual({
      type: "skyhope.donation.recorded",
      donationId: "don-1",
      campaignId: "camp-1",
      amountMinor: 2500,
      currency: "USD",
    });
  });

  it("rejects invalid money input", () => {
    expect(() => createDonation({ ...input, amountMinor: 1.5 })).toThrow(RangeError);
    expect(() => createDonation({ ...input, currency: "usd" })).toThrow(TypeError);
  });

  it("prevents cancellation after a donation is recorded", () => {
    expect(() => cancelDonation(markRecorded(createDonation(input)))).toThrow();
  });
});
