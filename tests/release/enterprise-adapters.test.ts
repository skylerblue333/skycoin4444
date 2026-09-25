import { describe, expect, it } from "vitest";
import {
  ENTERPRISE_ADAPTERS,
  assessIntegrationCoverage,
  createAdapterCommand,
  inspectAdapterReadiness,
} from "../../packages/sky-enterprise-adapters/src/index";

describe("enterprise adapter release contract", () => {
  it("keeps external integrations explicit, broad, and non-executing by default", () => {
    expect(ENTERPRISE_ADAPTERS.length).toBeGreaterThanOrEqual(70);
    const ids = new Set(ENTERPRISE_ADAPTERS.map((item) => item.id));
    expect(ids.has("okta")).toBe(true);
    expect(ids.has("salesforce")).toBe(true);
    expect(ids.has("stripe")).toBe(true);
    expect(ids.has("opentelemetry-collector")).toBe(true);

    expect(inspectAdapterReadiness("okta", {})).toMatchObject({
      status: "unconfigured",
      externalConnectivityVerified: false,
      networkCallPerformed: false,
    });

    expect(
      createAdapterCommand({
        adapterId: "opentelemetry-collector",
        capability: "observability.traces",
        requestId: "release-contract",
        payload: { source: "release-contract" },
      }),
    ).toMatchObject({
      requiresExternalExecution: true,
      networkCallPerformed: false,
    });
  });

  it("exposes integration gaps instead of manufacturing success", () => {
    const coverage = assessIntegrationCoverage([
      { capability: "sso.saml", criticality: "required" },
      { capability: "notification.email", criticality: "required" },
      { capability: "storage.objects", criticality: "required" },
      { capability: "observability.metrics", criticality: "required" },
    ]);

    expect(coverage.every((item) => item.status === "catalog-only")).toBe(true);
    expect(coverage.every((item) => item.configuredAdapters.length === 0)).toBe(true);
  });
});
