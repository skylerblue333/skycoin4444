import { describe, expect, it } from "vitest";
import {
  AnalyticsAggregator,
  ContractRegistry,
  ENTERPRISE_FOUNDATION_PROVENANCE,
  FileEncryption,
  Organization,
  ProjectRegistry,
  createContractForOrganization,
  createProjectForOrganization,
  evaluatePolicy,
} from "./index";

describe("Sky enterprise foundation", () => {
  it("ports three version-pinned MIT sources", () => {
    expect(ENTERPRISE_FOUNDATION_PROVENANCE).toHaveLength(3);
    expect(
      ENTERPRISE_FOUNDATION_PROVENANCE.every(
        (source) => source.license === "MIT" && source.commit.length === 40,
      ),
    ).toBe(true);
  });

  it("enforces organization membership and project ownership", () => {
    const organization = new Organization("org-1", "Example Org", 3, "owner-1");
    organization.addMember("owner-1", "admin-1", "admin");
    organization.addMember("admin-1", "member-1");

    const projects = new ProjectRegistry();
    const created = createProjectForOrganization(organization, projects, {
      id: "project-1",
      organizationId: "org-1",
      name: "Enterprise migration",
      ownerId: "member-1",
    });

    expect(created).toMatchObject({
      status: "planned",
      persistencePerformed: false,
    });
    expect(projects.transition("project-1", "member-1", "active").status).toBe(
      "active",
    );
    expect(() =>
      projects.transition("project-1", "admin-1", "completed"),
    ).toThrow("project owner required");
  });

  it("keeps contract lifecycle bounded and does not claim legal execution", () => {
    const organization = new Organization("org-2", "Contracts Org", 2, "owner");
    organization.addMember("owner", "admin", "admin");
    const contracts = new ContractRegistry();

    const contract = createContractForOrganization(
      contracts,
      organization,
      "admin",
      {
        id: "contract-1",
        organizationId: "org-2",
        title: "Integration pilot",
        partyIds: ["org-2", "vendor-1"],
      },
    );

    expect(contract).toMatchObject({
      status: "draft",
      legalValidityVerified: false,
      signaturePerformed: false,
    });
    expect(contracts.transition("contract-1", "active").status).toBe("active");
    expect(contracts.transition("contract-1", "ended").status).toBe("ended");
    expect(() => contracts.transition("contract-1", "active")).toThrow(
      "invalid contract status transition",
    );
  });

  it("uses deterministic default-deny policy with deny winning a priority tie", () => {
    expect(
      evaluatePolicy(
        {
          principal: "user-1",
          action: "integration.execute",
          resource: "adapter:sendgrid",
        },
        [],
      ),
    ).toMatchObject({
      allowed: false,
      reason: "default-deny",
      enforcementPerformed: false,
    });

    expect(
      evaluatePolicy(
        {
          principal: "user-1",
          action: "integration.execute",
          resource: "adapter:sendgrid",
        },
        [
          {
            id: "allow-team",
            effect: "allow",
            principals: ["user-1"],
            actions: ["integration.execute"],
            resources: ["*"],
            priority: 10,
          },
          {
            id: "deny-sendgrid",
            effect: "deny",
            principals: ["user-1"],
            actions: ["integration.execute"],
            resources: ["adapter:sendgrid"],
            priority: 10,
          },
        ],
      ),
    ).toMatchObject({
      allowed: false,
      matchedRuleId: "deny-sendgrid",
    });
  });

  it("round-trips authenticated encryption and rejects mismatched context", () => {
    const encryption = new FileEncryption();
    const key = encryption.generateKey();
    const payload = encryption.encrypt(
      "enterprise-secret",
      key,
      "tenant:org-1",
    );

    expect(encryption.decrypt(payload, key, "tenant:org-1")).toBe(
      "enterprise-secret",
    );
    expect(() =>
      encryption.decrypt(payload, key, "tenant:org-2"),
    ).toThrow();
  });

  it("aggregates bounded metrics and dimensions deterministically", () => {
    const analytics = new AnalyticsAggregator();
    analytics.ingestBatch([
      {
        name: "adapter.command",
        value: 10,
        timestamp: "2026-09-25T00:00:00.000Z",
        dimensions: { provider: "sendgrid" },
      },
      {
        name: "adapter.command",
        value: 20,
        timestamp: "2026-09-25T00:00:01.000Z",
        dimensions: { provider: "sendgrid" },
      },
      {
        name: "adapter.command",
        value: 5,
        timestamp: "2026-09-25T00:00:02.000Z",
        dimensions: { provider: "twilio" },
      },
    ]);

    expect(analytics.metric("adapter.command")).toEqual({
      name: "adapter.command",
      count: 3,
      sum: 35,
      min: 5,
      max: 20,
      average: 35 / 3,
    });
    expect(analytics.dimension("adapter.command", "provider").values).toEqual([
      { value: "sendgrid", count: 2 },
      { value: "twilio", count: 1 },
    ]);
  });
});
