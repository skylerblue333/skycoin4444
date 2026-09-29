import { describe, expect, it } from "vitest";
import {
  ENTERPRISE_ADAPTERS,
  assessIntegrationCoverage,
  assertAdapterLiveExecutionReady,
  createAdapterCommand,
  createAdapterRuntimeEvidence,
  evaluateAdapterExecutionGate,
  inspectAdapterReadiness,
  listEnterpriseAdapters,
  summarizeIntegrationGaps,
} from "./index";

const STRIPE_CONFIG = Object.freeze({
  STRIPE_SECRET_KEY: "test",
  STRIPE_WEBHOOK_SECRET: "test",
});

describe("Sky enterprise adapters", () => {
  it("ships a broad, unique enterprise catalog without claiming provider connectivity", () => {
    expect(ENTERPRISE_ADAPTERS.length).toBeGreaterThanOrEqual(70);
    expect(new Set(ENTERPRISE_ADAPTERS.map((item) => item.id)).size).toBe(
      ENTERPRISE_ADAPTERS.length,
    );
    expect(new Set(ENTERPRISE_ADAPTERS.map((item) => item.category)).size).toBe(
      18,
    );
    expect(
      ENTERPRISE_ADAPTERS.every((item) => item.externalExecutionRequired),
    ).toBe(true);
  });

  it("finds useful adapters by normalized enterprise capability", () => {
    expect(
      listEnterpriseAdapters({ capability: "sso.saml" }).map(
        (item) => item.id,
      ),
    ).toEqual([
      "keycloak",
      "microsoft-entra-id",
      "okta",
      "ping-identity",
      "workos",
    ]);
    expect(
      listEnterpriseAdapters({ capability: "payments.checkout" }).map(
        (item) => item.id,
      ),
    ).toEqual(["adyen", "paypal", "square", "stripe"]);
  });

  it("reports credential presence without ever returning credential values", () => {
    const readiness = inspectAdapterReadiness("stripe", {
      STRIPE_SECRET_KEY: "do_not_echo",
      STRIPE_WEBHOOK_SECRET: "also_do_not_echo",
    });
    expect(readiness.status).toBe("ready-for-external-execution");
    expect(readiness.externalConnectivityVerified).toBe(false);
    expect(readiness.networkCallPerformed).toBe(false);
    expect(readiness.secretsPresent).toEqual([
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ]);
    expect(JSON.stringify(readiness)).not.toContain("do_not_echo");
  });

  it("fails closed on unknown config keys or incomplete required configuration", () => {
    expect(() =>
      inspectAdapterReadiness("stripe", {
        STRIPE_SECRET_KEY: "test",
        STRIPE_WEBHOOK_SECRET: "test",
        TYPO_SECRET: "test",
      }),
    ).toThrow("unknown config key");
    expect(
      inspectAdapterReadiness("stripe", { STRIPE_SECRET_KEY: "test" }),
    ).toMatchObject({
      status: "unconfigured",
      missing: ["STRIPE_WEBHOOK_SECRET"],
    });
  });

  it("does not treat configured credentials as live provider health", () => {
    expect(
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        nowMs: Date.parse("2026-09-28T20:00:00.000Z"),
      }),
    ).toEqual({
      adapterId: "stripe",
      allowed: false,
      reason: "missing-health-evidence",
      runtimeState: "missing",
      checkedAt: null,
      freshnessMs: null,
    });
  });

  it("rejects manufactured healthy state without authenticated runtime probe evidence", () => {
    expect(() =>
      createAdapterRuntimeEvidence({
        adapterId: "stripe",
        state: "healthy",
        authenticated: true,
        checkedAt: "2026-09-28T19:59:30.000Z",
        latencyMs: 42,
        networkCallPerformed: false,
        reason: null,
      }),
    ).toThrow("requires a completed runtime probe");

    expect(() =>
      createAdapterRuntimeEvidence({
        adapterId: "stripe",
        state: "healthy",
        authenticated: false,
        checkedAt: "2026-09-28T19:59:30.000Z",
        latencyMs: 42,
        networkCallPerformed: true,
        reason: null,
      }),
    ).toThrow("requires authenticated provider evidence");
  });

  it("allows only fresh healthy evidence for the exact configured adapter", () => {
    const nowMs = Date.parse("2026-09-28T20:00:00.000Z");
    const evidence = createAdapterRuntimeEvidence({
      adapterId: "stripe",
      state: "healthy",
      authenticated: true,
      checkedAt: "2026-09-28T19:59:30.000Z",
      latencyMs: 42,
      networkCallPerformed: true,
      reason: null,
    });

    expect(
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence,
        nowMs,
      }),
    ).toEqual({
      adapterId: "stripe",
      allowed: true,
      reason: "ready",
      runtimeState: "healthy",
      checkedAt: "2026-09-28T19:59:30.000Z",
      freshnessMs: 30_000,
    });

    expect(
      assertAdapterLiveExecutionReady({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence,
        nowMs,
      }).allowed,
    ).toBe(true);

    expect(
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence,
        nowMs: Date.parse("2026-09-28T20:10:00.000Z"),
      }),
    ).toMatchObject({
      allowed: false,
      reason: "stale-health-evidence",
      runtimeState: "healthy",
    });

    expect(
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence,
        nowMs: Date.parse("2026-09-28T19:58:00.000Z"),
      }),
    ).toMatchObject({
      allowed: false,
      reason: "future-health-evidence",
      runtimeState: "healthy",
    });
  });

  it("blocks degraded or failed provider observations even when configuration exists", () => {
    const failed = createAdapterRuntimeEvidence({
      adapterId: "stripe",
      state: "failed",
      authenticated: false,
      checkedAt: "2026-09-28T19:59:30.000Z",
      latencyMs: null,
      networkCallPerformed: true,
      reason: "provider health probe timed out",
    });

    expect(
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence: failed,
        nowMs: Date.parse("2026-09-28T20:00:00.000Z"),
      }),
    ).toMatchObject({
      allowed: false,
      reason: "runtime-unhealthy",
      runtimeState: "failed",
    });

    expect(() =>
      assertAdapterLiveExecutionReady({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence: failed,
        nowMs: Date.parse("2026-09-28T20:00:00.000Z"),
      }),
    ).toThrow("external execution blocked (runtime-unhealthy)");
  });

  it("rejects health evidence from a different provider", () => {
    const evidence = createAdapterRuntimeEvidence({
      adapterId: "paypal",
      state: "healthy",
      authenticated: true,
      checkedAt: "2026-09-28T19:59:30.000Z",
      latencyMs: 50,
      networkCallPerformed: true,
      reason: null,
    });

    expect(() =>
      evaluateAdapterExecutionGate({
        adapterId: "stripe",
        config: STRIPE_CONFIG,
        evidence,
        nowMs: Date.parse("2026-09-28T20:00:00.000Z"),
      }),
    ).toThrow("runtime evidence adapter mismatch");
  });

  it("creates bounded execution intents without performing external work", () => {
    expect(
      createAdapterCommand({
        adapterId: "salesforce",
        capability: "crm.contacts",
        requestId: "sync-42",
        subject: "account:7",
        payload: { operation: "upsert", contactId: "contact:3" },
      }),
    ).toMatchObject({
      contract: "sky.enterprise-adapter.command.v1",
      commandId: "enterprise:salesforce:sync-42",
      requiresExternalExecution: true,
      networkCallPerformed: false,
    });

    expect(() =>
      createAdapterCommand({
        adapterId: "salesforce",
        capability: "payments.checkout",
        requestId: "wrong-capability",
      }),
    ).toThrow("does not declare capability");
  });

  it("turns enterprise requirements into an explicit integration gap report", () => {
    const coverage = assessIntegrationCoverage(
      [
        { capability: "sso.saml", criticality: "required" },
        { capability: "payments.checkout", criticality: "required" },
        { capability: "observability.traces", criticality: "optional" },
      ],
      {
        stripe: STRIPE_CONFIG,
      },
    );

    expect(coverage.map((item) => item.status)).toEqual([
      "catalog-only",
      "configured",
      "catalog-only",
    ]);
    expect(summarizeIntegrationGaps(coverage)).toEqual({
      total: 3,
      configured: 1,
      catalogOnly: 2,
      missing: 0,
      requiredGaps: ["sso.saml"],
    });
  });
});
