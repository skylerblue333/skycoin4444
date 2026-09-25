import { describe, expect, it } from "vitest";
import {
  ENTERPRISE_ADAPTERS,
  assessIntegrationCoverage,
  createAdapterCommand,
  inspectAdapterReadiness,
  listEnterpriseAdapters,
  summarizeIntegrationGaps,
} from "./index";

describe("Sky enterprise adapters", () => {
  it("ships a broad, unique enterprise catalog without claiming provider connectivity", () => {
    expect(ENTERPRISE_ADAPTERS.length).toBeGreaterThanOrEqual(70);
    expect(new Set(ENTERPRISE_ADAPTERS.map((item) => item.id)).size).toBe(
      ENTERPRISE_ADAPTERS.length,
    );
    expect(new Set(ENTERPRISE_ADAPTERS.map((item) => item.category)).size).toBe(18);
    expect(ENTERPRISE_ADAPTERS.every((item) => item.externalExecutionRequired)).toBe(true);
  });

  it("finds useful adapters by normalized enterprise capability", () => {
    expect(listEnterpriseAdapters({ capability: "sso.saml" }).map((item) => item.id)).toEqual([
      "keycloak",
      "microsoft-entra-id",
      "okta",
      "ping-identity",
      "workos",
    ]);
    expect(
      listEnterpriseAdapters({ capability: "payments.checkout" }).map((item) => item.id),
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
        stripe: {
          STRIPE_SECRET_KEY: "test",
          STRIPE_WEBHOOK_SECRET: "test",
        },
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
