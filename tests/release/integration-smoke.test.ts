import { describe, expect, it } from "vitest";
import {
  createEventPublishedContract,
} from "../../packages/sky-events/src/index";
import {
  createAuditRecord,
  redactAuditMetadata,
} from "../../packages/sky-audit/src/index";
import {
  buildAgentPlan,
  nextReadySteps,
} from "../../packages/hopeai-agent-runtime/src/index";
import {
  MessagingService,
  type MessagingNotificationContract,
} from "../../packages/sky-messaging/src/index";
import {
  createListing,
  transitionListing,
} from "../../packages/sky-marketplace-core/src/index";
import { quoteCheckout } from "../../packages/sky-checkout/src/index";
import {
  applyPlannedDebit,
  planTransfer,
} from "../../packages/sky4-wallet-engine/src/index";

describe("post-Wave-2 integration smoke", () => {
  it("hands a normalized SkyEvents contract into the SkyAudit boundary deterministically", () => {
    const published = createEventPublishedContract({
      id: " evt-001 ",
      type: " identity.session.created ",
      actorId: " user-42 ",
      subjectId: " session-7 ",
      occurredAt: "2026-08-30T20:00:00-05:00",
      payload: { source: "release-smoke", token: "must-not-be-copied" },
    });

    expect(published).toEqual({
      type: "sky.events.published.v1",
      event: {
        id: "evt-001",
        type: "identity.session.created",
        actorId: "user-42",
        subjectId: "session-7",
        occurredAt: "2026-08-31T01:00:00.000Z",
        payload: { source: "release-smoke", token: "must-not-be-copied" },
      },
    });

    const safeMetadata = redactAuditMetadata({
      eventContract: published.type,
      eventId: published.event.id,
      token: String(published.event.payload?.token),
    });

    const audit = createAuditRecord({
      actorId: published.event.actorId!,
      action: published.event.type,
      resource: published.event.subjectId!,
      occurredAt: published.event.occurredAt,
      metadata: safeMetadata as Record<string, string | number | boolean>,
    });

    expect(audit.actorId).toBe("user-42");
    expect(audit.action).toBe("identity.session.created");
    expect(audit.resource).toBe("session-7");
    expect(audit.occurredAt).toBe("2026-08-31T01:00:00.000Z");
    expect(audit.metadata).toEqual({
      eventContract: "sky.events.published.v1",
      eventId: "evt-001",
      token: "[REDACTED]",
    });

    const replay = createAuditRecord({
      actorId: published.event.actorId!,
      action: published.event.type,
      resource: published.event.subjectId!,
      occurredAt: published.event.occurredAt,
      metadata: safeMetadata as Record<string, string | number | boolean>,
    });
    expect(replay.id).toBe(audit.id);
    expect(replay.canonical).toBe(audit.canonical);
  });

  it("fails closed when the producer contract carries an invalid event instant", () => {
    expect(() =>
      createEventPublishedContract({
        id: "evt-invalid",
        type: "identity.session.created",
        actorId: "user-42",
        occurredAt: "not-an-instant",
      }),
    ).toThrow(/occurredAt/);
  });

  it("hands a deterministic HopeAI plan into Messaging without duplicating delivery", () => {
    const plan = buildAgentPlan("agent:hope", [
      {
        id: "step:draft",
        kind: "prompt",
        input: "Draft a safe summary for the conversation",
      },
      {
        id: "step:review",
        kind: "decision",
        input: "Review the draft before any external action",
        dependsOn: ["step:draft"],
      },
    ]);
    const ready = nextReadySteps(plan, new Set());
    expect(ready.map((step) => step.id)).toEqual(["step:draft"]);

    const notifications: MessagingNotificationContract[] = [];
    const messaging = new MessagingService({
      now: () => 1_000,
      threadIdFactory: () => "thread:ai-smoke",
      messageIdFactory: () => "msg:ai-smoke",
      onNotification: (event) => notifications.push(event),
    });
    const thread = messaging.createThread(["agent:hope", "user:42"]);

    const first = messaging.send({
      threadId: thread.id,
      senderId: "agent:hope",
      body: ready[0]!.input,
      clientRequestId: plan.planId,
    });
    const replay = messaging.send({
      threadId: thread.id,
      senderId: "agent:hope",
      body: ready[0]!.input,
      clientRequestId: plan.planId,
    });

    expect(replay.id).toBe(first.id);
    expect(messaging.list(thread.id, "user:42")).toHaveLength(1);
    expect(notifications).toEqual([
      {
        type: "message.created",
        threadId: "thread:ai-smoke",
        messageId: "msg:ai-smoke",
        senderId: "agent:hope",
        recipientIds: ["user:42"],
        occurredAt: 1_000,
      },
    ]);
  });

  it("rejects a tampered HopeAI plan before it can drive downstream work", () => {
    const plan = buildAgentPlan("agent:hope", [
      {
        id: "step:draft",
        kind: "prompt",
        input: "Draft a safe summary",
      },
    ]);

    expect(() =>
      nextReadySteps({ ...plan, planId: "0".repeat(64) }, new Set()),
    ).toThrow("agent plan integrity check failed");
  });

  it("composes Marketplace, Checkout and Wallet as a provider-free commerce intent", () => {
    const listing = transitionListing(
      createListing({
        id: "sku:course-1",
        sellerId: "acct:seller",
        title: "Creator course",
        description: "A deterministic integration-smoke listing.",
        priceMinor: 2_500,
        currency: "USD",
      }),
      "active",
    );

    const quote = quoteCheckout({
      checkoutId: "checkout:smoke",
      currency: listing.currency,
      lines: [
        {
          sku: listing.id,
          quantity: 2,
          unitAmountMinor: listing.priceMinor,
        },
      ],
      taxAmountMinor: 250,
      discountAmountMinor: 250,
    });
    expect(quote.totalAmountMinor).toBe(5_000);

    const buyer = {
      accountId: "acct:buyer",
      publicKey: "b".repeat(64),
      balance: 10_000n,
      nextNonce: 0n,
    } as const;
    const plan = planTransfer({
      account: buyer,
      destination: listing.sellerId,
      amount: BigInt(quote.totalAmountMinor),
      fee: 10n,
    });

    expect(plan.amount).toBe(5_000n);
    expect(plan.destination).toBe("acct:seller");

    const next = applyPlannedDebit(buyer, plan);
    expect(next.balance).toBe(4_990n);
    expect(next.nextNonce).toBe(1n);
    expect(buyer.balance).toBe(10_000n);
  });

  it("fails closed when the commerce intent exceeds the local wallet balance", () => {
    const quote = quoteCheckout({
      checkoutId: "checkout:overdraft",
      currency: "USD",
      lines: [{ sku: "sku:course-1", quantity: 1, unitAmountMinor: 5_000 }],
    });
    const buyer = {
      accountId: "acct:buyer",
      publicKey: "b".repeat(64),
      balance: 5_000n,
      nextNonce: 0n,
    } as const;

    expect(() =>
      planTransfer({
        account: buyer,
        destination: "acct:seller",
        amount: BigInt(quote.totalAmountMinor),
        fee: 1n,
      }),
    ).toThrow("insufficient wallet balance");
  });
});
