import { SignJWT } from "jose";
import { describe, expect, it } from "vitest";
import {
  sessionSigningKeysFromEnv,
  sessionSigningKeysFromSecrets,
  verifySessionJwt,
} from "./sessionKeys";

const activeSecret =
  "active-session-secret-12345678901234567890";
const previousSecret =
  "previous-session-secret-1234567890123456";

async function tokenWith(
  secret: string,
  expiresInSeconds = 3_600
): Promise<string> {
  return new SignJWT({
    openId: "user-1",
    appId: "skycoin4444-beta",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(
      Math.floor(Date.now() / 1_000) + expiresInSeconds
    )
    .sign(new TextEncoder().encode(secret));
}

describe("session signing key configuration", () => {
  it("supports one active key with no rotation overlap", () => {
    const keys = sessionSigningKeysFromSecrets(activeSecret);

    expect(keys.active.byteLength).toBeGreaterThanOrEqual(32);
    expect(keys.previous).toBeNull();
    expect(keys.previousConfigured).toBe(false);
  });

  it("accepts one distinct previous verification key", () => {
    const keys = sessionSigningKeysFromEnv({
      JWT_SECRET: activeSecret,
      JWT_SECRET_PREVIOUS: previousSecret,
    } as NodeJS.ProcessEnv);

    expect(keys.previousConfigured).toBe(true);
    expect(keys.previous?.byteLength).toBeGreaterThanOrEqual(32);
  });

  it("rejects short or duplicate rotation keys", () => {
    expect(() =>
      sessionSigningKeysFromSecrets("too-short")
    ).toThrow(/JWT_SECRET/);

    expect(() =>
      sessionSigningKeysFromSecrets(
        activeSecret,
        "too-short"
      )
    ).toThrow(/JWT_SECRET_PREVIOUS/);

    expect(() =>
      sessionSigningKeysFromSecrets(
        activeSecret,
        activeSecret
      )
    ).toThrow(/must differ/);
  });
});

describe("session JWT rotation verification", () => {
  it("verifies new tokens with the active key", async () => {
    const token = await tokenWith(activeSecret);
    const result = await verifySessionJwt(
      token,
      sessionSigningKeysFromSecrets(
        activeSecret,
        previousSecret
      )
    );

    expect(result.verifiedWith).toBe("active");
    expect(result.payload.openId).toBe("user-1");
  });

  it("accepts previous-key tokens only during overlap", async () => {
    const token = await tokenWith(previousSecret);

    const duringRotation = await verifySessionJwt(
      token,
      sessionSigningKeysFromSecrets(
        activeSecret,
        previousSecret
      )
    );
    expect(duringRotation.verifiedWith).toBe("previous");

    await expect(
      verifySessionJwt(
        token,
        sessionSigningKeysFromSecrets(activeSecret)
      )
    ).rejects.toBeDefined();
  });

  it("does not accept tokens signed by an unrelated key", async () => {
    const token = await tokenWith(
      "unrelated-session-secret-123456789012345"
    );

    await expect(
      verifySessionJwt(
        token,
        sessionSigningKeysFromSecrets(
          activeSecret,
          previousSecret
        )
      )
    ).rejects.toBeDefined();
  });

  it("still rejects expired previous-key tokens", async () => {
    const token = await tokenWith(previousSecret, -1);

    await expect(
      verifySessionJwt(
        token,
        sessionSigningKeysFromSecrets(
          activeSecret,
          previousSecret
        )
      )
    ).rejects.toBeDefined();
  });
});
