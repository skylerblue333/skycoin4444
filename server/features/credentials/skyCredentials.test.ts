import { describe, expect, it } from "vitest";
import {
  createEducationCredential,
  isCredentialActive,
} from "./skyCredentials";

describe("SkyCredentials", () => {
  const credential = createEducationCredential({
    id: "cred:1",
    issuerId: "org:school",
    subjectId: "user:1",
    achievementId: "course:typescript",
    issuedAtMs: 100,
    expiresAtMs: 200,
    status: "issued",
    evidenceHash:
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  });

  it("validates credential metadata", () => {
    expect(credential.status).toBe("issued");
    expect(credential.achievementId).toBe("course:typescript");
  });

  it("evaluates active state deterministically", () => {
    expect(isCredentialActive(credential, 150)).toBe(true);
    expect(isCredentialActive(credential, 200)).toBe(false);
  });

  it("treats revoked credentials as inactive", () => {
    expect(
      isCredentialActive({ ...credential, status: "revoked" }, 150)
    ).toBe(false);
  });

  it("rejects malformed evidence hashes", () => {
    expect(() =>
      createEducationCredential({
        id: "cred:2",
        issuerId: "org:school",
        subjectId: "user:1",
        achievementId: "course:typescript",
        issuedAtMs: 100,
        status: "issued",
        evidenceHash: "not-a-hash",
      })
    ).toThrow("evidenceHash must be a 64-character hex digest");
  });
});
