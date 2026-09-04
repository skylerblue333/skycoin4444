import { jwtVerify, type JWTPayload } from "jose";

const MIN_SESSION_SECRET_BYTES = 32;
const encoder = new TextEncoder();

export type SessionSigningKeys = Readonly<{
  active: Uint8Array;
  previous: Uint8Array | null;
  previousConfigured: boolean;
}>;

export type SessionVerificationResult = Readonly<{
  payload: JWTPayload;
  verifiedWith: "active" | "previous";
}>;

function encodeSecret(
  value: string,
  label: "JWT_SECRET" | "JWT_SECRET_PREVIOUS"
): Uint8Array {
  const encoded = encoder.encode(value);
  if (encoded.byteLength < MIN_SESSION_SECRET_BYTES) {
    throw new RangeError(
      label + " must contain at least 32 bytes"
    );
  }
  return encoded;
}

export function sessionSigningKeysFromSecrets(
  activeSecret: string,
  previousSecret?: string | null
): SessionSigningKeys {
  const active = encodeSecret(activeSecret, "JWT_SECRET");
  const previousValue =
    previousSecret === undefined ||
    previousSecret === null ||
    previousSecret === ""
      ? null
      : previousSecret;

  if (previousValue !== null && previousValue === activeSecret) {
    throw new RangeError(
      "JWT_SECRET_PREVIOUS must differ from JWT_SECRET"
    );
  }

  const previous =
    previousValue === null
      ? null
      : encodeSecret(
          previousValue,
          "JWT_SECRET_PREVIOUS"
        );

  return Object.freeze({
    active,
    previous,
    previousConfigured: previous !== null,
  });
}

export function sessionSigningKeysFromEnv(
  env: NodeJS.ProcessEnv = process.env
): SessionSigningKeys {
  return sessionSigningKeysFromSecrets(
    env.JWT_SECRET ?? "",
    env.JWT_SECRET_PREVIOUS
  );
}

export async function verifySessionJwt(
  token: string,
  keys: SessionSigningKeys
): Promise<SessionVerificationResult> {
  try {
    const { payload } = await jwtVerify(token, keys.active, {
      algorithms: ["HS256"],
    });
    return Object.freeze({
      payload,
      verifiedWith: "active" as const,
    });
  } catch (activeError) {
    if (!keys.previous) throw activeError;

    try {
      const { payload } = await jwtVerify(
        token,
        keys.previous,
        {
          algorithms: ["HS256"],
        }
      );
      return Object.freeze({
        payload,
        verifiedWith: "previous" as const,
      });
    } catch {
      throw activeError;
    }
  }
}
