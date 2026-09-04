import { betaAdmissionSnapshot, betaAccessMode } from "./betaAdmission";
import { sessionLifetimePolicyFromEnv } from "./sessionPolicy";
import { sessionSigningKeysFromEnv } from "./sessionKeys";

export type ProductionConfigIssue = {
  key: string;
  message: string;
};

function isHttpsUrl(value: string | undefined) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function databaseIssue(value: string | undefined): string | null {
  if (!value?.trim()) return "DATABASE_URL is required";
  try {
    const url = new URL(value);
    if (url.protocol !== "mysql:") {
      return "DATABASE_URL must use the mysql:// protocol";
    }
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      return "production DATABASE_URL must not point to localhost";
    }
    if (!url.pathname || url.pathname === "/") {
      return "DATABASE_URL must name a database";
    }
    return null;
  } catch {
    return "DATABASE_URL must be a valid mysql:// URL";
  }
}

function publicOriginIssue(value: string | undefined): string | null {
  if (!value?.trim()) return "BETA_PUBLIC_ORIGIN is required";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return "BETA_PUBLIC_ORIGIN must use https://";
    }
    const normalizedInput = value.replace(/\/$/, "");
    if (url.origin !== normalizedInput) {
      return "BETA_PUBLIC_ORIGIN must be an origin only, without a path or query";
    }
    return null;
  } catch {
    return "BETA_PUBLIC_ORIGIN must be a valid HTTPS origin";
  }
}

export function inspectProductionBetaConfig(
  env: NodeJS.ProcessEnv = process.env
): ProductionConfigIssue[] {
  const issues: ProductionConfigIssue[] = [];
  const add = (key: string, message: string | null | false) => {
    if (message) issues.push({ key, message });
  };

  add("DATABASE_URL", databaseIssue(env.DATABASE_URL));

  try {
    sessionSigningKeysFromEnv(env);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "JWT session signing key configuration is invalid";
    issues.push({
      key: message.startsWith("JWT_SECRET_PREVIOUS")
        ? "JWT_SECRET_PREVIOUS"
        : "JWT_SECRET",
      message,
    });
  }

  if (!env.VITE_APP_ID?.trim()) {
    issues.push({ key: "VITE_APP_ID", message: "VITE_APP_ID is required" });
  }

  if (!isHttpsUrl(env.OAUTH_SERVER_URL)) {
    issues.push({
      key: "OAUTH_SERVER_URL",
      message: "OAUTH_SERVER_URL must be a valid HTTPS URL",
    });
  }

  if (!isHttpsUrl(env.VITE_OAUTH_PORTAL_URL)) {
    issues.push({
      key: "VITE_OAUTH_PORTAL_URL",
      message: "VITE_OAUTH_PORTAL_URL must be a valid HTTPS URL",
    });
  }

  add("BETA_PUBLIC_ORIGIN", publicOriginIssue(env.BETA_PUBLIC_ORIGIN));

  try {
    sessionLifetimePolicyFromEnv(env);
  } catch (error) {
    issues.push({
      key: "SESSION_TTL_MS",
      message:
        error instanceof Error
          ? error.message
          : "SESSION_TTL_MS is invalid",
    });
  }

  if (betaAccessMode(env) !== "invite_only") {
    issues.push({
      key: "BETA_ACCESS_MODE",
      message: "production engineering beta must remain invite_only",
    });
  }

  const admission = betaAdmissionSnapshot(env);
  const hasInvitedIdentity =
    admission.ownerConfigured ||
    admission.allowedEmailCount > 0 ||
    admission.allowedOpenIdCount > 0;
  if (!hasInvitedIdentity) {
    issues.push({
      key: "BETA_ALLOWED_EMAILS/BETA_ALLOWED_OPEN_IDS/OWNER_OPEN_ID",
      message: "at least one invited identity must be configured",
    });
  }

  if (env.LOCAL_TEST_MODE === "true") {
    issues.push({
      key: "LOCAL_TEST_MODE",
      message: "LOCAL_TEST_MODE must not be enabled in production",
    });
  }

  return issues;
}

export function assertProductionBetaConfig(
  env: NodeJS.ProcessEnv = process.env
): void {
  if (env.NODE_ENV !== "production") return;
  const issues = inspectProductionBetaConfig(env);
  if (issues.length === 0) return;

  const summary = issues
    .map(issue => `${issue.key}: ${issue.message}`)
    .join("; ");
  throw new Error(`Production beta configuration invalid: ${summary}`);
}
