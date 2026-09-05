# SKYCOIN4444 Hosted Beta Rollback

This runbook defines the application rollback boundary for the invitation-only engineering beta.

A rollback is a controlled recovery action, not evidence of production certification, uninterrupted availability, or a database recovery guarantee.

## Rollback trigger

Consider an application rollback when the currently deployed revision has a verified regression such as:

- readiness no longer returns HTTP 200;
- required configuration or database readiness becomes invalid because of application behavior;
- the service fails to start or repeatedly crashes;
- a newly introduced authentication or authorization path fails closed incorrectly or weakens a verified boundary;
- a critical beta workflow regresses and a previously verified application revision is known to avoid it.

Do not roll back merely to bypass a failing CI gate.

## Required rollback target evidence

The target application revision must have all of the following recorded before it is selected:

1. exact Git commit SHA;
2. canonical PR or other reviewed source history;
3. exact-head required CI green for that revision;
4. a prior hosted deployment in the same environment that reached `SUCCESS`;
5. a successful required readiness healthcheck;
6. no known unresolved security incident that makes the target unsafe to restore.

Record the selected target and reason in Issue #272 before or immediately after an emergency rollback.

## Database boundary

Application rollback and database rollback are separate operations.

**Do not automatically roll back the managed MySQL schema or data when rolling back application code.**

Before restoring an older application revision, compare the current database schema expectations with the target revision:

- if the intervening release made no schema/data migration, application rollback may proceed without a database change;
- if the intervening release added only backward-compatible schema, verify the older application tolerates it before rollback;
- if the intervening release made destructive, incompatible, or data-transforming changes, stop and prepare a reviewed database recovery/forward-fix plan.

Never replay the empty-database bootstrap against a non-empty beta database.

A hosting-platform volume snapshot or managed-database backup is not assumed by this repository. External backup/restore behavior must be verified separately before it is relied upon.

## Railway application rollback procedure

For the current Railway-hosted beta:

1. confirm the selected target SHA satisfies the evidence above;
2. confirm the current MySQL service remains healthy and determine whether the target requires any database action;
3. preserve the existing service, domain, private `DATABASE_URL` reference, secrets, start command, and `/api/beta/readiness` healthcheck;
4. synchronize the existing `skycoin4444-beta-app` service to the exact target SHA;
5. trigger one deployment of that SHA;
6. do not move traffic manually before Railway reports the new deployment healthcheck successful;
7. verify the deployment reaches `SUCCESS`;
8. run the public hosted smoke contract;
9. if private secret injection is available, run the credentialed hosted smoke contract without exposing the email, access key, cookie, or JWT;
10. record the rollback deployment ID, target SHA, reason, and verification result in Issue #272.

Do not create a duplicate app service as a substitute for a controlled rollback.

## Post-rollback verification

At minimum verify:

- `GET /` succeeds;
- `GET /signin` succeeds;
- `GET /api/beta/health` is healthy;
- `GET /api/beta/readiness` returns HTTP 200 with `status=ready`, `database=ok`, and `configuration=ok`;
- `GET /api/runtime/ready` returns HTTP 200;
- `GET /api/beta/auth` reports the expected auth mode and `configured=true`;
- `identityVerification=false` remains explicit;
- `liveFinancialOrChainExecution=false` remains explicit.

Use `pnpm beta:smoke:hosted` for the repeatable smoke contract.

## Forward recovery

A rollback is temporary risk reduction. After service is stable:

1. identify the regression;
2. fix it on a new branch;
3. run all required exact-head CI;
4. merge through the canonical PR;
5. deploy the new merged SHA;
6. re-run hosted verification;
7. record the forward recovery evidence.

Do not rewrite or force-push `main` to simulate a rollback.

## Current-release example

Issue #272 records the actual selected rollback target for each hosted release.

For the release that introduced the secret-safe hosted beta smoke verifier (#306), the immediately prior hosted application revision was #305. That prior revision is eligible as a rollback candidate only because it was exact-head CI green, deployed successfully, passed readiness, and #306 did not change the database schema.

The issue ledger, not this example paragraph, is the current source of truth for the active rollback target.
