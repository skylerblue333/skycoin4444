import { describe, expect, it } from "vitest";
import {
  buildProviderRuntimeCatalog,
  buildServiceCatalog,
  createProviderRuntimeReport,
  createServiceDescriptor,
  findServicesByCapability,
  isProviderCallable,
  summarizeProviderRuntime,
} from "./skyServiceRegistry";

describe("SkyServiceRegistry", () => {
  const auth = createServiceDescriptor({
    id: "service:auth",
    owner: "team:identity",
    version: "1.0.0-beta.1",
    lifecycle: "beta",
    healthPath: "/healthz",
    capabilities: ["auth.session", "identity.read", "auth.session"],
  });

  const rewards = createServiceDescriptor({
    id: "service:rewards",
    owner: "team:finance",
    version: "1.0.0",
    lifecycle: "stable",
    healthPath: "/health",
    capabilities: ["rewards.balance"],
  });

  it("normalizes capabilities deterministically", () => {
    expect(auth.capabilities).toEqual(["auth.session", "identity.read"]);
  });

  it("builds a unique service catalog", () => {
    const catalog = buildServiceCatalog([auth, rewards]);
    expect(catalog.size).toBe(2);
    expect(catalog.get("service:auth")).toEqual(auth);
  });

  it("rejects duplicate service identifiers", () => {
    expect(() => buildServiceCatalog([auth, auth])).toThrow(
      "duplicate service id: service:auth"
    );
  });

  it("finds services by capability", () => {
    const catalog = buildServiceCatalog([rewards, auth]);
    expect(findServicesByCapability(catalog, "auth.session")).toEqual([auth]);
  });
});

describe("provider runtime boundary", () => {
  const liveProvider = createProviderRuntimeReport({
    providerId: "provider:verified-ai",
    serviceId: "service:hope-ai",
    state: "live",
    configured: true,
    authenticated: true,
    lastHealthCheckAt: "2026-09-16T20:00:00.000Z",
    latencyMs: 42,
    capabilities: ["ai.chat", "ai.chat", "ai.documents"],
  });

  const testProvider = createProviderRuntimeReport({
    providerId: "provider:local-ai",
    serviceId: "service:hope-ai",
    state: "test",
    configured: true,
    authenticated: false,
    lastHealthCheckAt: null,
    latencyMs: null,
    capabilities: ["ai.chat"],
  });

  it("fails closed when live state lacks authenticated runtime evidence", () => {
    expect(() =>
      createProviderRuntimeReport({
        providerId: "provider:unsafe",
        serviceId: "service:payments",
        state: "live",
        configured: true,
        authenticated: false,
        lastHealthCheckAt: null,
        latencyMs: null,
        capabilities: ["payments.execute"],
      })
    ).toThrow("live provider state requires");
  });

  it("keeps live and test execution namespaces distinct", () => {
    expect(isProviderCallable(liveProvider, "live")).toBe(true);
    expect(isProviderCallable(liveProvider, "test")).toBe(false);
    expect(isProviderCallable(testProvider, "test")).toBe(true);
    expect(isProviderCallable(testProvider, "live")).toBe(false);
  });

  it("requires truthful reasons for non-operational states", () => {
    expect(() =>
      createProviderRuntimeReport({
        providerId: "provider:video",
        serviceId: "service:video",
        state: "unavailable",
        configured: false,
        authenticated: false,
        lastHealthCheckAt: null,
        latencyMs: null,
        capabilities: ["video.calls"],
      })
    ).toThrow("unavailable provider state requires a reason");
  });

  it("rejects impossible authentication and health-latency claims", () => {
    expect(() =>
      createProviderRuntimeReport({
        providerId: "provider:email",
        serviceId: "service:notifications",
        state: "failed",
        configured: false,
        authenticated: true,
        lastHealthCheckAt: null,
        latencyMs: null,
        capabilities: ["email.send"],
        reason: "authentication failed",
      })
    ).toThrow("authenticated provider must also be configured");

    expect(() =>
      createProviderRuntimeReport({
        providerId: "provider:sms",
        serviceId: "service:notifications",
        state: "failed",
        configured: true,
        authenticated: false,
        lastHealthCheckAt: null,
        latencyMs: 10,
        capabilities: ["sms.send"],
        reason: "health probe failed",
      })
    ).toThrow("latencyMs requires a health-check timestamp");
  });

  it("deduplicates provider capabilities and rejects duplicate provider ids", () => {
    expect(liveProvider.capabilities).toEqual(["ai.chat", "ai.documents"]);
    expect(() =>
      buildProviderRuntimeCatalog([liveProvider, liveProvider])
    ).toThrow("duplicate provider id: provider:verified-ai");
  });

  it("summarizes provider states without inflating availability", () => {
    const unavailable = createProviderRuntimeReport({
      providerId: "provider:streaming",
      serviceId: "service:live",
      state: "unavailable",
      configured: false,
      authenticated: false,
      lastHealthCheckAt: null,
      latencyMs: null,
      capabilities: ["stream.ingest"],
      reason: "no streaming provider adapter is configured",
    });

    expect(
      summarizeProviderRuntime([liveProvider, testProvider, unavailable])
    ).toEqual({
      total: 3,
      states: {
        test: 1,
        pending: 0,
        live: 1,
        failed: 0,
        unavailable: 1,
      },
      liveCallable: 1,
      testCallable: 1,
    });
  });
});
