import { describe, expect, it } from "vitest";
import {
  createV3JourneyEvidenceReceipt,
  getV3JourneyEvidenceCoveragePercent,
  getV3JourneyStageReceipt,
  normalizeV3JourneyEvidenceJournal,
  removeV3JourneyEvidenceReceipt,
  upsertV3JourneyEvidenceReceipt,
} from "./v3JourneyEvidence";

describe("V3 journey evidence journal", () => {
  it("normalizes only valid tester-confirmed evidence for known stages", () => {
    const journal = normalizeV3JourneyEvidenceJournal({
      commerce: [
        {
          id: "receipt-1",
          journeyId: "commerce",
          stageId: "cart",
          route: "/something-else",
          note: "Cart restored after a full browser refresh.",
          recordedAt: "2026-09-15T18:00:00.000Z",
          source: "tester-confirmed",
        },
        {
          id: "receipt-2",
          journeyId: "commerce",
          stageId: "unknown-stage",
          route: "/beta-commerce",
          note: "This should be rejected because the stage does not exist.",
          recordedAt: "2026-09-15T18:01:00.000Z",
          source: "tester-confirmed",
        },
      ],
      fake: [],
    });

    expect(journal.commerce).toHaveLength(1);
    expect(journal.commerce?.[0]).toMatchObject({
      stageId: "cart",
      route: "/beta-commerce",
      source: "tester-confirmed",
    });
    expect((journal as Record<string, unknown>).fake).toBeUndefined();
  });

  it("creates bounded receipts tied to the canonical journey route", () => {
    const receipt = createV3JourneyEvidenceReceipt({
      id: "  receipt-social  ",
      journeyId: "social",
      stageId: "publish",
      note: "  Post still exists after refresh and belongs to the signed-in tester.  ",
      recordedAt: "2026-09-15T18:10:00.000Z",
    });

    expect(receipt.id).toBe("receipt-social");
    expect(receipt.route).toBe("/activity-feed");
    expect(receipt.note).toBe(
      "Post still exists after refresh and belongs to the signed-in tester."
    );
    expect(receipt.source).toBe("tester-confirmed");
  });

  it("keeps one current receipt per stage and reports evidence coverage", () => {
    const first = createV3JourneyEvidenceReceipt({
      id: "first",
      journeyId: "web3",
      stageId: "environment",
      note: "Fixture and testnet labels were visible before any asset inspection.",
      recordedAt: "2026-09-15T18:20:00.000Z",
    });
    const replacement = createV3JourneyEvidenceReceipt({
      id: "replacement",
      journeyId: "web3",
      stageId: "environment",
      note: "Retest confirmed the environment labels remain explicit after refresh.",
      recordedAt: "2026-09-15T18:21:00.000Z",
    });

    let journal = upsertV3JourneyEvidenceReceipt({}, first);
    journal = upsertV3JourneyEvidenceReceipt(journal, replacement);

    expect(journal.web3).toHaveLength(1);
    expect(getV3JourneyStageReceipt(journal, "web3", "environment")?.id).toBe(
      "replacement"
    );
    expect(getV3JourneyEvidenceCoveragePercent(journal, "web3")).toBe(17);

    journal = removeV3JourneyEvidenceReceipt(journal, "web3", "environment");
    expect(getV3JourneyEvidenceCoveragePercent(journal, "web3")).toBe(0);
  });

  it("rejects notes that are too short or timestamps that are not real dates", () => {
    expect(() =>
      createV3JourneyEvidenceReceipt({
        id: "short",
        journeyId: "ai",
        stageId: "execute",
        note: "tiny",
        recordedAt: "2026-09-15T18:30:00.000Z",
      })
    ).toThrow(/at least 8/);

    expect(() =>
      createV3JourneyEvidenceReceipt({
        id: "bad-date",
        journeyId: "learning",
        stageId: "assess",
        note: "Assessment feedback matched the authored answer key.",
        recordedAt: "not-a-date",
      })
    ).toThrow(/timestamp/);
  });
});
