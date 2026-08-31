import { describe, expect, it } from "vitest";

import { buildAgentPlan, nextReadySteps } from "../../packages/hopeai-agent-runtime/src/index";
import { quoteCheckout } from "../../packages/sky-checkout/src/index";
import { evaluateCases, toIntegrationReport } from "../../packages/sky-evaluation/src/index";
import { toFeedIntegrationEvent } from "../../packages/sky-feed/src/index";
import { createNFTRecord, applyTransfer, planTransfer } from "../../packages/sky-nft-core/src/index";
import { gradeAnswer } from "../../packages/sky-question-bank/src/index";

describe("engineering-beta representative domain contracts", () => {
  it("covers education/content with deterministic question grading", () => {
    const result = gradeAnswer(
      {
        id: "question:beta:1",
        prompt: "Which option is the verified answer?",
        choices: ["first", "second", "third"],
        correctIndex: 1,
        tags: ["beta"],
      },
      1,
    );

    expect(result).toEqual({
      questionId: "question:beta:1",
      correct: true,
      selectedIndex: 1,
    });
  });

  it("covers social/communications with the feed integration contract", () => {
    const event = toFeedIntegrationEvent({
      id: "feed:beta:1",
      actorId: "user:beta",
      kind: "post",
      createdAt: "2026-08-31T15:00:00Z",
      visibility: "followers",
      rank: 10,
    });

    expect(event).toEqual({
      type: "feed.item_published",
      itemId: "feed:beta:1",
      actorId: "user:beta",
      kind: "post",
      visibility: "followers",
    });
  });

  it("covers finance/payment planning without claiming settlement", () => {
    const quote = quoteCheckout({
      checkoutId: "checkout:beta:1",
      currency: "usd",
      lines: [
        { sku: "COURSE-BETA", quantity: 2, unitAmountMinor: 1250 },
      ],
      taxAmountMinor: 200,
      discountAmountMinor: 100,
    });

    expect(quote).toMatchObject({
      contract: "sky.checkout.quote.v1",
      currency: "USD",
      subtotalMinor: 2500,
      totalAmountMinor: 2600,
    });
  });

  it("covers AI with a deterministic local agent plan", () => {
    const plan = buildAgentPlan("agent:beta", [
      { id: "prompt:1", kind: "prompt", input: "summarize" },
      { id: "decision:1", kind: "decision", input: "review", dependsOn: ["prompt:1"] },
    ]);

    expect(plan.planId).toMatch(/^[a-f0-9]{64}$/);
    expect(nextReadySteps(plan, new Set())).toHaveLength(1);
    expect(nextReadySteps(plan, new Set(["prompt:1"])).map((step) => step.id)).toEqual([
      "decision:1",
    ]);
  });

  it("covers analytics/evaluation with a weighted integration report", () => {
    const result = evaluateCases([
      { id: "metric:pass", expected: "yes", actual: "yes", weight: 3 },
      { id: "metric:fail", expected: "yes", actual: "no", weight: 1 },
    ]);
    const report = toIntegrationReport("suite:beta", result);

    expect(report.contract).toBe("skyevaluation.v1");
    expect(report.result).toMatchObject({
      total: 2,
      passed: 1,
      weightedScore: 0.75,
      failures: ["metric:fail"],
    });
  });

  it("covers Web3 as a local NFT transfer plan without chain execution", () => {
    const record = createNFTRecord("token:beta:1", "owner:alpha", "ipfs://beta-metadata");
    const transfer = planTransfer(record, "owner:beta", 1);
    const updated = applyTransfer(record, transfer);

    expect(transfer).toMatchObject({
      contract: "sky.nft.transfer.v1",
      chainExecutionPerformed: false,
      fromOwnerId: "owner:alpha",
      toOwnerId: "owner:beta",
    });
    expect(updated).toMatchObject({ ownerId: "owner:beta", version: 2 });
  });
});
