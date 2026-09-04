import { describe, expect, it } from "vitest";
import {
  getEventFabricSnapshot,
  skycoinEventRegistry,
} from "./eventRegistry";

describe("event fabric server registry", () => {
  it("has a deterministic registry with truthful transport boundaries", () => {
    const snapshot = getEventFabricSnapshot();

    expect(snapshot.registryFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(snapshot.registryFingerprint).toBe(skycoinEventRegistry.fingerprint);
    expect(snapshot.descriptors.map(item => item.eventType)).toEqual([
      "beta.feedback.submitted",
      "social.follow.created",
      "social.post.created",
    ]);
    expect(snapshot.durableOutboxSchema).toBe(true);
    expect(snapshot.idempotencyHeader).toBe("Idempotency-Key");
    expect(snapshot.idempotentMutationScopes).toEqual([
      "beta.feedback.submit",
      "social.post.create",
    ]);
    expect(snapshot.idempotencyRecordExpiryConfigured).toBe(false);
    expect(snapshot.dispatcherConfigured).toBe(false);
    expect(snapshot.externalTransportConfigured).toBe(false);
    expect(snapshot.productionDeliveryClaim).toBe(false);
  });
});
