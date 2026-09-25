/**
 * Ported from skylerblue333/skycoin-security at
 * be04350399870257e60702819cc931d1e76f990c (MIT).
 */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

export type EncryptedPayload = {
  version: 1;
  algorithm: "aes-256-gcm";
  iv: string;
  ciphertext: string;
  authTag: string;
};

const ALGORITHM = "aes-256-gcm" as const;
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const HEX = /^[0-9a-f]+$/i;

export class FileEncryption {
  generateKey(): Buffer {
    return randomBytes(KEY_LENGTH);
  }

  encrypt(
    data: string,
    key: Buffer,
    associatedData?: string,
  ): EncryptedPayload {
    validateKey(key);
    if (typeof data !== "string") throw new TypeError("data must be a string");
    validateAssociatedData(associatedData);

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    if (associatedData !== undefined) {
      cipher.setAAD(Buffer.from(associatedData, "utf8"));
    }

    const ciphertext = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ]);
    return {
      version: 1,
      algorithm: ALGORITHM,
      iv: iv.toString("hex"),
      ciphertext: ciphertext.toString("hex"),
      authTag: cipher.getAuthTag().toString("hex"),
    };
  }

  decrypt(
    payload: EncryptedPayload,
    key: Buffer,
    associatedData?: string,
  ): string {
    validateKey(key);
    validateAssociatedData(associatedData);
    if (!isEncryptedPayload(payload)) {
      throw new TypeError("invalid encrypted payload");
    }

    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(payload.iv, "hex"),
      { authTagLength: AUTH_TAG_LENGTH },
    );
    if (associatedData !== undefined) {
      decipher.setAAD(Buffer.from(associatedData, "utf8"));
    }
    decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

    return Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, "hex")),
      decipher.final(),
    ]).toString("utf8");
  }
}

function validateKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new TypeError("key must be exactly 32 bytes");
  }
}

function validateAssociatedData(value: string | undefined): void {
  if (value !== undefined && typeof value !== "string") {
    throw new TypeError("associated data must be a string");
  }
}

function isHex(
  value: unknown,
  exactLength?: number,
  allowEmpty = false,
): value is string {
  if (typeof value !== "string") return false;
  if (exactLength !== undefined && value.length !== exactLength) return false;
  if (value.length === 0) return allowEmpty;
  return value.length % 2 === 0 && HEX.test(value);
}

function isEncryptedPayload(value: unknown): value is EncryptedPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Partial<EncryptedPayload>;
  return (
    payload.version === 1 &&
    payload.algorithm === ALGORITHM &&
    isHex(payload.iv, IV_LENGTH * 2) &&
    isHex(payload.authTag, AUTH_TAG_LENGTH * 2) &&
    isHex(payload.ciphertext, undefined, true)
  );
}
