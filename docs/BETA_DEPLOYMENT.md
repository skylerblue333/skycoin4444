# SKYCOIN4444 Invitation Beta Deployment

This document defines the first deployable engineering-beta contract. It does **not** claim that a public beta is currently deployed.

## Release model

The target is one invitation-only web service backed by a dedicated managed MySQL beta database. The deployment must fail closed when identity, database, session, public-origin, or invitation configuration is incomplete.

The repository contains a Render web-service blueprint in `render.yaml`. That blueprint does not provision or certify a database, OAuth provider, DNS, TLS, backups, or monitoring by itself.

## Required production configuration

Before starting `pnpm start` with `NODE_ENV=production`, configure:

| Variable | Requirement |
| --- | --- |
| `DATABASE_URL` | Remote `mysql://` URL naming a dedicated beta database; localhost is rejected. |
| `JWT_SECRET` | At least 32 bytes. |
| `VITE_APP_ID` | Approved application identifier used by server and client session/OAuth flow. |
| `OAUTH_SERVER_URL` | HTTPS OAuth service URL. |
| `VITE_OAUTH_PORTAL_URL` | HTTPS browser login portal URL. |
| `BETA_PUBLIC_ORIGIN` | Exact HTTPS deployment origin, with no path or query. |
| `BETA_ACCESS_MODE` | Must be `invite_only` in production. |
| `OWNER_OPEN_ID` | Optional owner admission identity. |
| `BETA_ALLOWED_EMAILS` | Optional comma-separated invited OAuth emails. |
| `BETA_ALLOWED_OPEN_IDS` | Optional comma-separated invited OAuth open IDs. |
| `LOCAL_TEST_MODE` | Must be false in production. |

At least one owner/open-ID/email invitation must be configured. Missing or invalid configuration stops the production server rather than exposing a partial beta.

## First managed database bootstrap

The historical SQL files predate the current runtime schema and must not be replayed blindly against a new managed beta database.

For a **brand-new empty beta database only**:

1. Create a dedicated empty MySQL database and record its owner, environment, retention/backups policy, and connection boundary.
2. Set `DATABASE_URL` to that database.
3. Independently verify that the target is disposable and contains no existing tables or user data.
4. Set `BETA_DB_BOOTSTRAP_CONFIRM=EMPTY_BETA_DATABASE`.
5. Run:

```bash
pnpm beta:db:bootstrap
```

The bootstrap refuses localhost, refuses any non-empty database, synchronizes from canonical `drizzle/schema.ts`, and verifies core account/feedback/course/social/audit tables. It creates no seed users, balances, transactions, wallet state, or provider data.

For any non-empty database, do **not** use this command. Prepare and review a forward migration against the exact existing schema instead.

## Identity and admission behavior

The browser sign-in route never accepts a SKYCOIN4444 password. Authentication starts only through the configured OAuth provider.

After OAuth returns an identity, the server checks the invitation policy **before** persisting the user or issuing a session. Protected requests re-check the policy, so removal from the allowlist revokes subsequent authorized use even if an old cookie remains in the browser.

Production OAuth callbacks are restricted to `/api/oauth/callback` on the configured `BETA_PUBLIC_ORIGIN`.

## Deployment verification

A candidate deployment is not beta-ready until all of these are recorded:

1. exact merged `main` SHA;
2. exact-head CI success;
3. managed database bootstrap or reviewed forward migration evidence;
4. Render/service deployment identifier and HTTPS URL;
5. `/api/beta/health` returns `status=ok`;
6. `/api/beta/readiness` returns `status=ready`, `database=ok`, and `configuration=ok`;
7. an invited account can complete OAuth and load a protected route;
8. an uninvited account is denied without receiving a session;
9. profile update survives refresh;
10. one social or SkySchool action survives refresh;
11. beta feedback reaches durable storage;
12. rollback target and response owner are recorded.

## Explicit limits

This deployment contract does not enable or prove payment settlement, banking, custody, signing, wallet transfers, token issuance, staking, mining, mainnet blockchain writes, regulatory approval, provider-backed AI, livestream ingest/CDN delivery, production-grade security certification, or uninterrupted availability.
