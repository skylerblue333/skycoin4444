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
    eventType: "social.post.created",
    currentVersion: 1,
    owner: "social",
    description:
      "A bounded social post record was persisted for an authenticated account.",
    classification: "internal",
  },
];

export const skycoinEventRegistry = compileEventRegistry(descriptors);

export function getEventFabricSnapshot() {
  return Object.freeze({
    contract: "skycoin4444.event-fabric.v1" as const,
    registryFingerprint: skycoinEventRegistry.fingerprint,
    descriptors: skycoinEventRegistry.descriptors,
    durableOutboxSchema: true as const,
    idempotencyLedgerSchema: true as const,
    dispatcherConfigured: false as const,
    externalTransportConfigured: false as const,
    productionDeliveryClaim: false as const,
    limitation:
      "Events are transactionally persisted to the local database outbox by selected mutations, but no external broker/transport or background dispatcher is claimed.",
  });
}

export function registerEventFabricRoutes(app: Express): void {
  app.get("/api/platform/events/registry", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(getEventFabricSnapshot());
  });
}
