import { describe, expect, it } from "vitest";
import { validateRestoreEvidence } from "../../scripts/verify-backup-restore-evidence.mjs";

const valid = {
  backupId: "provider-backup-2026-09-29T1800Z",
  backupCreatedAt: "2026-09-29T18:00:00Z",
  restoreStartedAt: "2026-09-29T18:10:00Z",
  restoreCompletedAt: "2026-09-29T18:22:00Z",
  sourceEnvironment: "hosted-beta",
  restoreEnvironment: "isolated-restore-drill",
  databaseEngine: "mysql",
  verificationMethod: "schema-and-sentinel-record-check",
  rpoMinutes: 60,
  rtoMinutes: 30,
  observedRecoveryPointMinutes: 10,
  observedRestoreMinutes: 12,
  verificationPassed: true,
  verificationChecks: ["required tables present", "sentinel records match"],
  containsSecrets: false,
};

describe("backup/restore evidence contract", () => {
  it("accepts isolated restore evidence within declared objectives", () => {
    expect(validateRestoreEvidence(valid)).toEqual([]);
  });

  it("fails closed when restore is not isolated or verification is missing", () => {
    const errors = validateRestoreEvidence({ ...valid, restoreEnvironment: "hosted-beta", verificationPassed: false });
    expect(errors).toContain("restoreEnvironment must be isolated from sourceEnvironment");
    expect(errors).toContain("verificationPassed must be true");
  });

  it("rejects evidence that misses RPO/RTO or contains secrets", () => {
    const errors = validateRestoreEvidence({ ...valid, observedRecoveryPointMinutes: 90, observedRestoreMinutes: 40, restoreCompletedAt: "2026-09-29T18:50:00Z", containsSecrets: true });
    expect(errors).toContain("observed recovery point exceeds declared RPO");
    expect(errors).toContain("observed restore time exceeds declared RTO");
    expect(errors).toContain("evidence must not contain secrets");
  });
});
