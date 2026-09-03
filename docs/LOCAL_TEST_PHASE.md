# Skycoin4444 Local Test Phase

This is the shortest supported path for exercising the working beta on one developer machine. It uses a local MySQL container and a development-only test account. It does not enable production OAuth, payments, custody, wallet signing, or chain execution.

## Prerequisites

Install Node.js 22+, pnpm 11+, and Docker Desktop or Docker Engine with Compose. The GitHub CLI is optional; ordinary Git is sufficient. If package downloads are slow, the repository `.npmrc` automatically uses longer timeouts and retries. Clone the canonical repository and install dependencies:

```bash
git clone https://github.com/skylerblue333/skycoin4444.git
cd skycoin4444
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm local:doctor
```

The supplied `.env.local.example` points to `127.0.0.1:3307` and a database named `skycoin4444_local`. The local database script refuses to reset or migrate any non-local hostname or database name. The migration set includes durable discovery bookmarks/search history and durable creator evidence drafts.

## Start the local test environment

```bash
pnpm local:up
pnpm local:db
pnpm dev:local
```

Open `http://localhost:3000/`. If port 3000 is busy, the server prints the actual port it selected. Set `BACKEND_BASE_URL` to that URL when running the smoke test; `LOCAL_BASE_URL` remains accepted as a compatibility alias.

The local test account is named **Local Test User** and is created only by the local database bootstrap. Run `pnpm local:db` after every schema migration so migrations 0001 through 0007 are applied in order.
 With `LOCAL_TEST_MODE=true`, development requests use this account when no OAuth session is present. The bypass is active only when both `NODE_ENV=development` and `LOCAL_TEST_MODE=true` are set.

## Smoke test

The smoke matrix includes `/a-i-tools-hub`, a deterministic browser-local AI sandbox for outlining, action extraction, and sensitive-term scanning. It does not call an AI provider and does not require provider credentials.

In a second terminal:

```bash
pnpm local:smoke
```

Expected results are successful HTTP checks for the home page, beta health, beta catalog, and the local AI sandbox, followed by confirmation that live financial or chain execution is disabled and signed-out `auth.me` returns `null`. If the route checks pass but readiness parsing fails with `Unexpected token '<'`, `LOCAL_BASE_URL` is pointing at a Vite-only app shell rather than the canonical backend process; start `pnpm dev:local` and use the port it prints.

Then manually exercise these routes:

| Route | Test |
| --- | --- |
| `/course-catalog` | Select a course, answer a question correctly, sign in through local test mode, mark a lesson complete, refresh, and confirm progress remains recorded. |
| `/community-hub` | Create a public community, join it, publish a thread, refresh, and confirm the thread remains. |
| `/activity-feed` | Publish a post, like it, open comments, reply, refresh, and confirm the post, reaction, and reply remain. |
| `/beta-feedback` | Submit a clear bug or content report and confirm the success state. |
| `/beta-web3` | Search local/testnet fixtures and confirm there are no wallet, signing, custody, transfer, or mainnet-write controls. |
| `/a-i-tools-hub` | Run outline, action extraction, and safety scan against a note; confirm the result is local-only and no provider-backed controls are presented. |
| `/discovery-center` | Search while signed out, then sign in and save a result; refresh and verify the durable bookmark and account-owned search history remain. |
| `/creator-analytics` | Sign in, save a content brief, mark it ready for review, refresh, and verify the draft persists; confirm publishing and monetization remain unavailable. |
| `/operational-readiness` | Verify the page shows JSON-backed health/readiness states and does not invent uptime, traffic, revenue, or chain claims. |

## Reset

To erase the local database and rebuild the schema:

```bash
pnpm local:reset
pnpm local:db
```

This command is intentionally blocked unless `DATABASE_URL` points to localhost and the database name ends in `_local`. Never point `.env.local` at Render, production, staging, or a shared database.

## Troubleshooting

If `pnpm install` reports slow tarballs or a timeout, rerun it after checking the network; the repository `.npmrc` has extended fetch timeouts and retries. The `gh` command is not required—use the documented `git clone` command. If MySQL is not ready, wait a few seconds and rerun `pnpm local:db`. If the smoke test reports that an API returned `text/html`, you are targeting the Vite app shell; start `pnpm dev:local`, use its printed backend port, and run `BACKEND_BASE_URL=http://localhost:<port> pnpm local:smoke`.
 If port 3307 is occupied, stop the conflicting process or change the host-side port in `docker-compose.local.yml` and update `DATABASE_URL` in `.env.local` to match. If protected pages show signed-out state, verify `.env.local` contains `LOCAL_TEST_MODE=true`, restart `pnpm dev:local`, and confirm the local database contains `local-test-user`.

## Current limits

This local phase validates application behavior and safety boundaries. It is not evidence of production availability, provider reliability, financial settlement, custody security, or mainnet correctness. Those remain separately gated.
