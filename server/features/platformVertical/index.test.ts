import { describe, expect, it, vi } from "vitest";
import { executePlatformVertical, type PlatformVerticalAdapters } from "./index";

const nowMs = 1_800_000_000_000;

function adapters(): PlatformVerticalAdapters {
  return {
    enrollCourse: vi.fn(({ subjectId, courseId, achievementId }) => ({
      enrollmentId: "enr_001",
      courseId,
      subjectId,
      achievementId,
    })),
    planLedger: vi.fn(({ subjectId, referenceId, amountMinor, currency }) => ({
      contract: "sky.platform.ledger-plan.v1" as const,
      subjectId,
      referenceId,
      amountMinor,
      currency,
      executeExternally: true as const,
    })),
    planNotification: vi.fn(({ subjectId, referenceId }) => ({
      contract: "sky.platform.notification-plan.v1" as const,
      subjectId,
      referenceId,
      template: "course-enrolled" as const,
      executeExternally: true as const,
    })),
  };
}

function request() {
  return {
    identity: {
      namespace: "skyschool",
      subject: "user:123",
      createdAt: "2026-08-31T12:00:00Z",
      displayName: "Example Learner",
    },
    verifiedSession: {
      subject: "user:123",
      sessionId: "sess_123",
      issuedAtMs: nowMs - 60_000,
      expiresAtMs: nowMs + 60_000,
      authMethod: "oauth" as const,
    },
    nowMs,
    requestedAction: "course.enroll",
    resource: "courses/course-1",
    roles: ["student"],
    permissionRules: [
      {
        id: "allow-course-enroll",
        resource: "courses/*",
        action: "course.enroll",
        effect: "allow" as const,
      },
    ],
    mfaEnrollments: [
      { factor: "passkey" as const, enabled: true, verifiedAt: "2026-08-31T11:00:00Z" },
    ],
    mfaPolicy: {
      requiredActions: ["course.enroll"],
      riskThreshold: 80,
      phishingResistantActions: ["course.enroll"],
    },
    satisfiedMfaFactors: ["passkey" as const],
    course: {
      courseId: "course-1",
      achievementId: "achievement-1",
      issuerId: "skyschool",
    },
    payment: {
      intent: {
        id: "pay_001",
        accountId: "acct_123",
        amountMinor: 2500,
        currency: "USD",
        idempotencyKey: "idem_001",
        status: "created" as const,
      },
      provider: "sandbox-provider",
      paymentMethodReference: "pm_001",
    },
    occurredAt: "2026-08-31T12:00:00Z",
  };
}

describe("SKYCOIN4444 platform vertical", () => {
  it("connects identity, auth, MFA, permissions, credential, payment-plan and audit cores", () => {
    const ports = adapters();
    const result = executePlatformVertical(request(), ports);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected successful vertical execution");

    expect(result.identity.id).toMatch(/^skyid_[a-f0-9]{32}$/);
    expect(result.permissions.allowed).toBe(true);
    expect(result.mfa.requiredAssurance).toBe("phishing_resistant");
    expect(result.credential.subjectId).toBe(result.identity.id);
    expect(result.paymentPlan).toMatchObject({
      contract: "sky.payments.authorization-plan.v1",
      executeExternally: true,
      amountMinor: 2500,
      currency: "USD",
    });
    expect(result.ledgerPlan?.executeExternally).toBe(true);
    expect(result.notificationPlan.executeExternally).toBe(true);
    expect(result.audit.actorId).toBe(result.identity.id);
    expect(ports.enrollCourse).toHaveBeenCalledTimes(1);
    expect(ports.planLedger).toHaveBeenCalledTimes(1);
    expect(ports.planNotification).toHaveBeenCalledTimes(1);
  });

  it("fails closed before downstream effects when authentication fails", () => {
    const ports = adapters();
    const input = request();
    input.verifiedSession.expiresAtMs = nowMs;

    const result = executePlatformVertical(input, ports);
    expect(result).toMatchObject({ ok: false, stage: "auth" });
    expect(ports.enrollCourse).not.toHaveBeenCalled();
    expect(ports.planLedger).not.toHaveBeenCalled();
    expect(ports.planNotification).not.toHaveBeenCalled();
  });

  it("rejects a verified session bound to a different identity", () => {
    const ports = adapters();
    const input = request();
    input.verifiedSession.subject = "user:other";

    const result = executePlatformVertical(input, ports);
    expect(result).toMatchObject({ ok: false, stage: "identity-binding" });
    expect(ports.enrollCourse).not.toHaveBeenCalled();
  });

  it("fails closed when phishing-resistant MFA is required but not satisfied", () => {
    const ports = adapters();
    const input = request();
    input.satisfiedMfaFactors = [];

    const result = executePlatformVertical(input, ports);
    expect(result).toMatchObject({ ok: false, stage: "mfa" });
    expect(ports.enrollCourse).not.toHaveBeenCalled();
  });

  it("fails closed on permission denial", () => {
    const ports = adapters();
    const input = request();
    input.permissionRules = [
      {
        id: "deny-course-enroll",
        resource: "courses/*",
        action: "course.enroll",
        effect: "deny",
      },
    ];

    const result = executePlatformVertical(input, ports);
    expect(result).toMatchObject({
      ok: false,
      stage: "permissions",
      permissions: { allowed: false, reason: "explicit-deny" },
    });
    expect(ports.enrollCourse).not.toHaveBeenCalled();
  });

  it("returns an explicit failure when the course adapter is unavailable", () => {
    const ports = adapters();
    vi.mocked(ports.enrollCourse).mockImplementation(() => {
      throw new Error("course store unavailable");
    });

    const result = executePlatformVertical(request(), ports);

    expect(result).toEqual({
      ok: false,
      stage: "course-adapter",
      reason: "course enrollment adapter unavailable",
    });
    expect(ports.planLedger).not.toHaveBeenCalled();
    expect(ports.planNotification).not.toHaveBeenCalled();
  });

  it("returns an explicit failure and stops before notification when the ledger adapter is unavailable", () => {
    const ports = adapters();
    vi.mocked(ports.planLedger).mockImplementation(() => {
      throw new Error("ledger unavailable");
    });

    const result = executePlatformVertical(request(), ports);

    expect(result).toEqual({
      ok: false,
      stage: "ledger-adapter",
      reason: "ledger planning adapter unavailable",
    });
    expect(ports.enrollCourse).toHaveBeenCalledTimes(1);
    expect(ports.planLedger).toHaveBeenCalledTimes(1);
    expect(ports.planNotification).not.toHaveBeenCalled();
  });

  it("returns an explicit failure when the notification adapter is unavailable", () => {
    const ports = adapters();
    vi.mocked(ports.planNotification).mockImplementation(() => {
      throw new Error("notification service unavailable");
    });

    const result = executePlatformVertical(request(), ports);

    expect(result).toEqual({
      ok: false,
      stage: "notification-adapter",
      reason: "notification planning adapter unavailable",
    });
    expect(ports.enrollCourse).toHaveBeenCalledTimes(1);
    expect(ports.planLedger).toHaveBeenCalledTimes(1);
    expect(ports.planNotification).toHaveBeenCalledTimes(1);
  });
});
