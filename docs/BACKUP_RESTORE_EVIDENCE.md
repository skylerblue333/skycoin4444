# Database backup/restore evidence contract

Issue #380 keeps database reliability at **PARTIAL** until an actual backup is restored into an isolated environment and the result is verified. This contract makes that evidence machine-checkable without pretending that repository tests perform a real managed-database restore.

## Required drill

1. Create or select a provider backup of the hosted beta database without exporting credentials into the repository.
2. Restore it into an **isolated restore-drill database**, never over the live beta database.
3. Record timestamps, the declared RPO/RTO, observed recovery point and restore duration, and at least two verification checks.
4. Do not put connection strings, passwords, access keys, session tokens, or private user data in the evidence JSON.
5. Run `node scripts/verify-backup-restore-evidence.mjs <evidence.json>`.
6. Retain provider-side identifiers/log evidence in the protected operational system and record only non-secret references in Issue #380.

The validator fails closed if the restore target equals the source environment, timestamps are invalid, RPO/RTO are exceeded, verification is not explicitly successful, checks are missing, or evidence declares that it contains secrets.

## Truth boundary

Passing this validator proves only that an evidence record satisfies the repository contract. It does **not** prove a backup existed, a restore occurred, provider durability, production readiness, or disaster-recovery certification. Gate 8 remains PARTIAL until a real isolated restore drill is performed and contemporaneous provider/runtime evidence is recorded.
