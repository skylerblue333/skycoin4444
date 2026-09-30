import fs from "node:fs";

export function validateRestoreEvidence(evidence) {
  const errors = [];
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) return ["evidence must be a JSON object"];
  const requiredStrings = ["backupId", "backupCreatedAt", "restoreStartedAt", "restoreCompletedAt", "sourceEnvironment", "restoreEnvironment", "databaseEngine", "verificationMethod"];
  for (const key of requiredStrings) {
    if (typeof evidence[key] !== "string" || evidence[key].trim() === "") errors.push(`${key} must be a non-empty string`);
  }
  for (const key of ["rpoMinutes", "rtoMinutes", "observedRecoveryPointMinutes", "observedRestoreMinutes"]) {
    if (!Number.isFinite(evidence[key]) || evidence[key] < 0) errors.push(`${key} must be a non-negative finite number`);
  }
  if (evidence.sourceEnvironment && evidence.restoreEnvironment && evidence.sourceEnvironment === evidence.restoreEnvironment) {
    errors.push("restoreEnvironment must be isolated from sourceEnvironment");
  }
  const start = Date.parse(evidence.restoreStartedAt);
  const end = Date.parse(evidence.restoreCompletedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) errors.push("restore timestamps must be valid and ordered");
  if (Number.isFinite(start) && Number.isFinite(end) && Number.isFinite(evidence.observedRestoreMinutes)) {
    const measured = (end - start) / 60000;
    if (Math.abs(measured - evidence.observedRestoreMinutes) > 1) errors.push("observedRestoreMinutes must match restore timestamps within one minute");
  }
  if (evidence.verificationPassed !== true) errors.push("verificationPassed must be true");
  if (!Array.isArray(evidence.verificationChecks) || evidence.verificationChecks.length < 2 || evidence.verificationChecks.some((v) => typeof v !== "string" || !v.trim())) {
    errors.push("verificationChecks must contain at least two non-empty checks");
  }
  if (Number.isFinite(evidence.rpoMinutes) && Number.isFinite(evidence.observedRecoveryPointMinutes) && evidence.observedRecoveryPointMinutes > evidence.rpoMinutes) errors.push("observed recovery point exceeds declared RPO");
  if (Number.isFinite(evidence.rtoMinutes) && Number.isFinite(evidence.observedRestoreMinutes) && evidence.observedRestoreMinutes > evidence.rtoMinutes) errors.push("observed restore time exceeds declared RTO");
  if (evidence.containsSecrets === true) errors.push("evidence must not contain secrets");
  return errors;
}

export function readEvidence(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

if (process.argv[1] && process.argv[1].endsWith("verify-backup-restore-evidence.mjs")) {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: node scripts/verify-backup-restore-evidence.mjs <evidence.json>");
    process.exit(2);
  }
  try {
    const errors = validateRestoreEvidence(readEvidence(path));
    if (errors.length) {
      console.error("Backup/restore evidence rejected:\n- " + errors.join("\n- "));
      process.exit(1);
    }
    console.log("Backup/restore evidence contract passed.");
  } catch (error) {
    console.error("Backup/restore evidence could not be read:", error instanceof Error ? error.message : "unknown error");
    process.exit(1);
  }
}
