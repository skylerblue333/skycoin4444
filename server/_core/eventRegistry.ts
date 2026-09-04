import type { Express } from "express";
import {
  compileEventRegistry,
  type EventDescriptor,
} from "../../packages/event-fabric/src/index";

const descriptors: readonly EventDescriptor[] = [
  {
    eventType: "beta.feedback.submitted",
    currentVersion: 1,
    owner: "beta-feedback",
    description:
      "A bounded engineering-beta feedback record and audit record were persisted.",
    classification: "sensitive",
  },
  {
    eventType: "social.follow.created",
    currentVersion: 1,
    owner: "social",
    description:
      "A unique social follow edge, notification, and outbox event were persisted atomically.",
    classification: "internal",
  },
  {
    eventType: "social.post.created",
    currentVersion: 1,
    owner: "social",
    description:
      "A bounded social post record was persisted for an authenticated account.",
    classification: "internal",
  },
];

export const skycoinEventRegistry = compileEventRegistry(descriptors);

export function getEventFabricSnapshot(
  env: NodeJS.ProcessEnv = process.env
) {
  const internalDispatcherEnabled =
    env.EVENT_OUTBOX_DISPATCHER_ENABLED === "true";

  return Object.freeze({
    contract: "skycoin4444.event-fabric.v1" as const,
    registryFingerprint: skycoinEventRegistry.fingerprint,
    descriptors: skycoinEventRegistry.descriptors,
    durableOutboxSchema: true as const,
    idempotencyLedgerSchema: true as const,
    idempotencyHeader: "Idempotency-Key" as const,
    idempotentMutationScopes: [
      "beta.feedback.submit",
      "social.post.create",
    ] as const,
    idempotencyRecordExpiryConfigured: false as const,
    dispatcherConfigured: internalDispatcherEnabled,
    dispatcherMode: internalDispatcherEnabled
      ? ("internal_observer" as const)
      : ("disabled" as const),
    internalConsumer: "platform-event-observer" as const,
    durableConsumerReceipts: true as const,
    externalTransportConfigured: false as const,
    productionDeliveryClaim: false as const,
    limitation:
      "Selected create mutations support replay-safe Idempotency-Key handling. The optional dispatcher can lease, retry, dead-letter, and internally observe outbox events with durable consumer receipts, but no external broker/transport, automatic idempotency-record expiry, or exactly-once external delivery is claimed.",
  });
}

export function registerEventFabricRoutes(app: Express): void {
  app.get("/api/platform/events/registry", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(getEventFabricSnapshot());
  });
}
