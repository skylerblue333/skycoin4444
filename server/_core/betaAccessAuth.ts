import { createHash, scryptSync, timingSafeEqual } from "node:crypto";

export type BetaAuthMode = "oauth" | "access_key";

const ACCESS_KEY_MIN_BYTES = 48;
const SCRYPT_KEY_BYTES = 32;
const HEX_PATTERN = /^[a-f0-9]+$/i;

export function betaAuthMode(
  env: NodeJS.ProcessEnv = process.env
): BetaAuthMode {
  return env.VITE_BETA_AUTH_MODE?.trim() === "access_key"
    ? "access_key"
    : "oauth";
}

export function oauthProviderRuntimeEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return betaAuthMode(env) === "oauth";
}

export function betaAuthModeIssue(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  const raw = env.VITE_BETA_AUTH_MODE?.trim();
  if (!raw || raw === "oauth" || raw === "access_key") return null;
  return "VITE_BETA_AUTH_MODE must be oauth or access_key";
}

function parseScryptCredential(value: string | undefined) {
  const [saltHex = "", digestHex = "", ...extra] = (value ?? "").split(":");
  if (
    extra.length > 0 ||
    saltHex.length < 32 ||
    saltHex.length % 2 !== 0 ||
    digestHex.length !== SCRYPT_KEY_BYTES * 2 ||
    !HEX_PATTERN.test(saltHex) ||
    !HEX_PATTERN.test(digestHex)
  ) {
    return null;
  }

  return {
    salt: Buffer.from(saltHex, "hex"),
    digest: Buffer.from(digestHex, "hex"),
  };
}

export function betaAccessKeyIssue(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  if (betaAuthMode(env) !== "access_key") return null;
  if (env.BETA_ACCESS_PASSWORD_SCRYPT?.trim()) {
    return parseScryptCredential(env.BETA_ACCESS_PASSWORD_SCRYPT)
      ? null
      : "BETA_ACCESS_PASSWORD_SCRYPT must contain a valid salt:digest scrypt credential";
  }
  const configured = env.BETA_ACCESS_KEY ?? "";
  if (Buffer.byteLength(configured, "utf8") < ACCESS_KEY_MIN_BYTES) {
    return `BETA_ACCESS_KEY must be at least ${ACCESS_KEY_MIN_BYTES} bytes in access_key mode`;
  }
  return null;
}

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function verifyBetaAccessKey(
  candidate: string,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  if (betaAuthMode(env) !== "access_key") return false;
  if (betaAccessKeyIssue(env)) return false;

  const scryptCredential = parseScryptCredential(
    env.BETA_ACCESS_PASSWORD_SCRYPT
  );
  if (scryptCredential) {
    const candidateDigest = scryptSync(
      candidate,
      scryptCredential.salt,
      SCRYPT_KEY_BYTES
    );
    return timingSafeEqual(candidateDigest, scryptCredential.digest);
  }

  const configured = env.BETA_ACCESS_KEY ?? "";
  return timingSafeEqual(digest(candidate), digest(configured));
}

export function normalizeBetaEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (
    email.length === 0 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return null;
  }
  return email;
}

export function betaAccessOpenId(email: string): string {
  const normalized = normalizeBetaEmail(email);
  if (!normalized) {
    throw new Error("valid beta email is required");
  }
  return `beta_email_${createHash("sha256")
    .update(normalized, "utf8")
    .digest("hex")
    .slice(0, 40)}`;
}
