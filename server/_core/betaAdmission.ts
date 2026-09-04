export type BetaAccessMode = "invite_only" | "open";

export type BetaAdmissionIdentity = {
  openId: string;
  email?: string | null;
};

export type BetaAdmissionDecision = {
  allowed: boolean;
  reason:
    | "local_test"
    | "owner"
    | "open_id_allowlist"
    | "email_allowlist"
    | "development_open"
    | "not_invited";
};

export type BetaAdmissionSnapshot = {
  mode: BetaAccessMode;
  configured: boolean;
  allowedEmailCount: number;
  allowedOpenIdCount: number;
  ownerConfigured: boolean;
  localTestBypassEnabled: boolean;
};

function parseCsv(value: string | undefined, normalize: (value: string) => string) {
  return new Set(
    (value ?? "")
      .split(",")
      .map(item => normalize(item.trim()))
      .filter(Boolean)
  );
}

function normalizeEmail(value: string) {
  return value.toLowerCase();
}

function normalizeOpenId(value: string) {
  return value;
}

export function betaAccessMode(env: NodeJS.ProcessEnv = process.env): BetaAccessMode {
  const configured = env.BETA_ACCESS_MODE?.trim();
  if (configured === "open") return "open";
  return "invite_only";
}

export function betaAdmissionSnapshot(
  env: NodeJS.ProcessEnv = process.env
): BetaAdmissionSnapshot {
  const allowedEmails = parseCsv(env.BETA_ALLOWED_EMAILS, normalizeEmail);
  const allowedOpenIds = parseCsv(env.BETA_ALLOWED_OPEN_IDS, normalizeOpenId);
  const ownerConfigured = Boolean(env.OWNER_OPEN_ID?.trim());
  const localTestBypassEnabled =
    env.NODE_ENV !== "production" && env.LOCAL_TEST_MODE === "true";
  const mode = betaAccessMode(env);

  return {
    mode,
    configured:
      mode === "open" ||
      ownerConfigured ||
      allowedEmails.size > 0 ||
      allowedOpenIds.size > 0 ||
      localTestBypassEnabled,
    allowedEmailCount: allowedEmails.size,
    allowedOpenIdCount: allowedOpenIds.size,
    ownerConfigured,
    localTestBypassEnabled,
  };
}

export function evaluateBetaAdmission(
  identity: BetaAdmissionIdentity,
  env: NodeJS.ProcessEnv = process.env
): BetaAdmissionDecision {
  const openId = identity.openId.trim();
  const email = identity.email?.trim().toLowerCase() ?? "";
  const ownerOpenId = env.OWNER_OPEN_ID?.trim() ?? "";
  const allowedEmails = parseCsv(env.BETA_ALLOWED_EMAILS, normalizeEmail);
  const allowedOpenIds = parseCsv(env.BETA_ALLOWED_OPEN_IDS, normalizeOpenId);
  const mode = betaAccessMode(env);

  if (
    env.NODE_ENV !== "production" &&
    env.LOCAL_TEST_MODE === "true" &&
    openId === "local-test-user"
  ) {
    return { allowed: true, reason: "local_test" };
  }

  if (ownerOpenId && openId === ownerOpenId) {
    return { allowed: true, reason: "owner" };
  }

  if (allowedOpenIds.has(openId)) {
    return { allowed: true, reason: "open_id_allowlist" };
  }

  if (email && allowedEmails.has(email)) {
    return { allowed: true, reason: "email_allowlist" };
  }

  if (mode === "open" && env.NODE_ENV !== "production") {
    return { allowed: true, reason: "development_open" };
  }

  return { allowed: false, reason: "not_invited" };
}
