# Backup and Restore Runbook

## Required production policy

Before GA, configure an encrypted database backup with a documented frequency, retention period, access policy, and storage location. The backup location must be separate from the application host where practical. Do not store database passwords in scripts or Git.

The owner/operator must select the provider mechanism, for example managed database snapshots or an encrypted `mysqldump` workflow, and document the exact command/service, retention, encryption key, and access controls. This repository cannot verify those settings without production database access.

## Restore test

Perform a restore into an isolated non-production database or restore host. Never overwrite production during the first test. Record:

- source backup identifier and creation time;
- restore target and schema version;
- operator and timestamp;
- row/table integrity checks for backed product domains;
- application connectivity check;
- cleanup or retention of the restored environment.

A backup is not launch evidence until a restore has succeeded. Record the result as `VERIFIED` only after the restored database is readable and the critical application checks pass. Otherwise use `BLOCKED — EXTERNAL ACCESS REQUIRED` or `FAILED`.

## Minimum evidence commands

The exact commands depend on the database provider. At minimum retain provider logs or command output showing backup completion, backup accessibility, restore completion, and post-restore verification. Redact credentials and personal data from retained evidence.
