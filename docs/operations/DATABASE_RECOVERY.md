# Database Recovery Runbook

This runbook defines a fail-closed logical backup and restore drill for the SKYCOIN4444 invitation-only engineering beta.

It is a recovery **verification tool**, not a claim that the hosted database is already recoverable. A backup does not count as verified until the same artifact has been restored into an empty disposable database and the restored table set has been checked.

## Recovery objectives

The default engineering-beta objectives are:

- **RPO:** 24 hours
- **RTO:** 60 minutes

These are operational targets for the drill, not uptime guarantees or production certification. They can be tightened for a specific run with:

- `BETA_RECOVERY_RPO_HOURS`
- `BETA_RECOVERY_RTO_MINUTES`

The restore evidence records whether the tested artifact met both objectives.

## Safety model

The recovery tooling deliberately refuses destructive shortcuts.

Backup:

- requires `DATABASE_URL` with a remote `mysql://` target;
- requires `BETA_DB_BACKUP_CONFIRM=BACKUP_MANAGED_BETA`;
- runs `mysqldump` with a single transaction and streams directly to gzip;
- refuses to overwrite an existing artifact;
- writes a SHA-256 manifest with the exact source table set;
- excludes database host, database name, username, and password from retained evidence.

Restore drill:

- requires the original `DATABASE_URL` so the source can be protected;
- requires a separate `RESTORE_DATABASE_URL`;
- requires `BETA_DB_RESTORE_CONFIRM=RESTORE_DISPOSABLE_BETA`;
- requires the restore database name to start with `skycoin_restore_` by default;
- refuses to continue if source and restore endpoint/database are identical;
- refuses a restore target that already contains any tables;
- verifies backup filename, byte length, and SHA-256 before import;
- compares the exact restored table set with the backup manifest;
- verifies the canonical `users`, `beta_feedback`, `course_progress`, `posts`, and `audit_ledger` tables;
- leaves the disposable restored database intact for operator inspection rather than automatically dropping anything.

Localhost restore targets are rejected unless `BETA_DB_RESTORE_ALLOW_LOCALHOST=1` is explicitly set for a disposable local drill.

## Prerequisites

The operator environment must have:

- the repository dependencies installed;
- `mysqldump` and `mysql` client binaries on `PATH`;
- read access to the source database for backup;
- write/schema access only to the dedicated disposable restore database.

Credentials belong in environment variables or the hosting secret manager. Do not paste database URLs into GitHub issues, logs, documentation, or chat.

The tool writes a short-lived MySQL client option file with mode `0600` and removes it after the client process exits. Credentials are not passed on the command line.

Recovery command failures first remove the configured source/restore database URLs and parsed credentials, then pass the remaining text through the shared operational-error sanitizer before logging. This keeps driver errors from echoing database credentials, including passwords that contain an `@` character.

## Create a logical backup

Set the approved source database URL in the operator environment and run:

```bash
export BETA_DB_BACKUP_CONFIRM=BACKUP_MANAGED_BETA
pnpm beta:db:backup
```

Optional:

```bash
export BETA_DB_BACKUP_FILE=/secure/path/skycoin4444.sql.gz
export BETA_RELEASE_SHA=<exact deployed commit>
```

The default artifact directory is `artifacts/database-recovery/`. The command creates:

- `*.sql.gz`
- matching `*.sql.gz.manifest.json`

The manifest contains the artifact SHA-256, size, source table set, release SHA when available, and the configured RPO/RTO objectives.

**A successful backup command is not restore evidence.**

## Run the restore drill

Pre-create a new empty disposable MySQL database whose name begins with `skycoin_restore_`. Do not point this at the application database.

Then run:

```bash
export BETA_DB_RESTORE_CONFIRM=RESTORE_DISPOSABLE_BETA
export BETA_DB_BACKUP_FILE=/secure/path/skycoin4444.sql.gz
export RESTORE_DATABASE_URL='mysql://.../skycoin_restore_YYYYMMDD'
pnpm beta:db:restore-drill
```

The original `DATABASE_URL` must remain set so the tool can prove the restore target is not the source database.

On success the command writes a `restore-drill-*.json` evidence record containing:

- backup SHA-256 and age;
- restored table count;
- exact-table-set verification;
- required-table verification;
- restore duration;
- RPO/RTO target values and pass/fail results.

The evidence deliberately excludes database credentials and endpoint names.

## Evidence retention

Recovery artifacts contain application data and must **not** be committed to Git. The repository ignores `artifacts/database-recovery/`.

Store backup artifacts in an approved encrypted operator/provider location with access control and retention appropriate to the beta. GitHub workflow artifacts are not a substitute for a protected production backup store.

When recording a successful drill in Issue #380 or the hosted-beta control issue, record only:

- exact source release SHA;
- backup artifact SHA-256;
- backup age;
- restore duration;
- restored table count;
- RPO/RTO result;
- date/time of the drill;
- provider/database class if useful, without credentials or secret endpoints.

## What this does not prove

A successful logical restore drill does not by itself prove:

- provider snapshots or point-in-time recovery;
- automated recurring backup scheduling;
- cross-region disaster recovery;
- failover behavior;
- replica recovery;
- zero data loss;
- production SLA/SLO compliance;
- regulatory or security certification.

Those need separate direct evidence.
