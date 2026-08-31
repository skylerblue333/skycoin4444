import { createAuditRecord, type AuditRecord } from "../../../packages/sky-audit/src/index";
import {
  createIdentityRecord,
  type IdentityRecord,
} from "../../../packages/skyidentity/src/index";
import {
  canSatisfyDecision,
  evaluateMfa,
  type FactorEnrollment,
  type MfaDecision,
  type MfaPolicy,
} from "../../../packages/sky-mfa/src/index";
import {
  authenticateVerifiedSession,
  type AuthDecision,
  type VerifiedSessionClaims,
} from "../auth/skyAuth";
import { createEducationCredential, type EducationCredential } from "../credentials/skyCredentials";
import {
  evaluatePermissions,
  type PermissionDecision,
  type PermissionRule,
} from "../permissions";
import {
  planPaymentAuthorization,
  type PaymentAuthorizationPlan,
  type PaymentIntent,
} from "../payments";

export interface CourseEnrollment {
  enrollmentId: string;
  courseId: string;
  subjectId: string;
  achievementId: string;
}

export interface LedgerPlan {
  contract: "sky.platform.ledger-plan.v1";
  referenceId: string;
  subjectId: string;
  amountMinor: number;
  currency: string;
  executeExternally: true;
}

export interface NotificationPlan {
  contract: "sky.platform.notification-plan.v1";
  subjectId: string;
  template: "course-enrolled";
  referenceId: string;
  executeExternally: true;
}

export interface PlatformVerticalAdapters {
  enrollCourse(input: {
    subjectId: string;
    courseId: string;
    achievementId: string;
  }): CourseEnrollment;
  planLedger(input: {
    subjectId: string;
    referenceId: string;
    amountMinor: number;
    currency: string;
  }): LedgerPlan;
  planNotification(input: {
    subjectId: string;
    referenceId: string;
  }): NotificationPlan;
}

export interface PlatformVerticalRequest {
  identity: {
    namespace: string;
    subject: string;
    createdAt: string;
    displayName?: string;
  };
  verifiedSession: VerifiedSessionClaims;
  nowMs: number;
  requestedAction: string;
  resource: string;
  roles: readonly string[];
  permissionRules: readonly PermissionRule[];
  permissionContext?: Record<string, string>;
  mfaEnrollments: readonly FactorEnrollment[];
  mfaPolicy: MfaPolicy;
  satisfiedMfaFactors?: readonly FactorEnrollment["factor"][];
  course: {
    courseId: string;
    achievementId: string;
    issuerId: string;
  };
  payment?: {
    intent: PaymentIntent;
    provider: string;
    paymentMethodReference: string;
  };
  occurredAt: string;
}

export type PlatformVerticalFailure =
  | { ok: false; stage: "auth"; auth: AuthDecision }
  | { ok: false; stage: "identity-binding"; reason: string }
  | { ok: false; stage: "mfa"; mfa: MfaDecision; reason: string }
  | { ok: false; stage: "permissions"; permissions: PermissionDecision }
  | {
      ok: false;
      stage: "course-adapter" | "ledger-adapter" | "notification-adapter";
      reason: string;
    };

export interface PlatformVerticalSuccess {
  ok: true;
  identity: IdentityRecord;
  mfa: MfaDecision;
  permissions: PermissionDecision;
  enrollment: CourseEnrollment;
  credential: EducationCredential;
  paymentPlan?: PaymentAuthorizationPlan;
  ledgerPlan?: LedgerPlan;
  notificationPlan: NotificationPlan;
  audit: AuditRecord;
}

export type PlatformVerticalResult = PlatformVerticalFailure | PlatformVerticalSuccess;

function hasSatisfiedMfa(decision: MfaDecision, factors: readonly FactorEnrollment["factor"][]): boolean {
  if (!decision.required) return true;
  if (!canSatisfyDecision(decision)) return false;
  if (decision.requiredAssurance === "phishing_resistant") return factors.includes("passkey");
  return factors.some((factor) => decision.eligibleFactors.includes(factor));
}

