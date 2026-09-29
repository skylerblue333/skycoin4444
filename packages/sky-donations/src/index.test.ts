import { describe, expect, it } from "vitest";
import {
  DonationLedger,
  cancelDonation,
  createDonation,
  createDonationAcknowledgement,
  markRecorded,
  toIntegrationEvent,
} from "./index";

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
    expect(toIntegrationEvent(recorded)).toEqual({
      type: "skyhope.donation.recorded",
      donationId: "don-1",
      campaignId: "camp-1",
      amountMinor: 2500,
      currency: "USD",
    });
  });

  it("rejects invalid money and impossible timestamps", () => {
    expect(() => createDonation({ ...input, amountMinor: 1.5 })).toThrow(RangeError);
    expect(() => createDonation({ ...input, currency: "usd" })).toThrow(TypeError);
    expect(() =>
      createDonation({ ...input, createdAt: "2026-02-30T00:00:00Z" }),
    ).toThrow(TypeError);
  });

  it("revalidates mutable records before transitions and emission", () => {
    const pledged = createDonation(input);
    pledged.amountMinor = -1;
    expect(() => markRecorded(pledged)).toThrow(RangeError);

    const recorded = markRecorded(createDonation(input));
    recorded.currency = "usd";
    expect(() => toIntegrationEvent(recorded)).toThrow(TypeError);
  });

  it("prevents cancellation after a donation is recorded", () => {
    expect(() => cancelDonation(markRecorded(createDonation(input)))).toThrow();
  });

  it("provides a truthful acknowledgement rather than a fake payment or tax receipt", () => {
    expect(createDonationAcknowledgement(createDonation(input))).toEqual({
      contract: "skyhope.donation.acknowledgement.v1",
      donationId: "don-1",
      campaignId: "camp-1",
      amountMinor: 2500,
      currency: "USD",
      status: "pledged",
      paymentExecutedBySkycoin4444: false,
      settlementVerified: false,
      taxReceipt: false,
    });
  });

  it("replays identical pledge requests by idempotency key", () => {
    const ledger = new DonationLedger();
    expect(ledger.pledge(input, "request:1")).toEqual(
      ledger.pledge(input, "request:1"),
    );
    expect(ledger.snapshot()).toMatchObject({
      idempotencyEntries: 1,
      persistencePerformed: false,
      externalPaymentExecutionPerformed: false,
    });
  });

  it("fails closed when an idempotency key is reused with different money", () => {
    const ledger = new DonationLedger();
    ledger.pledge(input, "request:2");
    expect(() =>
      ledger.pledge({ ...input, amountMinor: 9999 }, "request:2"),
    ).toThrow("idempotency key reused with different donation input");
  });

  it("keeps campaign records isolated and lifecycle transitions explicit", () => {
    const ledger = new DonationLedger();
    ledger.pledge(input, "request:a");
    ledger.pledge(
      {
        ...input,
        id: "don-2",
        campaignId: "camp-2",
        createdAt: "2026-08-25T00:01:00Z",
      },
      "request:b",
    );

    expect(ledger.listForCampaign("camp-1").map(item => item.id)).toEqual([
      "don-1",
    ]);
    expect(ledger.markRecorded("don-1").status).toBe("recorded");
    expect(() => ledger.cancel("don-1")).toThrow(
      "recorded donations cannot be cancelled",
    );
  });
});
