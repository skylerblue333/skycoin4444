# Skycoin Mission Control Beta Deployment Runbook

## Purpose

This runbook defines the evidence required to deploy the invitation-only Mission Control beta from GitHub to Render. GitHub remains the source of truth for pull requests, required CI, protected `main`, and immutable candidate tags. Render provides the full-stack Node runtime and managed database connection.

## Render service contract

The repository includes `render.yaml`. The service builds with `pnpm install --frozen-lockfile && pnpm run build`, starts with `pnpm start`, and reports health at `/api/beta/health`. Automatic deployment is disabled so a release owner promotes only a reviewed green commit.

The following values must be configured as Render secrets or environment variables; secret values must never be committed or pasted into GitHub issues: `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, and `OWNER_OPEN_ID`. Provider variables are required only for the bounded capability that uses them: `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`.

## First deployment procedure

A release owner connects the GitHub repository to Render, creates the service from `render.yaml`, configures the environment variables, and confirms the service uses the intended region and access policy. Before starting the application, the owner applies the migrations in order, including `0003_beta_feedback.sql` and `0004_profile_visibility.sql`, against the beta database. The owner then performs a manual deploy from the exact green `main` commit.

The smoke test must confirm that `/api/beta/health` returns the invitation-only release channel and 30-area catalog count, `/api/beta/areas` returns the conservative area registry, `/beta-catalog` renders, `/beta-journey` renders the education flow, `/beta-commerce` cannot charge or settle, `/beta-web3` remains local-only, and `/beta-feedback` requires authentication before accepting a report. The owner should capture the `X-Request-ID` from one API request and confirm the corresponding redacted completion signal is visible in the monitored log sink.

## Tester operations

Before inviting anyone, name one operations owner and one backup owner, configure the feedback destination and security-report path, define the response target for high-severity reports, and publish the privacy notice and beta terms. Invite only named testers. Do not enable live wallet, custody, token transfer, settlement, bridge, mining, staking, or mainnet execution capabilities through environment variables or route changes.

## Backup and recovery evidence

The database owner must document the backup schedule, retention, encryption, access list, and restore procedure. A restore drill must be completed against a non-production target before external testing. The release owner records the migration version, service commit, backup identifier, and rollback target for each promotion.

## Rollback

Rollback means returning the Render service to the prior verified immutable candidate tag or commit, not manually changing the running source. If a migration is not backward-compatible, pause promotion and follow the documented database recovery plan; do not guess at destructive rollback SQL during an incident.

## Promotion blockers

Promotion must stop if the health endpoint is unavailable, the feedback migration has not run, authentication is not configured, logs contain secrets or request bodies, backup/restore evidence is missing, the tester allowlist is undefined, or any high-risk capability appears available without its independent provider, security, operations, and legal evidence.