/**
 * Cross-product engineering-beta orchestration path.
 *
 * Security-sensitive effects are fail-closed: course enrollment, credential creation,
 * payment planning, ledger planning, notifications, and audit success records occur
 * only after identity binding, SkyAuth, SkyMFA, and SkyPermissions succeed. Adapter
 * exceptions are converted to explicit failure results instead of being reported as
 * successful vertical executions.
 *
 * The payment/ledger/notification outputs are plans only. This function does not
 * execute external payments, persist ledger entries, send notifications, verify MFA
 * proofs, or provide production identity/authentication enforcement. Adapter failure
 * handling is not a distributed transaction: earlier local/domain work may already
 * have occurred when a later adapter becomes unavailable.
 */
export function executePlatformVertical(
  request: PlatformVerticalRequest,
  adapters: PlatformVerticalAdapters,
): PlatformVerticalResult {
  const identity = createIdentityRecord(request.identity);
  const auth = authenticateVerifiedSession(request.verifiedSession, request.nowMs);
  if (!auth.ok) return { ok: false, stage: "auth", auth };

  if (auth.principal.subject !== identity.subject) {
    return {
      ok: false,
      stage: "identity-binding",
      reason: "verified session subject does not match the SkyIdentity subject",
    };
  }

  const mfa = evaluateMfa(
    {
      userId: identity.id,
      primaryAuthenticated: true,
      requestedAction: request.requestedAction,
    },
    request.mfaEnrollments,
    request.mfaPolicy,
  );
  if (!hasSatisfiedMfa(mfa, request.satisfiedMfaFactors ?? [])) {
    return { ok: false, stage: "mfa", mfa, reason: "required MFA assurance is not satisfied" };
  }

  const permissions = evaluatePermissions(request.permissionRules, {
    subject: { id: identity.id, roles: request.roles },
    resource: request.resource,
    action: request.requestedAction,
    context: request.permissionContext,
  });
  if (!permissions.allowed) return { ok: false, stage: "permissions", permissions };

  let enrollment: CourseEnrollment;
  try {
    enrollment = adapters.enrollCourse({
      subjectId: identity.id,
      courseId: request.course.courseId,
      achievementId: request.course.achievementId,
    });
  } catch {
    return {
      ok: false,
      stage: "course-adapter",
      reason: "course enrollment adapter unavailable",
    };
  }

  const credential = createEducationCredential({
    id: `cred:${enrollment.enrollmentId}`,
    issuerId: request.course.issuerId,
    subjectId: identity.id,
    achievementId: request.course.achievementId,
    issuedAtMs: request.nowMs,
    status: "issued",
  });

  let paymentPlan: PaymentAuthorizationPlan | undefined;
  let ledgerPlan: LedgerPlan | undefined;
  if (request.payment) {
    paymentPlan = planPaymentAuthorization(request.payment.intent, {
      intentId: request.payment.intent.id,
      provider: request.payment.provider,
      paymentMethodReference: request.payment.paymentMethodReference,
    });
    try {
      ledgerPlan = adapters.planLedger({
        subjectId: identity.id,
        referenceId: request.payment.intent.id,
        amountMinor: request.payment.intent.amountMinor,
        currency: request.payment.intent.currency,
      });
    } catch {
      return {
        ok: false,
        stage: "ledger-adapter",
        reason: "ledger planning adapter unavailable",
      };
    }
  }

  let notificationPlan: NotificationPlan;
  try {
    notificationPlan = adapters.planNotification({
      subjectId: identity.id,
      referenceId: enrollment.enrollmentId,
    });
  } catch {
    return {
      ok: false,
      stage: "notification-adapter",
      reason: "notification planning adapter unavailable",
    };
  }

  const audit = createAuditRecord({
    actorId: identity.id,
    action: request.requestedAction,
    resource: request.resource,
    occurredAt: request.occurredAt,
    metadata: {
      enrollmentId: enrollment.enrollmentId,
      credentialId: credential.id,
      paymentPlanned: Boolean(paymentPlan),
    },
  });

  return {
    ok: true,
    identity,
    mfa,
    permissions,
    enrollment,
    credential,
    ...(paymentPlan ? { paymentPlan } : {}),
    ...(ledgerPlan ? { ledgerPlan } : {}),
    notificationPlan,
    audit,
  };
}
