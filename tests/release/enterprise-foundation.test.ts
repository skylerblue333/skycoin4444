import { describe, expect, it } from "vitest";
import {
  AnalyticsAggregator,
  FileEncryption,
  Organization,
  evaluatePolicy,
} from "../../packages/sky-enterprise-foundation/src/index";
import {
  createAdapterCommand,
  inspectAdapterReadiness,
} from "../../packages/sky-enterprise-adapters/src/index";

describe("enterprise foundation release contract", () => {
  it("composes organization policy, adapter intent, analytics, and encryption without faking external execution", () => {
    const organization = new Organization("org-release", "Release Org", 4, "owner");
    organization.addMember("owner", "operator", "admin");

    const decision = evaluatePolicy(
      {
        principal: "operator",
        action: "integration.execute",
        resource: "adapter:sendgrid",
      },
      [
        {
          id: "enterprise-operator",
          effect: "allow",
          principals: ["operator"],
          actions: ["integration.execute"],
          resources: ["adapter:sendgrid"],
          priority: 100,
        },
      ],
    );

    expect(organization.roleOf("operator")).toBe("admin");
    expect(decision).toMatchObject({
      allowed: true,
      enforcementPerformed: false,
    });

    const command = createAdapterCommand({
      adapterId: "sendgrid",
      capability: "notification.email",
      requestId: "release-foundation",
      subject: "tenant:org-release",
      payload: {
        template: "welcome",
        recipientReference: "user:42",
      },
    });

    expect(command).toMatchObject({
      requiresExternalExecution: true,
      networkCallPerformed: false,
    });

    const analytics = new AnalyticsAggregator();
    analytics.ingest({
      name: "enterprise.adapter.command",
      timestamp: "2026-09-25T00:00:00.000Z",
      dimensions: {
        provider: command.adapterId,
        capability: command.capability,
      },
    });
    expect(analytics.count("enterprise.adapter.command")).toBe(1);

    const encryption = new FileEncryption();
    const key = encryption.generateKey();
    const encrypted = encryption.encrypt(
      JSON.stringify({
        commandId: command.commandId,
        subject: command.subject,
      }),
      key,
      "org:org-release",
    );
    expect(
      JSON.parse(encryption.decrypt(encrypted, key, "org:org-release")),
    ).toMatchObject({
      commandId: command.commandId,
      subject: "tenant:org-release",
    });

    expect(inspectAdapterReadiness("sendgrid", {})).toMatchObject({
      status: "unconfigured",
      externalConnectivityVerified: false,
      networkCallPerformed: false,
    });
  });
});
